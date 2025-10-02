// Firebase Configuration and SDK Setup
// Import Firebase modules (loaded from CDN in index.html)

// Firebase configuration - Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCSbSkLh2ZOW33ipKEoc7NJB8vZigIVVOI",
  authDomain: "insulin-16c8b.firebaseapp.com",
  projectId: "insulin-16c8b",
  storageBucket: "insulin-16c8b.firebasestorage.app",
  messagingSenderId: "864494087169",
  appId: "1:864494087169:web:aea151fb6b5fcac0c0e400",
  measurementId: "G-YG1ZNX1RHM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Collection names
const COLLECTIONS = {
    DOSE_HISTORY: 'doseHistory',
    BS_READINGS: 'bsReadings',
    USER_SETTINGS: 'userSettings'
};

// Authentication state
let currentUser = null;

// Initialize authentication listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        console.log('User is logged in:', user.email);
        showApp();
        loadUserData();
    } else {
        currentUser = null;
        console.log('User is logged out');
        showAuth();
    }
});

// Sign up new user
async function signUp(email, password, name) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update display name
        await user.updateProfile({
            displayName: name
        });
        
        console.log('User created:', user.email);
        
        // Create initial user settings document
        await createUserSettings(user.uid, name);
        
        return user;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

// Login user
async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('User logged in:', userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Logout user
async function logout() {
    try {
        await auth.signOut();
        console.log('User logged out');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// Create initial user settings
async function createUserSettings(userId, name) {
    try {
        await db.collection(COLLECTIONS.USER_SETTINGS).doc(userId).set({
            userId: userId,
            name: name,
            lantusTaken: false,
            lantusTime: null,
            lastResetDate: null,
            carbRatio: 15,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('User settings created');
    } catch (error) {
        console.error('Error creating user settings:', error);
        throw error;
    }
}

// Database Operations

// Save dose history
async function saveDoseHistory(doseData) {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
        const docRef = await db.collection(COLLECTIONS.DOSE_HISTORY).add({
            userId: currentUser.uid,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date(doseData.timestamp)),
            bloodSugar: doseData.bloodSugar || null,
            carbs: doseData.carbs || 0,
            mealType: doseData.mealType || null,
            mealDose: doseData.mealDose || 0,
            correctionDose: doseData.correctionDose || 0,
            totalDose: doseData.totalDose || 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Dose history saved:', docRef.id);
        return docRef;
    } catch (error) {
        console.error('Error saving dose history:', error);
        throw error;
    }
}

// Get dose history
async function getDoseHistory(limit = 100) {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
        const snapshot = await db.collection(COLLECTIONS.DOSE_HISTORY)
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        
        const documents = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            documents.push({
                id: doc.id,
                timestamp: data.timestamp.toDate().toISOString(),
                bloodSugar: data.bloodSugar,
                carbs: data.carbs,
                mealType: data.mealType,
                mealDose: data.mealDose,
                correctionDose: data.correctionDose,
                totalDose: data.totalDose
            });
        });
        
        return documents;
    } catch (error) {
        console.error('Error fetching dose history:', error);
        throw error;
    }
}

// Save blood sugar reading
async function saveBloodSugarReading(value) {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
        const docRef = await db.collection(COLLECTIONS.BS_READINGS).add({
            userId: currentUser.uid,
            value: value,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Blood sugar reading saved:', docRef.id);
        return docRef;
    } catch (error) {
        console.error('Error saving blood sugar reading:', error);
        throw error;
    }
}

// Get blood sugar readings
async function getBloodSugarReadings(limit = 50) {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
        const snapshot = await db.collection(COLLECTIONS.BS_READINGS)
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        
        const documents = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            documents.push({
                id: doc.id,
                value: data.value,
                timestamp: data.timestamp.toDate().toISOString()
            });
        });
        
        return documents;
    } catch (error) {
        console.error('Error fetching blood sugar readings:', error);
        throw error;
    }
}

// Get user settings
async function getUserSettings() {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
        const doc = await db.collection(COLLECTIONS.USER_SETTINGS).doc(currentUser.uid).get();
        
        if (doc.exists) {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                name: data.name,
                lantusTaken: data.lantusTaken || false,
                lantusTime: data.lantusTime ? data.lantusTime.toDate().toISOString() : null,
                lastResetDate: data.lastResetDate ? data.lastResetDate.toDate().toISOString() : null,
                carbRatio: data.carbRatio || 15
            };
        } else {
            // Create default settings if none exist
            await createUserSettings(currentUser.uid, currentUser.displayName || 'User');
            return await getUserSettings();
        }
    } catch (error) {
        console.error('Error fetching user settings:', error);
        throw error;
    }
}

// Update user settings
async function updateUserSettings(data) {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
        const updateData = { ...data };
        
        // Convert date strings to Firestore Timestamps
        if (updateData.lantusTime) {
            updateData.lantusTime = firebase.firestore.Timestamp.fromDate(new Date(updateData.lantusTime));
        }
        if (updateData.lastResetDate) {
            updateData.lastResetDate = firebase.firestore.Timestamp.fromDate(new Date(updateData.lastResetDate));
        }
        
        await db.collection(COLLECTIONS.USER_SETTINGS).doc(currentUser.uid).update(updateData);
        console.log('User settings updated');
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
    }
}

// Load all user data
async function loadUserData() {
    try {
        const [doseHistory, bsReadings, settings] = await Promise.all([
            getDoseHistory(),
            getBloodSugarReadings(),
            getUserSettings()
        ]);
        
        // Convert to app state format
        appState.doseHistory = doseHistory.map(doc => ({
            timestamp: doc.timestamp,
            bloodSugar: doc.bloodSugar,
            carbs: doc.carbs,
            mealType: doc.mealType,
            mealDose: doc.mealDose,
            correctionDose: doc.correctionDose,
            totalDose: doc.totalDose
        }));
        
        appState.bsReadings = bsReadings.map(doc => ({
            value: doc.value,
            timestamp: doc.timestamp
        }));
        
        appState.lantusTaken = settings.lantusTaken || false;
        appState.lantusTime = settings.lantusTime || null;
        appState.userSettingsId = settings.id;
        
        // Update UI
        if (typeof updateDashboard === 'function') {
            updateDashboard();
            updateChart();
            updateInsulinLog();
        }
        
        return { doseHistory, bsReadings, settings };
    } catch (error) {
        console.error('Error loading user data:', error);
        throw error;
    }
}

// UI state management
function showAuth() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
}

function showApp() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
}

// Export functions for use in main.js
const FirebaseService = {
    signUp,
    login,
    logout,
    saveDoseHistory,
    getDoseHistory,
    saveBloodSugarReading,
    getBloodSugarReadings,
    getUserSettings,
    updateUserSettings,
    loadUserData,
    getCurrentUser: () => currentUser
};
