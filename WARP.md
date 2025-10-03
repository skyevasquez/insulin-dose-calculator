# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A Firebase-powered web application for managing insulin doses with real-time blood sugar monitoring. Built as a vanilla JavaScript single-page application with Firebase Authentication and Firestore Database. This is a **medical practice tool** (not for production medical use).

**⚠️ Medical Context**: All code and calculations follow medical guidelines reviewed 1/2023. Always maintain medical disclaimers and safety checks when modifying dose calculation logic.

## Common Commands

### Local Development
```bash
# Serve the application locally (from project root)
python3 -m http.server 8000
# or
npx serve

# Open in browser at http://localhost:8000
```

### Firebase Deployment
```bash
# Login to Firebase
firebase login

# Initialize Firebase project (first time only)
firebase init
# Select: Firestore, Hosting
# Public directory: . (current directory)

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# View deployed app
firebase open hosting:site

# View logs
firebase functions:log
```

### Firebase Functions (Cloud Functions)
```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch for changes
npm run build:watch

# Test locally with emulator
npm run serve

# Deploy functions
npm run deploy
# or
firebase deploy --only functions

# View logs
npm run logs
```

### Firebase Emulators (Local Testing)
```bash
# Start emulators for local development
firebase emulators:start

# To connect app to emulators, add to firebase-config.js:
# if (window.location.hostname === 'localhost') {
#   auth.useEmulator('http://localhost:9099');
#   db.useEmulator('localhost', 8080);
# }
```

## Architecture

### Frontend Stack
- **HTML/CSS/JavaScript**: Vanilla JavaScript (no frameworks)
- **Styling**: Tailwind CSS (CDN)
- **Animations**: Anime.js
- **Charts**: ECharts (blood sugar trend visualization)
- **Graphics**: p5.js (background animations)
- **Firebase SDK**: v9 compat mode (app, auth, firestore)

### Backend: Firebase Services
- **Firebase Authentication**: Email/password authentication with session management
- **Firestore Database**: NoSQL cloud database with real-time sync
- **Firebase Hosting**: Static site hosting with CDN
- **Firebase Functions**: TypeScript cloud functions (optional, currently minimal)

### Key Application Architecture

#### State Management (`main.js`)
- Centralized `appState` object holds all application state
- State includes: blood sugar readings, carb counts, dose calculations, user settings
- No state management library - uses vanilla JavaScript object

#### Authentication Flow (`firebase-config.js`)
1. `auth.onAuthStateChanged()` listener manages auth state globally
2. On login: Shows app UI, loads user data from Firestore
3. On logout: Shows auth UI, clears state
4. User isolation enforced via `userId` field in all documents

#### Data Flow Architecture
```
User Input (index.html)
    ↓
Event Handlers (main.js)
    ↓
Business Logic (main.js: calculations, validations)
    ↓
Firebase Service Layer (firebase-config.js)
    ↓
Firestore Database
    ↓
Real-time Updates → UI Updates (main.js)
```

#### Calculation Engine (`main.js`)
- **Blood Sugar Correction**: Uses lookup tables based on ranges and timing
  - Different doses for "before meals" vs "before bed"
  - Tables defined in `insulinData` JSON structure
- **Meal Dose Calculation**: Carb ratio-based (1 unit per 15g carbs by default)
- **Total Dose**: Sum of correction + meal doses
- **Safety Checks**: Validates ranges, warns on dangerous values, enforces 4-hour rule

### Firestore Database Schema

#### Collections Structure
```javascript
// doseHistory: Insulin dose records
{
  userId: string,              // Links to Firebase Auth user
  timestamp: Timestamp,        // When dose was taken
  bloodSugar: number,         // mg/dL reading
  carbs: number,              // grams consumed
  mealType: string,           // 'breakfast', 'lunch', 'dinner'
  mealDose: number,           // Units for meal
  correctionDose: number,     // Units for correction
  totalDose: number,          // Total units
  createdAt: Timestamp
}

// bsReadings: Blood sugar readings history
{
  userId: string,
  value: number,              // mg/dL
  timestamp: Timestamp,
  createdAt: Timestamp
}

// userSettings: Per-user preferences (doc ID = userId)
{
  userId: string,
  name: string,               // Display name
  lantusTaken: boolean,       // Daily basal insulin status
  lantusTime: Timestamp,      // When basal was taken
  lastResetDate: Timestamp,   // Last daily reset
  carbRatio: number,          // Carb-to-insulin ratio (default 15)
  createdAt: Timestamp
}
```

#### Security Model
- Firestore rules enforce user data isolation
- Users can only read/write documents where `userId === auth.uid`
- Document-level security via rules in `firestore.rules`
- **Important**: Rules file expires Oct 31, 2025 - update before then

#### Query Patterns
All queries filter by `userId` and order by `timestamp`:
```javascript
db.collection('doseHistory')
  .where('userId', '==', currentUser.uid)
  .orderBy('timestamp', 'desc')
  .limit(100)
```

### Critical Files

| File | Purpose |
|------|---------|
| `index.html` | Main UI - single page app with auth and calculator |
| `main.js` | Core application logic, calculations, event handlers |
| `firebase-config.js` | Firebase initialization, auth, database operations |
| `firebase.json` | Hosting config, cache headers, rewrites |
| `firestore.rules` | Database security rules |
| `firestore.indexes.json` | Composite indexes for queries |
| `guidelines.html` | Static page with medical dosing guidelines |

### Web-App Directory
The `web-app/` directory contains a separate Next.js project (possibly for future migration or alternative implementation). It has its own dependencies and build system:
```bash
cd web-app
npm install
npm run dev     # Development server
npm run build   # Production build
npm run lint    # ESLint
```

This is **separate from the main application** which runs from the project root.

## Firebase Configuration

### Required Firebase Setup
1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Email/Password** authentication method
3. Update `firebase-config.js` with your project config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     // ... other config values
   };
   ```
4. Deploy security rules: `firebase deploy --only firestore:rules`
5. Deploy indexes: `firebase deploy --only firestore:indexes`

### Environment-Specific Configs
For multiple environments (dev/staging/prod), maintain separate `firebase-config.js` files or use build-time replacement. The current setup uses a single config file.

## Development Workflow

### Making Code Changes
1. **Dose Calculation Changes**: Modify `insulinData` object or calculation functions in `main.js`
2. **UI Changes**: Edit `index.html` or CSS in `<style>` tag
3. **Database Operations**: Update functions in `firebase-config.js`
4. **Security Rules**: Edit `firestore.rules`, then redeploy

### Testing Locally
1. Start local server: `python3 -m http.server 8000`
2. Open `http://localhost:8000`
3. Create test account or use existing credentials
4. Test features: blood sugar input, dose calculations, data persistence

### Deploying Changes
```bash
# Update code
git add .
git commit -m "Description of changes"

# Deploy to Firebase
firebase deploy --only hosting  # Just frontend
firebase deploy                  # Everything
```

## Medical Safety Considerations

### Critical Safety Rules
- **Never remove medical disclaimers** from any user-facing page
- **Always validate blood sugar ranges**: 20-600 mg/dL accepted, outside triggers errors
- **Enforce 4-hour safety interval** for repeat doses
- **High dose warnings**: Alert user for correction doses >8 units
- **Hypoglycemia protection**: BS <70 = 0 insulin, show urgent warning
- **Carb range guidance**: 30-60g/meal recommended

### Dose Calculation Logic Location
- Blood sugar correction tables: `insulinData.InsulinPlan.Novolog.bloodSugarCorrectionDose`
- Meal dose calculation: `calculateMealDose()` function in `main.js`
- Carb ratio: Stored per-user in `userSettings.carbRatio` (default 15)

### Testing Dose Calculations
When modifying calculation logic:
1. Test boundary values (69, 70, 180, 181, etc.)
2. Verify both "before meals" and "before bed" tables
3. Test high BS scenarios (>400 mg/dL)
4. Confirm warnings appear for dangerous values
5. Validate that meal dose scales linearly with carbs

## Migration History

This project was migrated from Appwrite to Firebase. Legacy files can be safely removed:
- `appwrite-config.js` (replaced by `firebase-config.js`)
- `appwrite.json` (replaced by `firebase.json`)
- Old deployment scripts specific to Appwrite

See `MIGRATION_SUMMARY.md` for full migration details.

## Browser Compatibility

Targets modern browsers (Chrome, Firefox, Safari, Edge - latest versions). Uses:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Firebase SDK v9 (compat mode for older SDK style)
- No polyfills included

## Deployment URLs

- **Staging/Dev**: Run locally on `http://localhost:8000`
- **Production**: `https://YOUR_PROJECT_ID.web.app` or `https://YOUR_PROJECT_ID.firebaseapp.com`
- Custom domains can be configured via Firebase Console

## Troubleshooting

### Common Issues
- **"Permission denied" in Firestore**: Check security rules are deployed and `userId` matches authenticated user
- **Authentication not working**: Verify Email/Password is enabled in Firebase Console
- **Data not persisting**: Check browser console for errors, verify Firestore rules
- **Old security rules expired**: Update date in `firestore.rules` line 15

### Debug Mode
Open browser DevTools console to see:
- Authentication state changes
- Database operations (saves/fetches)
- Calculation intermediate values
- Error messages

### Firebase Console Access
- **Auth Users**: Console → Authentication
- **Database Contents**: Console → Firestore Database
- **Deployment History**: Console → Hosting
- **Usage Stats**: Console → Usage and billing
