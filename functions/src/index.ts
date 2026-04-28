/**
 * Kiddy Firebase Cloud Functions
 *
 * Handles Razorpay billing integration:
 *   - createRazorpayOrder:    creates a Razorpay order for ₹299/month (callable)
 *   - verifyRazorpayPayment:  verifies HMAC signature, activates premium (callable)
 *
 * Setup:
 *   1. Set Firebase secrets:
 *        firebase functions:secrets:set RAZORPAY_KEY_ID
 *        firebase functions:secrets:set RAZORPAY_KEY_SECRET
 *   2. Deploy:
 *        cd functions && npm install && cd ..
 *        firebase deploy --only functions
 *   3. In app/upgrade/page.tsx set:
 *        const RAZORPAY_BILLING_ENABLED = true;
 *
 * Razorpay does NOT use separate webhooks for the basic integration — the
 * client receives payment ID + signature and calls verifyRazorpayPayment.
 * The optional razorpayWebhook function handles subscription lifecycle events.
 */

import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

admin.initializeApp();

const razorpayKeyId = defineSecret('RAZORPAY_KEY_ID');
const razorpayKeySecret = defineSecret('RAZORPAY_KEY_SECRET');

// ₹299 in paise (smallest unit)
const AMOUNT_PAISE = 29900;

// ── createRazorpayOrder ───────────────────────────────────────────
// Called from the client when the parent clicks "Subscribe ₹299/month".
// Creates a Razorpay order and returns orderId + public key_id to the client.
export const createRazorpayOrder = onCall(
  {
    secrets: [razorpayKeyId, razorpayKeySecret],
    region: 'asia-south1',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in to subscribe.');
    }

    const uid = request.auth.uid;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Razorpay = require('razorpay');
    const rzp = new Razorpay({
      key_id: razorpayKeyId.value(),
      key_secret: razorpayKeySecret.value(),
    });

    try {
      const order = await rzp.orders.create({
        amount: AMOUNT_PAISE,
        currency: 'INR',
        receipt: `kiddy_${uid}_${Date.now()}`,
        notes: { firebaseUid: uid },
      });

      return {
        orderId: order.id as string,
        amount: order.amount as number,
        currency: order.currency as string,
        keyId: razorpayKeyId.value(),
      };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new HttpsError('internal', 'Failed to create payment order.');
    }
  }
);

// ── verifyRazorpayPayment ─────────────────────────────────────────
// Called from the client after Razorpay handler() fires.
// Verifies the payment signature and activates premium in Firestore.
export const verifyRazorpayPayment = onCall(
  {
    secrets: [razorpayKeySecret],
    region: 'asia-south1',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.');
    }

    const uid = request.auth.uid;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      request.data as {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new HttpsError('invalid-argument', 'Missing payment verification fields.');
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret.value())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error(`Signature mismatch for uid ${uid}`);
      throw new HttpsError('permission-denied', 'Payment signature verification failed.');
    }

    // Activate premium in Firestore using Admin SDK (bypasses security rules)
    try {
      await admin
        .firestore()
        .doc(`users/${uid}/rewards/current`)
        .set(
          {
            isPremium: true,
            premiumActivatedAt: new Date().toISOString(),
            subscriptionStatus: 'active',
            razorpayPaymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
          },
          { merge: true }
        );

      console.log(`Premium activated for uid: ${uid}, payment: ${razorpay_payment_id}`);
      return { success: true };
    } catch (error) {
      console.error('Firestore write failed:', error);
      throw new HttpsError('internal', 'Failed to activate premium.');
    }
  }
);

// ── razorpayWebhook ───────────────────────────────────────────────
// Optional: handle Razorpay webhook events for subscription lifecycle.
// Configure in Razorpay Dashboard → Settings → Webhooks.
// Events to subscribe: payment.captured, subscription.cancelled
export const razorpayWebhook = onRequest(
  {
    secrets: [razorpayKeySecret],
    region: 'asia-south1',
  },
  async (req, res) => {
    const webhookSecret = razorpayKeySecret.value();
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!signature) {
      res.status(400).send('Missing x-razorpay-signature header');
      return;
    }

    // Verify webhook signature
    const rawBody = (req as unknown as { rawBody: Buffer }).rawBody;
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSig !== signature) {
      res.status(400).send('Webhook signature verification failed');
      return;
    }

    const event = req.body as {
      event: string;
      payload?: {
        payment?: { entity?: { notes?: { firebaseUid?: string }; id?: string } };
        subscription?: { entity?: { notes?: { firebaseUid?: string } } };
      };
    };

    if (event.event === 'payment.captured') {
      const uid = event.payload?.payment?.entity?.notes?.firebaseUid;
      const paymentId = event.payload?.payment?.entity?.id;
      if (uid) {
        await admin
          .firestore()
          .doc(`users/${uid}/rewards/current`)
          .set(
            {
              isPremium: true,
              premiumActivatedAt: new Date().toISOString(),
              subscriptionStatus: 'active',
              razorpayPaymentId: paymentId ?? null,
            },
            { merge: true }
          )
          .catch(console.error);
        console.log(`Webhook: premium activated for uid ${uid}`);
      }
    } else if (event.event === 'subscription.cancelled') {
      const uid = event.payload?.subscription?.entity?.notes?.firebaseUid;
      if (uid) {
        await admin
          .firestore()
          .doc(`users/${uid}/rewards/current`)
          .set(
            {
              isPremium: false,
              subscriptionStatus: 'cancelled',
            },
            { merge: true }
          )
          .catch(console.error);
        console.log(`Webhook: premium cancelled for uid ${uid}`);
      }
    }

    res.status(200).json({ received: true });
  }
);


