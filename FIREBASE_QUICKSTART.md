# Firebase Quick Start - 10 Minutes to Deploy

Get your Insulin Dose Calculator live on Firebase in just 10 minutes!

## Prerequisites

✅ Firebase account ([sign up free](https://firebase.google.com/))  
✅ Node.js installed ([download](https://nodejs.org/))

## Step 1: Install Firebase CLI (2 min)

```bash
npm install -g firebase-tools
firebase --version
```

## Step 2: Create Firebase Project (2 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name: **Insulin Dose Calculator**
4. Click through the prompts
5. Click **"Create project"**

## Step 3: Get Your Config (2 min)

1. Click **gear icon** ⚙️ > **Project settings**
2. Scroll to **"Your apps"**
3. Click **Web icon** `</>`
4. Register app: **Insulin Dose Calculator**
5. **Copy the firebaseConfig object**

## Step 4: Update Config File (1 min)

Open `firebase-config.js` and replace:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← Paste your values here
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Enable Authentication (1 min)

1. In Firebase Console → **Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"**
4. **Enable** it
5. Click **"Save"**

## Step 6: Deploy! (2 min)

```bash
cd "/Users/skyevasquez/1Projects/Insulin Dose Calculator"
firebase login
firebase init

# Select:
# - Firestore ✓
# - Hosting ✓
# Choose your project
# Accept all defaults (just press Enter)

firebase deploy
```

## Done! 🎉

Your app is live at:
```
https://YOUR_PROJECT_ID.web.app
```

## Test It

1. Open your deployed URL
2. Click **"Sign Up"**
3. Create an account
4. Log some insulin doses
5. Logout and login again
6. Your data is saved! ✅

## What You Just Got

✅ **Secure Authentication** - User accounts with email/password  
✅ **Cloud Database** - Firestore with automatic sync  
✅ **Fast Hosting** - Global CDN with HTTPS  
✅ **Private Data** - Each user only sees their own data  
✅ **Free Tier** - Generous limits for personal use  

## Local Development

Want to test locally first?

```bash
# Serve locally
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

Just make sure you've updated `firebase-config.js` with your config!

## Common Issues

**"Firebase not defined"**  
→ Check that Firebase SDK scripts are loaded in index.html

**"Permission denied"**  
→ Deploy security rules: `firebase deploy --only firestore:rules`

**"Auth not enabled"**  
→ Enable Email/Password in Firebase Console > Authentication

## Next Steps

### Custom Domain
1. Firebase Console → Hosting → Add custom domain
2. Follow DNS setup instructions

### Monitor Usage
- Firebase Console → Analytics
- Firebase Console → Firestore (see your data)
- Firebase Console → Authentication (see users)

### Update Your App
```bash
# Make changes to your code
firebase deploy --only hosting
```

## Cost (Free Tier)

Your app runs **100% free** unless you exceed:
- 10K auth verifications/month
- 50K database reads/day
- 20K database writes/day  
- 10 GB hosting storage

Perfect for personal use! 🎯

## Full Documentation

For advanced features, see:
- **[FIREBASE_DEPLOYMENT.md](FIREBASE_DEPLOYMENT.md)** - Complete guide
- **[README.md](README.md)** - App features and usage

## Support

- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

## Medical Disclaimer

⚠️ This tool is for practice use only. Always consult your healthcare provider for medical decisions.

---

**Your Insulin Dose Calculator is now running in the cloud!** ☁️

Share your URL with your healthcare team or use it across all your devices.
