# Insulin Dose Calculator - Firebase Deployment Guide

Complete guide to deploy your Insulin Dose Calculator to Firebase with Authentication, Firestore Database, and Hosting.

## Prerequisites

- Firebase account (free tier available)
- Node.js and npm installed
- Firebase CLI installed

## Step 1: Install Firebase CLI

If you don't have Firebase CLI installed:

```bash
npm install -g firebase-tools
```

Verify installation:

```bash
firebase --version
```

## Step 2: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **Insulin Dose Calculator**
4. (Optional) Enable Google Analytics
5. Click "Create project"

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** > **Project settings**
2. Scroll down to "Your apps" section
3. Click the **Web icon** (`</>`) to add a web app
4. Register app name: **Insulin Dose Calculator**
5. Check "Also set up Firebase Hosting"
6. Click "Register app"
7. Copy the `firebaseConfig` object

## Step 4: Configure Your Application

Open `firebase-config.js` and replace the configuration:

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

Paste your actual Firebase config values from the console.

## Step 5: Login to Firebase CLI

```bash
cd "/Users/skyevasquez/1Projects/Insulin Dose Calculator"
firebase login
```

This will open a browser window for authentication.

## Step 6: Initialize Firebase Project

```bash
firebase init
```

Select the following options:

### 1. **Which Firebase features?**
   - ☑ Firestore
   - ☑ Hosting

### 2. **Select a default Firebase project**
   - Choose your "Insulin Dose Calculator" project

### 3. **Firestore Setup**
   - **Firestore rules file:** Press Enter (use default: `firestore.rules`)
   - **Firestore indexes file:** Press Enter (use default: `firestore.indexes.json`)

### 4. **Hosting Setup**
   - **Public directory:** Enter `.` (current directory)
   - **Configure as single-page app:** Enter `n` (No)
   - **Set up automatic builds:** Enter `n` (No)
   - **Overwrite index.html:** Enter `n` (No)

## Step 7: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Click on "Email/Password"
5. Enable both:
   - ☑ Email/Password
   - ☐ Email link (passwordless sign-in) - Optional
6. Click "Save"

## Step 8: Deploy Firestore Security Rules

The security rules are already configured in `firestore.rules`. Deploy them:

```bash
firebase deploy --only firestore:rules
```

This will:
- ✅ Ensure users can only read/write their own data
- ✅ Enforce authentication requirements
- ✅ Protect against unauthorized access

## Step 9: Deploy Firestore Indexes

Deploy the indexes for optimal query performance:

```bash
firebase deploy --only firestore:indexes
```

This creates composite indexes for:
- Dose history queries (userId + timestamp)
- Blood sugar reading queries (userId + timestamp)

## Step 10: Deploy Your Application

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

Your app will be deployed to:
```
https://YOUR_PROJECT_ID.web.app
```

Or your custom domain if configured.

## Step 11: Test Your Deployment

1. Open the deployed URL
2. Create a new account
3. Test login/logout
4. Enter blood sugar readings
5. Log insulin doses
6. Verify data persists across sessions

## Complete Deployment (All at Once)

To deploy everything at once:

```bash
firebase deploy
```

This deploys:
- ✅ Firestore security rules
- ✅ Firestore indexes
- ✅ Hosting (your web app)

## Firebase Console Overview

### Authentication
- View registered users
- Manage authentication methods
- Monitor sign-in activity

### Firestore Database
- View collections and documents
- Monitor read/write operations
- Check index status

### Hosting
- View deployment history
- Configure custom domains
- Monitor bandwidth usage

## Database Structure

### Collections

#### `doseHistory`
```javascript
{
  userId: "user_id",
  timestamp: Timestamp,
  bloodSugar: 120,
  carbs: 45,
  mealType: "breakfast",
  mealDose: 3,
  correctionDose: 2,
  totalDose: 5,
  createdAt: Timestamp
}
```

#### `bsReadings`
```javascript
{
  userId: "user_id",
  value: 120,
  timestamp: Timestamp,
  createdAt: Timestamp
}
```

#### `userSettings`
```javascript
{
  userId: "user_id",
  name: "John Doe",
  lantusTaken: false,
  lantusTime: Timestamp,
  lastResetDate: Timestamp,
  carbRatio: 15,
  createdAt: Timestamp
}
```

## Security Rules Explained

The Firestore security rules ensure:

1. **Authentication Required**: Users must be logged in
2. **Data Isolation**: Users can only access their own data
3. **Owner Verification**: Document `userId` must match authenticated user
4. **Write Protection**: Users can't modify other users' documents

## Updating Your Application

When you make changes:

```bash
# Update code
git add .
git commit -m "Update feature"

# Deploy changes
firebase deploy --only hosting
```

## Custom Domain Setup (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the verification steps
4. Update DNS records as instructed
5. Wait for SSL certificate provisioning

## Environment Variables

For multiple environments (dev/staging/prod):

### Development
```javascript
// firebase-config.js (local development)
const firebaseConfig = {
  apiKey: "dev_api_key",
  projectId: "insulin-calc-dev",
  // ...
};
```

### Production
```javascript
// firebase-config.js (production)
const firebaseConfig = {
  apiKey: "prod_api_key",
  projectId: "insulin-calc-prod",
  // ...
};
```

## Monitoring and Analytics

### Firebase Analytics
Already enabled if you chose it during project creation. Tracks:
- User engagement
- Screen views
- Conversion events

### Performance Monitoring
Enable in Firebase Console > Performance to track:
- Page load times
- Network requests
- App responsiveness

## Costs and Limits

### Free Tier (Spark Plan)
- **Authentication**: 10K verifications/month
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Hosting**: 10 GB storage, 360 MB/day transfer

### Pay-as-you-go (Blaze Plan)
Required for:
- More than free tier limits
- Cloud Functions (if you add them later)
- More storage and bandwidth

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules are deployed
- Verify user is authenticated
- Ensure userId matches in documents

### Authentication not working
- Verify Email/Password is enabled in Console
- Check firebaseConfig is correct
- Clear browser cache and cookies

### Data not persisting
- Check browser console for errors
- Verify Firestore rules allow writes
- Check network tab for failed requests

### Deployment fails
- Verify Firebase CLI is logged in: `firebase login`
- Check firebase.json configuration
- Ensure all required files exist

## CLI Commands Reference

```bash
# Login/Logout
firebase login
firebase logout

# Initialize project
firebase init

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Open hosting URL
firebase open hosting:site

# View logs
firebase functions:log

# Emulators (local testing)
firebase emulators:start
```

## Local Development with Emulators

For local testing without using production data:

```bash
# Install emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

Then update `firebase-config.js` to connect to emulators:

```javascript
if (window.location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099');
  db.useEmulator('localhost', 8080);
}
```

## Security Best Practices

1. ✅ **Never commit** `firebase-config.js` with real keys to public repos
2. ✅ **Use environment-specific configs** for dev/prod
3. ✅ **Review security rules** regularly
4. ✅ **Enable App Check** for additional security
5. ✅ **Monitor usage** in Firebase Console
6. ✅ **Set up billing alerts** if on paid plan
7. ✅ **Backup data** regularly using Firestore export

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)

## Medical Disclaimer

⚠️ **IMPORTANT**: This tool is for practice use only. Always follow your healthcare provider's instructions for insulin management. In case of emergency, contact your healthcare provider immediately.

---

**Your app is now live on Firebase!** 🚀

Visit your deployment URL and start managing your insulin doses with secure cloud-based storage.
