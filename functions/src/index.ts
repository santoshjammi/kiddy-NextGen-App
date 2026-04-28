/**
 * Kiddy Firebase Cloud Functions
 * 
 * Handles Stripe billing integration:
 *   - createCheckoutSession: creates a Stripe Checkout session for ₹299/month
 *   - stripeWebhook: handles Stripe webhook events to activate premium access
 * 
 * Setup:
 *   1. Set Firebase secrets:
 *      firebase functions:secrets:set STRIPE_SECRET_KEY
 *      firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
 *      firebase functions:secrets:set STRIPE_PRICE_ID
 *   2. Create a product + price in Stripe Dashboard:
 *      Product: "Kiddy Premium", Price: ₹299/month recurring
 *   3. Deploy: firebase deploy --only functions
 *   4. Add Stripe webhook endpoint in Stripe Dashboard:
 *      URL: https://<region>-<project>.cloudfunctions.net/stripeWebhook
 *      Event: checkout.session.completed
 *   5. Update the upgrade page with the deployed function URL
 */

import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';

admin.initializeApp();

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');
const stripePriceId = defineSecret('STRIPE_PRICE_ID');

// ── createCheckoutSession ─────────────────────────────────────────
// Called from the client (upgrade page) when the parent clicks "Subscribe"
// Returns a Stripe Checkout session URL to redirect to.
export const createCheckoutSession = onCall(
  {
    secrets: [stripeSecretKey, stripePriceId],
    region: 'asia-south1', // Mumbai — closest to India
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in to subscribe.');
    }

    const uid = request.auth.uid;
    const email = request.auth.token.email ?? '';

    // Dynamically import Stripe (installed as production dep)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeSecretKey.value(), { apiVersion: '2024-06-20' });

    // Determine success/cancel URLs — update with your actual domain
    const appUrl = 'https://kiddy.app'; // TODO: replace with actual domain
    const successUrl = `${appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/upgrade?payment=cancelled`;

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price: stripePriceId.value(),
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          firebaseUid: uid,
        },
        subscription_data: {
          metadata: { firebaseUid: uid },
        },
        // Allow Indian payment methods
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic',
          },
        },
      });

      return { url: session.url };
    } catch (error: unknown) {
      console.error('Stripe session creation failed:', error);
      throw new HttpsError('internal', 'Failed to create checkout session.');
    }
  }
);

// ── stripeWebhook ─────────────────────────────────────────────────
// Stripe calls this URL after a successful payment.
// Verifies the signature and activates premium in Firestore.
export const stripeWebhook = onRequest(
  {
    secrets: [stripeSecretKey, stripeWebhookSecret],
    region: 'asia-south1',
  },
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeSecretKey.value(), { apiVersion: '2024-06-20' });

    const sig = req.headers['stripe-signature'] as string;
    if (!sig) {
      res.status(400).send('Missing stripe-signature header');
      return;
    }

    let event: ReturnType<typeof stripe.webhooks.constructEvent>;
    try {
      // req.rawBody is available in Firebase Functions v2
      event = stripe.webhooks.constructEvent(
        (req as unknown as { rawBody: Buffer }).rawBody,
        sig,
        stripeWebhookSecret.value()
      );
    } catch (err: unknown) {
      console.error('Webhook signature verification failed:', err);
      res.status(400).send('Webhook signature verification failed');
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as {
        metadata?: { firebaseUid?: string };
        customer?: string;
        subscription?: string;
        customer_email?: string;
      };

      const uid = session.metadata?.firebaseUid;
      if (!uid) {
        console.error('No firebaseUid in session metadata');
        res.status(400).send('No firebaseUid in metadata');
        return;
      }

      try {
        // Write premium status to Firestore using Admin SDK (bypasses security rules)
        await admin.firestore()
          .doc(`users/${uid}/rewards/current`)
          .set(
            {
              isPremium: true,
              premiumActivatedAt: new Date().toISOString(),
              subscriptionStatus: 'active',
              stripeCustomerId: session.customer ?? null,
              stripeSubscriptionId: session.subscription ?? null,
            },
            { merge: true }
          );

        console.log(`Premium activated for uid: ${uid}`);
        res.status(200).json({ received: true });
      } catch (error) {
        console.error('Firestore write failed:', error);
        res.status(500).send('Firestore write failed');
        return;
      }
    } else if (event.type === 'customer.subscription.deleted') {
      // Handle cancellation — downgrade to free
      const subscription = event.data.object as { metadata?: { firebaseUid?: string } };
      const uid = subscription.metadata?.firebaseUid;
      if (uid) {
        await admin.firestore()
          .doc(`users/${uid}/rewards/current`)
          .set(
            {
              isPremium: false,
              subscriptionStatus: 'cancelled',
            },
            { merge: true }
          )
          .catch(console.error);
        console.log(`Premium cancelled for uid: ${uid}`);
      }
      res.status(200).json({ received: true });
    } else {
      // Acknowledge other events
      res.status(200).json({ received: true });
    }
  }
);
