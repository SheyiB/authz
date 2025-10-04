# Firebase Auth React Demo

A small React + Vite application that demonstrates Firebase Authentication with:

- Email/password login
- Multi-step email sign-up (profile ➜ account ➜ review)
- Google sign-in/sign-up
- Basic protected dashboard with sign-out

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Firebase**

   Copy `.env.example` to `.env` and fill in your Firebase project values:

   ```bash
   cp .env.example .env
   # edit .env with your Firebase credentials
   ```

   The app reads values prefixed with `VITE_` at build time. Missing values are reported when the app starts.

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Visit the printed URL (defaults to `http://localhost:5173`).

## Features

- **Multi-step sign-up** collects profile info, credentials, and agreement before creating the account.
- **Google SSO** is available on both sign-in and sign-up screens.
- **Protected routes** redirect unauthenticated users to the login page.
- **Auth context** exposes helper methods (`registerWithEmail`, `signInWithEmail`, `signInWithGoogle`, `signOutUser`).

## Optional: Auth emulator

You can point the app to the Firebase Auth emulator by toggling the flag in `.env`:

```env
VITE_USE_AUTH_EMULATOR=true
VITE_AUTH_EMULATOR_URL=http://127.0.0.1:9099
```

When the flag is `true` and `npm run dev` is running, the app connects to the emulator automatically.

## Next steps

- Add server-side rules for other Firebase products (e.g., Firestore).
- Tailor the styling or integrate a design system.
- Extend the onboarding flow with additional data capture.
