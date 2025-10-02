# Final Deployment Steps 🚀

Your Firebase project is set up! Just a few more steps:

## ✅ Already Done:
- Firebase CLI installed
- Logged in as: `skye@applylogics.com`
- Project created: **insulin** (ID: `insulin-16c8b`)
- Project linked to this directory
- Firestore rules configured
- Firebase.json configured

## 📝 Remaining Steps:

### Step 1: Get Your Firebase Config (2 minutes)

1. Go to: https://console.firebase.google.com/project/insulin-16c8b/settings/general

2. Scroll down to **"Your apps"** section

3. **If you see a web app** (`</>`):
   - Click on it
   - Find the `firebaseConfig` object
   - Copy it

4. **If you DON'T see a web app**:
   - Click the **`</>`** icon (Add app → Web)
   - Register app nickname: **Insulin Calculator Web**
   - Click "Register app"
   - Copy the `firebaseConfig` object shown

The config looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "insulin-16c8b.firebaseapp.com",
  projectId: "insulin-16c8b",
  storageBucket: "insulin-16c8b.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 2: Update firebase-config.js

Open `firebase-config.js` and replace lines 5-12 with your actual config:

```bash
# Option 1: Use nano
nano firebase-config.js

# Option 2: Use VS Code
code firebase-config.js

# Option 3: Use TextEdit
open -a "TextEdit" firebase-config.js
```

Replace:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

With your actual values.

### Step 3: Enable Authentication

1. Go to: https://console.firebase.google.com/project/insulin-16c8b/authentication

2. Click **"Get started"** (if you haven't already)

3. Go to **"Sign-in method"** tab

4. Click on **"Email/Password"**

5. Toggle **Enable**

6. Click **"Save"**

### Step 4: Deploy! 🚀

```bash
firebase deploy
```

This will deploy:
- ✅ Firestore security rules
- ✅ Firestore indexes  
- ✅ Your web app to Firebase Hosting

### Step 5: Visit Your Live App!

After deployment completes, you'll see:
```
Hosting URL: https://insulin-16c8b.web.app
```

---

## Quick Deploy Commands

Once `firebase-config.js` is updated and auth is enabled:

```bash
# Deploy everything
firebase deploy

# Or deploy just hosting
firebase deploy --only hosting

# Or deploy just firestore
firebase deploy --only firestore
```

---

## Test Your App

1. Visit `https://insulin-16c8b.web.app`
2. Click "Sign Up"
3. Create a test account
4. Log some insulin doses
5. Test logout/login
6. Verify data persists!

---

## Troubleshooting

### "Permission denied" errors
```bash
firebase deploy --only firestore:rules
```

### "Config not found"
Make sure you updated `firebase-config.js` with real values from Firebase Console

### "Auth not working"
Make sure Email/Password is enabled in Firebase Console → Authentication

---

## Current Project Info

- **Project ID:** `insulin-16c8b`
- **Console:** https://console.firebase.google.com/project/insulin-16c8b
- **Your Email:** skye@applylogics.com

---

## Next: Update Config & Deploy

1. **Get config from Firebase Console**
2. **Update `firebase-config.js`**
3. **Enable Email/Password auth**
4. **Run `firebase deploy`**

That's it! 🎉

---

⚠️ **Medical Disclaimer:** This tool is for practice use only. Always consult your healthcare provider for medical decisions.
