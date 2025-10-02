# Insulin Dose Calculator

A smart web application for managing insulin doses with real-time blood sugar monitoring and professional guidelines integration. Built with Firebase for authentication and persistent cloud data storage.

## ⚠️ Medical Disclaimer

**This tool is for practice use only.** Always consult your healthcare provider for medical decisions. In case of emergency, contact your healthcare provider immediately.

## Features

### 🩸 Blood Sugar Monitoring
- Real-time blood sugar tracking
- Automatic correction dose calculation
- Color-coded range indicators
- Emergency alerts for dangerous levels

### 🍽️ Meal Planning
- Carbohydrate counting
- Meal dose calculations
- Portion size guidance
- Goal tracking with visual progress

### 💉 Insulin Management
- Novolog (rapid-acting) dose calculator
- Lantus/Semglee (basal) tracking
- Safety warnings and intervals
- Injection site rotation reminders

### 📊 Health Dashboard
- Daily insulin log
- Blood sugar trend visualization
- Adherence scoring
- Quick health metrics

### 🔐 User Authentication
- Secure email/password authentication
- Personal data isolation
- Cross-device synchronization
- Session management

### 💾 Persistent Data Storage
- Cloud-based storage via Firebase Firestore
- Real-time data synchronization
- Dose history tracking
- Blood sugar readings archive
- Offline support

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Firebase (Authentication, Firestore Database)
- **Animations**: Anime.js
- **Charts**: ECharts
- **Graphics**: p5.js
- **Hosting**: Firebase Hosting

## Project Structure

```
/
├── index.html              # Main calculator interface
├── guidelines.html         # Insulin guidelines and information
├── main.js                 # Core application logic
├── firebase-config.js      # Firebase SDK configuration
├── firebase.json           # Firebase Hosting configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── resources/              # Images and assets
│   ├── hero-dashboard.png
│   ├── medical-bg.png
│   └── insulin-equipment.png
├── FIREBASE_DEPLOYMENT.md  # Detailed deployment guide
├── FIREBASE_QUICKSTART.md  # Quick start guide
└── README.md              # This file
```

## Database Schema

### Firestore Collections

#### `doseHistory`
Stores insulin dose records:
- `userId` (string) - User identifier
- `timestamp` (Timestamp) - When dose was taken
- `bloodSugar` (number) - Blood sugar reading
- `carbs` (number) - Carbohydrates consumed
- `mealType` (string) - Breakfast, lunch, or dinner
- `mealDose` (number) - Insulin units for meal
- `correctionDose` (number) - Insulin units for correction
- `totalDose` (number) - Total insulin units
- `createdAt` (Timestamp) - Document creation time

#### `bsReadings`
Stores blood sugar readings:
- `userId` (string) - User identifier
- `value` (number) - Blood sugar value in mg/dL
- `timestamp` (Timestamp) - When reading was taken
- `createdAt` (Timestamp) - Document creation time

#### `userSettings`
Stores user preferences (document ID = userId):
- `userId` (string) - User identifier
- `name` (string) - User display name
- `lantusTaken` (boolean) - Daily basal insulin status
- `lantusTime` (Timestamp) - When basal was taken
- `lastResetDate` (Timestamp) - Last daily reset
- `carbRatio` (number) - Carb-to-insulin ratio
- `createdAt` (Timestamp) - Document creation time

## Quick Start

### Prerequisites
- Firebase account ([sign up free](https://firebase.google.com/))
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js and npm
- Modern web browser

### Installation

1. **Clone or download this project**

2. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Copy your Firebase config

3. **Configure the application**
   
   Edit `firebase-config.js`:
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

4. **Initialize and deploy**
   ```bash
   firebase login
   firebase init
   # Select Firestore and Hosting
   firebase deploy
   ```

5. **Configure authentication**
   - In Firebase Console, go to Authentication
   - Enable Email/Password sign-in method

6. **Your app is live!**
   - Visit `https://YOUR_PROJECT_ID.web.app`
   - See [FIREBASE_QUICKSTART.md](FIREBASE_QUICKSTART.md) for 10-minute setup

### Local Development

To test locally:

1. Serve the files with any static server:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve
   ```

2. Open `http://localhost:8000` in your browser

3. Create an account and start using the calculator

## Usage

1. **Sign Up/Login**
   - Create a new account or log in with existing credentials
   - Your data is securely stored and synced across devices

2. **Enter Blood Sugar Reading**
   - Input your current blood sugar level
   - Select timing (before meals or before bed)
   - View automatic correction dose calculation

3. **Plan Your Meal**
   - Select meal type (breakfast, lunch, dinner)
   - Enter carbohydrates in grams
   - View calculated meal dose

4. **Confirm Dose**
   - Review total recommended dose (meal + correction)
   - Confirm when insulin is taken
   - View in your daily log

5. **Track Lantus**
   - Mark when you take your daily basal insulin
   - Automatic daily reset reminder

6. **View Dashboard**
   - Monitor blood sugar trends
   - Review insulin log
   - Check health score

## Safety Features

- ✅ Input validation and range checking
- ✅ Emergency alerts for dangerous levels
- ✅ Safety interval warnings (4-hour rule)
- ✅ High dose confirmation dialogs
- ✅ Medical disclaimers throughout
- ✅ Secure user authentication
- ✅ Private data isolation

## Guidelines

The calculator follows medical guidelines with:
- Blood sugar correction tables
- Meal dose calculations based on carb counting
- Timing considerations (meals vs bedtime)
- Recommended carb ranges (30-60g per meal)

For complete guidelines, see the Guidelines page in the application.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a personal medical management tool. If you're building something similar:

1. Always consult medical professionals for dosage calculations
2. Include prominent medical disclaimers
3. Implement robust safety checks
4. Use secure authentication and data storage
5. Follow HIPAA/medical data regulations if handling real patient data

## License

This project is for educational and practice purposes only.

## Support

For technical issues:
- Review [FIREBASE_DEPLOYMENT.md](FIREBASE_DEPLOYMENT.md)
- Check [Firebase Documentation](https://firebase.google.com/docs)
- Visit [Firebase Console](https://console.firebase.google.com/)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)

For medical questions:
- **Always consult your healthcare provider**
- This tool does not replace medical advice

## Acknowledgments

- Medical guidelines reviewed 1/2023
- Built with Firebase, Tailwind CSS, Anime.js, ECharts, and p5.js
- Icons and design inspired by modern medical interfaces

---

**Remember**: This is a practice tool. Always follow your healthcare provider's specific instructions for insulin management.
