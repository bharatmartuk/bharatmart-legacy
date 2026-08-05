# Firebase leads setup (seasonal prebook)

The customer storefront captures **Become a Seller** and seasonal **prebook** enquiries in a dedicated Firebase project (Firestore).

## 1. Create the project

1. Open [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g. `bharatmart-uk-leads`).
2. Enable **Cloud Firestore** (production mode or test mode while developing; lock rules before production).
3. Project settings → **Service accounts** → Generate new private key (JSON).

## 2. Environment variables

Set these on the web app (local `.env` and Vercel project for `apps/web`):

```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

On Vercel, paste the private key with literal `\n` newlines (or use the multiline env UI).

## 3. Collections written by the app

| Collection | Source |
|------------|--------|
| `seller_leads` | Become a Seller dialog → `POST /api/leads/seller` |
| `prebook_leads` | Diwali enquiry + mango distributor form → `POST /api/leads/prebook` |

Documents include a server `timestamp` and a `source` / `campaign` field for filtering.
