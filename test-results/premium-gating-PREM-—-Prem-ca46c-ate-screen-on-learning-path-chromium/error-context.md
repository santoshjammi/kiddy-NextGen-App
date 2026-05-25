# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: premium-gating.spec.ts >> PREM — Premium Gating >> PREM-001 free user sees gate screen on /learning-path
- Location: tests/premium-gating.spec.ts:18:7

# Error details

```
TypeError: fetch failed
```

# Test source

```ts
  46  |  */
  47  | export async function signInAsTestUser(
  48  |   page: Page,
  49  |   email: string,
  50  |   password = 'Test1234!'
  51  | ): Promise<string> {
  52  |   // Get auth token from emulator
  53  |   const res = await fetch(
  54  |     `http://${AUTH_EMU}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`,
  55  |     {
  56  |       method: 'POST',
  57  |       headers: { 'Content-Type': 'application/json' },
  58  |       body: JSON.stringify({ email, password, returnSecureToken: true }),
  59  |     }
  60  |   );
  61  |   if (!res.ok) throw new Error(`Auth emulator sign-in failed: ${await res.text()}`);
  62  |   const { idToken, localId } = await res.json() as { idToken: string; localId: string };
  63  | 
  64  |   // Inject token so Firebase Auth SDK recognises it on next page load
  65  |   await page.addInitScript(
  66  |     ([uid, token]) => {
  67  |       const key = `firebase:authUser:${uid}:default`;
  68  |       const user = { uid, email: '', stsTokenManager: { accessToken: token } };
  69  |       localStorage.setItem(key, JSON.stringify(user));
  70  |     },
  71  |     [localId, idToken]
  72  |   );
  73  | 
  74  |   return localId;
  75  | }
  76  | 
  77  | /**
  78  |  * Write a Firestore document via the emulator REST API (no SDK needed).
  79  |  * path example: "users/uid123/rewards/current"
  80  |  */
  81  | export async function firestoreSet(
  82  |   path: string,
  83  |   data: Record<string, unknown>
  84  | ): Promise<void> {
  85  |   // Convert JS object to Firestore REST format
  86  |   function toFirestoreValue(v: unknown): unknown {
  87  |     if (v === null) return { nullValue: null };
  88  |     if (typeof v === 'boolean') return { booleanValue: v };
  89  |     if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  90  |     if (typeof v === 'string') return { stringValue: v };
  91  |     if (typeof v === 'object')
  92  |       return {
  93  |         mapValue: {
  94  |           fields: Object.fromEntries(
  95  |             Object.entries(v as Record<string, unknown>).map(([k, val]) => [k, toFirestoreValue(val)])
  96  |           ),
  97  |         },
  98  |       };
  99  |     return { stringValue: String(v) };
  100 |   }
  101 | 
  102 |   const parts = path.split('/');
  103 |   const collectionPath = parts.slice(0, -1).join('/');
  104 |   const docId = parts[parts.length - 1];
  105 | 
  106 |   const url = `http://${FIRESTORE_EMU}/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${collectionPath}/${docId}`;
  107 |   const body = {
  108 |     fields: Object.fromEntries(
  109 |       Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])
  110 |     ),
  111 |   };
  112 | 
  113 |   const res = await fetch(url, {
  114 |     method: 'PATCH',
  115 |     headers: { 'Content-Type': 'application/json' },
  116 |     body: JSON.stringify(body),
  117 |   });
  118 |   if (!res.ok) throw new Error(`Firestore patch failed (${path}): ${await res.text()}`);
  119 | }
  120 | 
  121 | /**
  122 |  * Read a Firestore document from the emulator. Returns null if not found.
  123 |  */
  124 | export async function firestoreGet(path: string): Promise<Record<string, unknown> | null> {
  125 |   const url = `http://${FIRESTORE_EMU}/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${path}`;
  126 |   const res = await fetch(url);
  127 |   if (res.status === 404) return null;
  128 |   if (!res.ok) throw new Error(`Firestore get failed (${path}): ${await res.text()}`);
  129 |   const doc = await res.json() as { fields?: Record<string, { booleanValue?: boolean; stringValue?: string; integerValue?: string }> };
  130 | 
  131 |   // Simplified deserialiser — handles boolean, string, integer
  132 |   const out: Record<string, unknown> = {};
  133 |   for (const [k, v] of Object.entries(doc.fields ?? {})) {
  134 |     if ('booleanValue' in v) out[k] = v.booleanValue;
  135 |     else if ('stringValue' in v) out[k] = v.stringValue;
  136 |     else if ('integerValue' in v) out[k] = Number(v.integerValue);
  137 |     else out[k] = v;
  138 |   }
  139 |   return out;
  140 | }
  141 | 
  142 | /**
  143 |  * Clear all emulator data — call in beforeAll/afterAll to reset state.
  144 |  */
  145 | export async function clearEmulatorData(): Promise<void> {
> 146 |   await fetch(
      |   ^ TypeError: fetch failed
  147 |     `http://${FIRESTORE_EMU}/emulator/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`,
  148 |     { method: 'DELETE' }
  149 |   );
  150 |   await fetch(`http://${AUTH_EMU}/emulator/v1/projects/${FIREBASE_PROJECT}/accounts`, {
  151 |     method: 'DELETE',
  152 |   });
  153 | }
  154 | 
```