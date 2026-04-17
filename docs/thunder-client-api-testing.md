# FacePay API — Thunder Client testing guide

Use this document to exercise every HTTP route the backend exposes.

## Base URLs

| Environment | Base URL (no trailing slash) |
|-------------|------------------------------|
| **Production (Render)** | `https://facepay-inrz.onrender.com` |
| `npm run dev` (default `PORT=3000`) | `http://localhost:3000` |
| Docker Compose (`docker compose up` from `backend`) | `http://localhost:4000` |

Replace `{{baseUrl}}` below with your choice. For production Thunder Client env, set:

`baseUrl` = `https://facepay-inrz.onrender.com`

**Production demo login** (if DB was seeded on Render): `9876543210` / `demo123`.

---

## Thunder Client setup (once)

1. Create an **Environment** with variable `baseUrl` (and optionally `token`).
2. For production, set `baseUrl` to `https://facepay-inrz.onrender.com`.
3. For protected routes, set header **`Authorization`**: `Bearer <access_token>`  
   - After **Login** or **Signup**, copy `token` from the JSON body into your env or paste into the header.

**Content-Type:** use `application/json` for all requests that have a body.

**Errors:** validation and app errors usually look like:

```json
{
  "code": "SOME_CODE",
  "message": "Human readable message",
  "details": {}
}
```

`VALIDATION_ERROR` responses may include Zod `details` instead of an empty object.

---

## Route index — all endpoints (production URLs)

Full URLs below use **`https://facepay-inrz.onrender.com`**. Swap the origin for `{{baseUrl}}` when testing locally.

| # | Method | URL | Auth | Request | Success response |
|---|--------|-----|------|---------|------------------|
| 1 | `GET` | `https://facepay-inrz.onrender.com/health` | No | — | **200** `{ "status": "ok" }` |
| 2 | `POST` | `https://facepay-inrz.onrender.com/api/v1/auth/signup` | No | JSON: `name`, `mobile`, `email`, `password` | **201** `{ "user": {…}, "token": "…" }` |
| 3 | `POST` | `https://facepay-inrz.onrender.com/api/v1/auth/login` | No | JSON: `mobile`, `password` | **200** `{ "user": {…}, "token": "…" }` |
| 4 | `POST` | `https://facepay-inrz.onrender.com/api/v1/auth/logout` | Bearer | JSON body `{}` optional | **204** empty |
| 5 | `GET` | `https://facepay-inrz.onrender.com/api/v1/users` | Bearer | Query: `search`, `limit`, `cursor` (optional) | **200** `{ "items": […], "nextCursor": … }` |
| 6 | `GET` | `https://facepay-inrz.onrender.com/api/v1/users/:userId` | Bearer | Path: UUID | **200** `{ "id", "name", "mobile", "avatar?" }` |
| 7 | `GET` | `https://facepay-inrz.onrender.com/api/v1/me/wallet/balance` | Bearer | — | **200** `{ "balance": number }` |
| 8 | `POST` | `https://facepay-inrz.onrender.com/api/v1/me/wallet/add-funds` | Bearer | JSON: `{ "amount": number }` | **200** `{ "newBalance", "timestamp" }` |
| 9 | `POST` | `https://facepay-inrz.onrender.com/api/v1/transfers` | Bearer + header **`Idempotency-Key`** | JSON: `recipientId`, `amount`, `note?` | **201** / **200** (replay) `{ "transactionId", "amount", "recipientId", "timestamp", "newBalance" }` |
| 10 | `GET` | `https://facepay-inrz.onrender.com/api/v1/me/transactions` | Bearer | Query: `direction`, `search`, `limit`, `cursor` (optional) | **200** `{ "items": […], "nextCursor": … }` |
| 11 | `PUT` | `https://facepay-inrz.onrender.com/api/v1/me/face-template` | Bearer | JSON: `{ "descriptor": number[] }` | **200** `{ "success": true }` |
| 12 | `GET` | `https://facepay-inrz.onrender.com/api/v1/me/face-template` | Bearer | — | **200** `{ "descriptor": number[] \| null }` |
| 13 | `DELETE` | `https://facepay-inrz.onrender.com/api/v1/me/face-template` | Bearer | — | **204** empty |
| 14 | `GET` | `https://facepay-inrz.onrender.com/api/v1/me` | Bearer | — | **200** `{ "id", "name", "mobile", "email", "joinedAt", "faceRegistered", "avatar?" }` |
| 15 | `GET` | `https://facepay-inrz.onrender.com/api/v1/me/security-summary` | Bearer | — | **200** `{ "score", "faceRegistered", "emailVerified", "pinEnabled" }` |
| 16 | `GET` | `https://facepay-inrz.onrender.com/api/v1/me/receive-qr` | Bearer | — | **200** `{ "userId", "name", "mobile" }` |

---

## 1. Health (no auth)

### `GET /health`

**What it does:** Liveness check. Does not touch the database.

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/health` |
| Headers | (none required) |
| Body | — |

**Example response** — `200 OK`

```json
{
  "status": "ok"
}
```

---

## 2. Auth

### `POST /api/v1/auth/signup`

**What it does:** Creates a user, wallet, opening ledger entry, and returns a JWT. Mobile is normalized (spaces stripped).

| Field | Value |
|--------|--------|
| Method | `POST` |
| URL | `{{baseUrl}}/api/v1/auth/signup` |
| Headers | `Content-Type: application/json` |
| Body | JSON (see below) |

**Request body**

| Field | Rules |
|--------|--------|
| `name` | string, 1–120 chars |
| `mobile` | string, 3–32 chars (digits; spaces allowed, stripped server-side) |
| `email` | valid email, max 255 chars |
| `password` | string, 6–128 chars |

**Example request body**

```json
{
  "name": "Test User",
  "mobile": "9123456789",
  "email": "testuser@example.com",
  "password": "secret12"
}
```

**Example response** — `201 Created`

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Test User",
    "mobile": "9123456789",
    "email": "testuser@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

`avatar` appears on `user` only if set.

---

### `POST /api/v1/auth/login`

**What it does:** Validates mobile + password and returns the same shape as signup (user + JWT).

| Field | Value |
|--------|--------|
| Method | `POST` |
| URL | `{{baseUrl}}/api/v1/auth/login` |
| Headers | `Content-Type: application/json` |

**Request body**

| Field | Rules |
|--------|--------|
| `mobile` | string, 3–32 |
| `password` | non-empty string |

**Example request body** (matches seeded demo user if you ran `npm run db:seed` / Docker seed)

```json
{
  "mobile": "9876543210",
  "password": "demo123"
}
```

**Example response** — `200 OK`

```json
{
  "user": {
    "id": "…",
    "name": "Adesh M",
    "mobile": "9876543210",
    "email": "adesh@facepay.demo"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### `POST /api/v1/auth/logout`

**What it does:** Stateless JWT logout hook (server accepts the call; client should discard the token).

| Field | Value |
|--------|--------|
| Method | `POST` |
| URL | `{{baseUrl}}/api/v1/auth/logout` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |
| Body | `{}` (empty object is fine) |

**Example response** — `204 No Content` (empty body)

---

## 3. Users (auth required)

**Header:** `Authorization: Bearer <token>`

### `GET /api/v1/users`

**What it does:** Paginated directory of other users (excludes you). Optional search by name (case-insensitive) or mobile substring.

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/api/v1/users` |
| Query | optional — see below |

**Query parameters**

| Name | Optional | Description |
|------|-----------|-------------|
| `search` | yes | Filter by name or mobile |
| `limit` | yes | 1–100, default `20` |
| `cursor` | yes | From previous response `nextCursor` |

**Example URL**

```
{{baseUrl}}/api/v1/users?search=rohan&limit=10
```

**Example response** — `200 OK`

```json
{
  "items": [
    {
      "id": "…",
      "name": "Rohan Sharma",
      "mobile": "9876543201",
      "avatar": "https://…"
    }
  ],
  "nextCursor": "eyJ0Ijoi…"
}
```

`nextCursor` is `null` when there is no next page. `avatar` is omitted if not set.

---

### `GET /api/v1/users/:userId`

**What it does:** Public-style profile for one user by UUID (used for send flow / recipient details).

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/api/v1/users/<UUID>` |

**Example**

```
{{baseUrl}}/api/v1/users/550e8400-e29b-41d4-a716-446655440001
```

**Example response** — `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Rohan Sharma",
  "mobile": "9876543201"
}
```

**Example error** — `404` — user id not found

```json
{
  "code": "NOT_FOUND",
  "message": "User not found",
  "details": {}
}
```

---

## 4. Wallet (auth required)

### `GET /api/v1/me/wallet/balance`

**What it does:** Returns current wallet balance in **INR (rupees)** as a number.

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/api/v1/me/wallet/balance` |
| Headers | `Authorization: Bearer <token>` |

**Example response** — `200 OK`

```json
{
  "balance": 10000
}
```

---

### `POST /api/v1/me/wallet/add-funds`

**What it does:** Credits the wallet (demo “top up”), writes a ledger entry.

| Field | Value |
|--------|--------|
| Method | `POST` |
| URL | `{{baseUrl}}/api/v1/me/wallet/add-funds` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |

**Request body**

| Field | Rules |
|--------|--------|
| `amount` | number, **positive**, max **1_000_000** (rupees) |

**Example request body**

```json
{
  "amount": 500
}
```

**Example response** — `200 OK`

```json
{
  "newBalance": 10500,
  "timestamp": "2026-04-13T12:00:00.000Z"
}
```

---

## 5. Transfers (auth required)

### `POST /api/v1/transfers`

**What it does:** Moves money from your wallet to another user’s wallet in one transaction. Requires **`Idempotency-Key`** header (max 128 chars). Repeating the same key for the same sender returns the same outcome (replay) with `200` instead of `201`.

| Field | Value |
|--------|--------|
| Method | `POST` |
| URL | `{{baseUrl}}/api/v1/transfers` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json`, **`Idempotency-Key: <unique-string>`** |

**Request body**

| Field | Rules |
|--------|--------|
| `recipientId` | UUID string |
| `amount` | positive number (INR rupees), max **100_000** per transfer, at most **2 decimal places** |
| `note` | optional string, max 500 chars |

**Example request body**

```json
{
  "recipientId": "paste-recipient-uuid-from-users-list",
  "amount": 50.5,
  "note": "Lunch"
}
```

**Example response** — `201 Created` (first time) or `200 OK` (idempotent replay)

```json
{
  "transactionId": "transfer-uuid-same-as-db-transfer-id",
  "amount": 50.5,
  "recipientId": "paste-recipient-uuid-from-users-list",
  "timestamp": "2026-04-13T12:05:00.000Z",
  "newBalance": 9949.5
}
```

**Note:** The field is named `transactionId` but the value is the **transfer** row’s `id` in the database.

**Example errors**

- `400` `MISSING_IDEMPOTENCY_KEY` — header missing or too long  
- `400` `INSUFFICIENT_FUNDS`  
- `400` `SELF_TRANSFER` — `recipientId` equals your user id  
- `404` `NOT_FOUND` — recipient does not exist  

---

## 6. Transactions (auth required)

### `GET /api/v1/me/transactions`

**What it does:** Paginated activity feed for the logged-in user.

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/api/v1/me/transactions` |
| Headers | `Authorization: Bearer <token>` |

**Query parameters**

| Name | Optional | Description |
|------|-----------|-------------|
| `direction` | yes | `sent` or `received` |
| `search` | yes | Substring match on `title` (case-insensitive) |
| `limit` | yes | 1–100, default `20` |
| `cursor` | yes | From `nextCursor` |

**Example URL**

```
{{baseUrl}}/api/v1/me/transactions?limit=5&direction=sent
```

**Example response** — `200 OK`

```json
{
  "items": [
    {
      "id": "…",
      "direction": "sent",
      "title": "Sent to Rohan Sharma",
      "subtitle": "Apr 12 · Transfer",
      "amount": 2500,
      "timestamp": "2026-04-12T10:00:00.000Z",
      "icon": "call_made",
      "note": "optional note"
    }
  ],
  "nextCursor": null
}
```

`note` is omitted when null. `amount` is in **INR rupees** (number).

---

## 7. Face template (auth required)

**What it does:** Store / read / remove an encrypted face **descriptor** (array of numbers from face-api.js). The server encrypts at rest; use a dummy array in Thunder Client unless you pipe a real descriptor from the app.

### `PUT /api/v1/me/face-template`

| Field | Value |
|--------|--------|
| Method | `PUT` |
| URL | `{{baseUrl}}/api/v1/me/face-template` |
| Headers | `Authorization: Bearer <token>`, `Content-Type: application/json` |

**Request body**

```json
{
  "descriptor": [0.01, -0.02, 0.03]
}
```

**Example response** — `200 OK`

```json
{
  "success": true
}
```

---

### `GET /api/v1/me/face-template`

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/api/v1/me/face-template` |
| Headers | `Authorization: Bearer <token>` |

**Example response** — `200 OK` (registered)

```json
{
  "descriptor": [0.01, -0.02, 0.03]
}
```

If nothing stored or decrypt/parse fails:

```json
{
  "descriptor": null
}
```

---

### `DELETE /api/v1/me/face-template`

| Field | Value |
|--------|--------|
| Method | `DELETE` |
| URL | `{{baseUrl}}/api/v1/me/face-template` |
| Headers | `Authorization: Bearer <token>` |

**Example response** — `204 No Content`

---

## 8. Profile / me (auth required)

### `GET /api/v1/me`

**What it does:** Current user profile + `faceRegistered` + `joinedAt`.

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/api/v1/me` |
| Headers | `Authorization: Bearer <token>` |

**Example response** — `200 OK`

```json
{
  "id": "…",
  "name": "Adesh M",
  "mobile": "9876543210",
  "email": "adesh@facepay.demo",
  "joinedAt": "2026-04-11T00:00:00.000Z",
  "faceRegistered": false
}
```

`avatar` is included only when set.

---

### `GET /api/v1/me/security-summary`

**What it does:** Simple “security score” derived from face registration, email verification, PIN (PIN is not implemented; `pinEnabled` stays `false`).

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/api/v1/me/security-summary` |
| Headers | `Authorization: Bearer <token>` |
| Body | — |

**Example response** — `200 OK`

```json
{
  "score": 55,
  "faceRegistered": false,
  "emailVerified": true,
  "pinEnabled": false
}
```

---

### `GET /api/v1/me/receive-qr`

**What it does:** Payload used by the client to build a receive QR (user id, name, mobile).

| Field | Value |
|--------|--------|
| Method | `GET` |
| URL | `{{baseUrl}}/api/v1/me/receive-qr` |
| Headers | `Authorization: Bearer <token>` |
| Body | — |

**Example response** — `200 OK`

```json
{
  "userId": "…",
  "name": "Adesh M",
  "mobile": "9876543210"
}
```

---

## Suggested Thunder Client order

1. `GET {{baseUrl}}/health` — API up (production: `https://facepay-inrz.onrender.com/health`)  
2. `POST {{baseUrl}}/api/v1/auth/login` — copy `token`  
3. `GET {{baseUrl}}/api/v1/me` — sanity check auth  
4. `GET {{baseUrl}}/api/v1/me/wallet/balance`  
5. `GET {{baseUrl}}/api/v1/users?limit=50` — pick a **`recipientId`**  
6. `POST {{baseUrl}}/api/v1/transfers` — with **`Idempotency-Key: <new-uuid>`**  
7. `GET {{baseUrl}}/api/v1/me/transactions`  
8. `POST {{baseUrl}}/api/v1/me/wallet/add-funds` — optional  
9. `GET {{baseUrl}}/api/v1/me/security-summary` / `GET {{baseUrl}}/api/v1/me/receive-qr` — optional  
10. Face routes — optional  
11. `POST {{baseUrl}}/api/v1/auth/logout` — optional  

---

## CORS note

If you open Thunder Client from VS Code / Cursor, requests are not browser CORS. If you call this API from a **browser** (e.g. your Vercel app at `https://…vercel.app`), that page’s **origin** must be listed in **`CORS_ORIGINS`** on the Render service (not the API hostname itself).
