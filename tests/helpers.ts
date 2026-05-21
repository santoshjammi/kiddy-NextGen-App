/**
 * Shared test helpers for Kiddy Playwright tests.
 *
 * Firebase Emulator must be running for auth/Firestore helpers:
 *   firebase emulators:start --only auth,firestore
 *
 * Set env vars:
 *   FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
 *   FIRESTORE_EMULATOR_HOST=localhost:8080
 */

import { Page } from '@playwright/test';

// ── Emulator REST helpers ─────────────────────────────────────────

const AUTH_EMU = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? 'localhost:9099';
const FIRESTORE_EMU = process.env.FIRESTORE_EMULATOR_HOST ?? 'localhost:8080';
const FIREBASE_PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'kiddy-7badf';

/**
 * Create a fake Google user in the Auth emulator and return the uid.
 * Does NOT require browser interaction — uses the emulator REST API.
 */
export async function createEmulatorUser(
  email: string,
  displayName = 'Test Parent'
): Promise<string> {
  const res = await fetch(
    `http://${AUTH_EMU}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Test1234!', displayName, returnSecureToken: true }),
    }
  );
  if (!res.ok) throw new Error(`Auth emulator signUp failed: ${await res.text()}`);
  const data = await res.json();
  return data.localId as string;
}

/**
 * Sign in as a test user via the Auth emulator and inject the id_token
 * into the Playwright page's localStorage so Firebase SDK picks it up.
 *
 * Call this before navigating to any protected page.
 */
export async function signInAsTestUser(
  page: Page,
  email: string,
  password = 'Test1234!'
): Promise<string> {
  // Get auth token from emulator
  const res = await fetch(
    `http://${AUTH_EMU}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  if (!res.ok) throw new Error(`Auth emulator sign-in failed: ${await res.text()}`);
  const { idToken, localId } = await res.json() as { idToken: string; localId: string };

  // Inject token so Firebase Auth SDK recognises it on next page load
  await page.addInitScript(
    ([uid, token]) => {
      const key = `firebase:authUser:${uid}:default`;
      const user = { uid, email: '', stsTokenManager: { accessToken: token } };
      localStorage.setItem(key, JSON.stringify(user));
    },
    [localId, idToken]
  );

  return localId;
}

/**
 * Write a Firestore document via the emulator REST API (no SDK needed).
 * path example: "users/uid123/rewards/current"
 */
export async function firestoreSet(
  path: string,
  data: Record<string, unknown>
): Promise<void> {
  // Convert JS object to Firestore REST format
  function toFirestoreValue(v: unknown): unknown {
    if (v === null) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (typeof v === 'string') return { stringValue: v };
    if (typeof v === 'object')
      return {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(v as Record<string, unknown>).map(([k, val]) => [k, toFirestoreValue(val)])
          ),
        },
      };
    return { stringValue: String(v) };
  }

  const parts = path.split('/');
  const collectionPath = parts.slice(0, -1).join('/');
  const docId = parts[parts.length - 1];

  const url = `http://${FIRESTORE_EMU}/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${collectionPath}/${docId}`;
  const body = {
    fields: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])
    ),
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Firestore patch failed (${path}): ${await res.text()}`);
}

/**
 * Read a Firestore document from the emulator. Returns null if not found.
 */
export async function firestoreGet(path: string): Promise<Record<string, unknown> | null> {
  const url = `http://${FIRESTORE_EMU}/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${path}`;
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore get failed (${path}): ${await res.text()}`);
  const doc = await res.json() as { fields?: Record<string, { booleanValue?: boolean; stringValue?: string; integerValue?: string }> };

  // Simplified deserialiser — handles boolean, string, integer
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(doc.fields ?? {})) {
    if ('booleanValue' in v) out[k] = v.booleanValue;
    else if ('stringValue' in v) out[k] = v.stringValue;
    else if ('integerValue' in v) out[k] = Number(v.integerValue);
    else out[k] = v;
  }
  return out;
}

/**
 * Clear all emulator data — call in beforeAll/afterAll to reset state.
 */
export async function clearEmulatorData(): Promise<void> {
  await fetch(
    `http://${FIRESTORE_EMU}/emulator/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`,
    { method: 'DELETE' }
  );
  await fetch(`http://${AUTH_EMU}/emulator/v1/projects/${FIREBASE_PROJECT}/accounts`, {
    method: 'DELETE',
  });
}
