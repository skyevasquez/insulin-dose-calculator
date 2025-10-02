// Insulin Dosage Calculator - Main JavaScript
// Medical data from JSON
const insulinData = {
    "InsulinPlan": {
        "Lantus_Semglee": {
            "dose": "15 units",
            "instructions": [
                "Take 1 time per day at the same time everyday",
                "Do not take when sick or not eating"
            ]
        },
        "Novolog": {
            "purpose": [
                "Insulin for meals (meal dose)",
                "Correct high blood sugar (blood sugar correction dose)"
            ],
            "instructions": [
                "Take 10 minutes before eating & lasts 4 hours in the body",
                "Check sugar before each meal & determine the total dose",
                "Total Dose = Meal Dose + Blood Sugar Correction Dose",
                "Do not take the meal dose if the meal is skipped",
                "Do not take any extra insulin if last dose was less than 4 hours ago"
            ],
            "mealDose": {
                "unitsBeforeMeals": "___ units before breakfast, lunch, and dinner",
                "carbGoal": "30-60g/meal"
            },
            "bloodSugarCorrectionDose": {
                "NovologBeforeMeals": {
                    "Less than 70": "0 units, treat for low blood sugar",
                    "80-180": "0 units",
                    "181-230": "2 units",
                    "231-280": "4 units",
                    "281-330": "6 units",
                    "331-380": "8 units",
                    "381-430": "10 units",
                    "431-480": "12 units"
                },
                "NovologBeforeBed": {
                    "Less than 70": "0 units, treat for low blood sugar",
                    "80-180": "0 units",
                    "181-230": "1 unit",
                    "231-280": "2 units",
                    "281-330": "3 units",
                    "331-380": "4 units",
                    "381-430": "5 units",
                    "431-480": "6 units"
                }
            }
        },
        "Notes": "*For practice use only*",
        "Reviewed": "1/2023"
    }
};

// Application state
let appState = {
    bloodSugar: null,
    timing: 'before-meals',
    mealType: 'breakfast',
    carbs: 0,
    correctionDose: 0,
    mealDose: 0,
    totalDose: 0,
    doseHistory: [],
    bsReadings: [],
    lantusTaken: false,
    lantusTime: null,
    userSettingsId: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    startBackgroundAnimation();
    setupAuthListeners();
    
    // Firebase auth state listener will handle initial auth check
    // and call initializeApp when user is authenticated
});

// Setup authentication event listeners
function setupAuthListeners() {
    // Toggle between login and signup
    document.getElementById('show-signup').addEventListener('click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
    });
    
    document.getElementById('show-login').addEventListener('click', () => {
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });
    
    // Login button
    document.getElementById('login-btn').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        
        try {
            await login(email, password);
            initializeApp();
            setupEventListeners();
            initializeChart();
        } catch (error) {
            errorEl.textContent = error.message || 'Login failed. Please try again.';
            errorEl.classList.remove('hidden');
        }
    });
    
    // Signup button
    document.getElementById('signup-btn').addEventListener('click', async () => {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const errorEl = document.getElementById('signup-error');
        
        try {
            await signUp(email, password, name);
            initializeApp();
            setupEventListeners();
            initializeChart();
        } catch (error) {
            errorEl.textContent = error.message || 'Signup failed. Please try again.';
            errorEl.classList.remove('hidden');
        }
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

function initializeApp() {
    // Display user name
    const user = FirebaseService.getCurrentUser();
    if (user) {
        document.getElementById('user-name').textContent = `Hello, ${user.displayName || user.email}`;
    }
    
    // Setup event listeners for app
    setupEventListeners();
    initializeChart();
    
    // Load today's data
    const today = new Date().toDateString();
    const todayDoses = appState.doseHistory.filter(dose => 
        new Date(dose.timestamp).toDateString() === today
    );
    
    // Update UI with loaded data
    document.getElementById('daily-doses').textContent = todayDoses.length;
    
    if (appState.bsReadings.length > 0) {
        const lastReading = appState.bsReadings[appState.bsReadings.length - 1];
        document.getElementById('last-reading').textContent = lastReading.value + ' mg/dL';
    }
    
    // Update Lantus status
    updateLantusStatus();
    
    // Calculate health score
    calculateHealthScore();
}

function setupEventListeners() {
    // Blood sugar input
    const bsInput = document.getElementById('blood-sugar');
    bsInput.addEventListener('input', (e) => {
        handleBloodSugarChange(e);
    });
    
    // Timing selection
    document.getElementById('timing-select').addEventListener('change', handleTimingChange);
    
    // Meal type selection
    document.getElementById('meal-type').addEventListener('change', handleMealTypeChange);
    
    // Carb input
    const carbInput = document.getElementById('carb-input');
    carbInput.addEventListener('input', (e) => {
        handleCarbChange(e);
    });
    
    // Confirm dose button
    document.getElementById('confirm-dose').addEventListener('click', handleConfirmDose);
    
    // Reset button
    document.getElementById('reset-calc').addEventListener('click', handleReset);
    
    // Lantus button
    document.getElementById('lantus-taken').addEventListener('click', handleLantusTaken);
}

function handleBloodSugarChange(e) {
    const value = parseInt(e.target.value);
    console.log('Blood sugar input changed:', value);
    
    if (isNaN(value) || value < 20 || value > 600) {
        appState.bloodSugar = null;
        resetBloodSugarDisplay();
        return;
    }
    
    appState.bloodSugar = value;
    updateRangeStatus(value);
    calculateCorrectionDose(value);
    updateTotalDose();
    
    // Save to Firebase database
    saveBloodSugarReading(value).then(() => {
        console.log('Blood sugar reading saved successfully');
        // Add to local state
        appState.bsReadings.push({
            value: value,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 readings
        if (appState.bsReadings.length > 20) {
            appState.bsReadings = appState.bsReadings.slice(-20);
        }
        
        updateDashboard();
        updateChart();
    }).catch(error => {
        console.error('Error saving blood sugar reading:', error);
    });
}

function handleTimingChange(e) {
    appState.timing = e.target.value;
    if (appState.bloodSugar) {
        calculateCorrectionDose(appState.bloodSugar);
        updateTotalDose();
    }
}

function handleMealTypeChange(e) {
    appState.mealType = e.target.value;
    if (appState.carbs > 0) {
        calculateMealDose();
        updateTotalDose();
    }
}

function handleCarbChange(e) {
    const value = parseInt(e.target.value) || 0;
    console.log('Carb input changed:', value);
    appState.carbs = value;
    updateCarbProgress(value);
    calculateMealDose();
    updateTotalDose();
}

function calculateCorrectionDose(bsValue) {
    console.log('Calculating correction dose for BS:', bsValue, 'Timing:', appState.timing);
    
    const correctionTable = appState.timing === 'before-bed' ? 
        insulinData.InsulinPlan.Novolog.bloodSugarCorrectionDose.NovologBeforeBed :
        insulinData.InsulinPlan.Novolog.bloodSugarCorrectionDose.NovologBeforeMeals;
    
    let dose = 0;
    let rangeFound = false;
    
    // Check for hypoglycemia
    if (bsValue < 70) {
        appState.correctionDose = 0;
        updateCorrectionDoseDisplay(0);
        showWarning("Low blood sugar! Treat for hypoglycemia immediately. Do not take insulin.");
        return;
    }
    
    // Find appropriate range
    for (const [range, instruction] of Object.entries(correctionTable)) {
        if (range.includes('-')) {
            const [min, max] = range.split('-').map(Number);
            if (bsValue >= min && bsValue <= max) {
                dose = extractDoseFromInstruction(instruction);
                rangeFound = true;
                console.log('Range found:', range, 'Dose:', dose);
                break;
            }
        }
    }
    
    appState.correctionDose = dose;
    updateCorrectionDoseDisplay(dose);
    console.log('Correction dose set to:', dose);
    
    if (dose > 8) {
        showWarning("High correction dose! Consider consulting your healthcare provider.");
    } else {
        hideWarning();
    }
}

function extractDoseFromInstruction(instruction) {
    const match = instruction.match(/(\d+) units?/);
    return match ? parseInt(match[1]) : 0;
}

function calculateMealDose() {
    // Simple calculation: 1 unit per 15g carbs (adjust based on your ratio)
    const carbRatio = 15; // 1 unit per 15g carbs
    appState.mealDose = Math.round(appState.carbs / carbRatio);
    
    console.log('Calculating meal dose. Carbs:', appState.carbs, 'Dose:', appState.mealDose);
    
    // Ensure reasonable limits
    if (appState.mealDose > 20) {
        showWarning("High meal dose! Verify carbohydrate count.");
    }
    
    updateMealDoseDisplay(appState.mealDose);
}

function updateRangeStatus(bsValue) {
    const statusEl = document.getElementById('range-status');
    const barEl = document.getElementById('range-bar');
    
    let status, className;
    
    if (bsValue < 70) {
        status = 'Low';
        className = 'range-danger';
    } else if (bsValue >= 70 && bsValue <= 180) {
        status = 'Normal';
        className = 'range-normal';
    } else if (bsValue > 180 && bsValue <= 250) {
        status = 'High';
        className = 'range-caution';
    } else {
        status = 'Very High';
        className = 'range-danger';
    }
    
    statusEl.textContent = status;
    barEl.className = `h-2 rounded-full transition-all duration-500 ${className}`;
    
    // Animate bar width based on range
    let width = Math.min((bsValue / 300) * 100, 100);
    if (bsValue > 300) width = 100;
    
    anime({
        targets: barEl,
        width: `${width}%`,
        duration: 800,
        easing: 'easeOutQuart'
    });
}

function updateCarbProgress(carbs) {
    const progressEl = document.getElementById('carb-progress');
    const barEl = document.getElementById('carb-bar');
    
    progressEl.textContent = `${carbs}/60g`;
    
    let width = Math.min((carbs / 60) * 100, 100);
    
    anime({
        targets: barEl,
        width: `${width}%`,
        duration: 600,
        easing: 'easeOutQuart'
    });
    
    // Change color based on goal
    if (carbs < 30) {
        barEl.className = 'bg-yellow-500 h-3 rounded-full transition-all duration-500';
    } else if (carbs <= 60) {
        barEl.className = 'bg-green-500 h-3 rounded-full transition-all duration-500';
    } else {
        barEl.className = 'bg-red-500 h-3 rounded-full transition-all duration-500';
    }
}

function updateTotalDose() {
    appState.totalDose = appState.correctionDose + appState.mealDose;
    
    document.getElementById('total-meal-dose').textContent = appState.mealDose;
    document.getElementById('total-correction-dose').textContent = appState.correctionDose;
    document.getElementById('total-dose').textContent = `${appState.totalDose} units`;
    
    // Animate the total dose update
    anime({
        targets: '#total-dose',
        scale: [1.1, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    // Check for safety warnings
    checkSafetyWarnings();
}

function checkSafetyWarnings() {
    const lastDoseTime = getLastDoseTime();
    const now = new Date();
    const hoursSinceLastDose = (now - lastDoseTime) / (1000 * 60 * 60);
    
    if (hoursSinceLastDose < 4 && appState.doseHistory.length > 0) {
        showWarning("Last dose was less than 4 hours ago. Avoid stacking insulin.");
    }
    
    if (appState.totalDose > 15) {
        showWarning("High total dose! Verify calculations and consider consulting healthcare provider.");
    }
}

function handleConfirmDose() {
    if (appState.totalDose === 0) {
        alert('Please enter blood sugar reading and/or meal carbs first.');
        return;
    }
    
    // Confirm high doses
    if (appState.totalDose > 12) {
        const confirmed = confirm(`High dose detected: ${appState.totalDose} units. Are you sure?`);
        if (!confirmed) return;
    }
    
    // Record the dose
    const doseRecord = {
        timestamp: new Date().toISOString(),
        bloodSugar: appState.bloodSugar,
        carbs: appState.carbs,
        mealType: appState.mealType,
        mealDose: appState.mealDose,
        correctionDose: appState.correctionDose,
        totalDose: appState.totalDose
    };
    
    // Save to Appwrite database
    saveDoseHistory(doseRecord).then(() => {
        appState.doseHistory.push(doseRecord);
        
        // Animate confirmation
        anime({
            targets: '#confirm-dose',
            backgroundColor: ['#2563EB', '#10B981', '#2563EB'],
            duration: 1000,
            easing: 'easeInOutQuart'
        });
        
        // Reset form
        setTimeout(() => {
            handleReset();
            updateDashboard();
            updateInsulinLog();
        }, 500);
    }).catch(error => {
        console.error('Error saving dose:', error);
        alert('Failed to save dose. Please try again.');
    });
}

function handleReset() {
    appState.bloodSugar = null;
    appState.carbs = 0;
    appState.correctionDose = 0;
    appState.mealDose = 0;
    appState.totalDose = 0;
    
    document.getElementById('blood-sugar').value = '';
    document.getElementById('carb-input').value = '';
    
    resetBloodSugarDisplay();
    updateCarbProgress(0);
    updateCorrectionDoseDisplay(0);
    updateMealDoseDisplay(0);
    updateTotalDose();
    hideWarning();
}

function resetBloodSugarDisplay() {
    document.getElementById('range-status').textContent = 'Enter reading';
    document.getElementById('range-bar').style.width = '0%';
    document.getElementById('range-bar').className = 'h-2 rounded-full transition-all duration-500 bg-gray-300';
}

function updateCorrectionDoseDisplay(dose) {
    document.getElementById('correction-dose').textContent = `${dose} units`;
}

function updateMealDoseDisplay(dose) {
    document.getElementById('meal-dose').textContent = `${dose} units`;
}

function showWarning(message) {
    const warningEl = document.getElementById('safety-warning');
    const textEl = document.getElementById('warning-text');
    
    textEl.textContent = message;
    warningEl.classList.remove('hidden');
    
    anime({
        targets: warningEl,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

function hideWarning() {
    const warningEl = document.getElementById('safety-warning');
    warningEl.classList.add('hidden');
}

function handleLantusTaken() {
    const now = new Date();
    appState.lantusTaken = true;
    appState.lantusTime = now.toISOString();
    
    // Save to Firebase database
    updateUserSettings({
        lantusTaken: true,
        lantusTime: now.toISOString()
    }).then(() => {
        updateLantusStatus();
        
        // Animate button
        const button = document.getElementById('lantus-taken');
        button.textContent = 'Lantus Taken ✓';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-orange-600');
        
        anime({
            targets: button,
            scale: [1, 1.05, 1],
            duration: 500,
            easing: 'easeInOutQuart'
        });
    }).catch(error => {
        console.error('Error updating Lantus status:', error);
    });
}

function updateLantusStatus() {
    const statusEl = document.getElementById('lantus-status');
    const indicatorEl = document.getElementById('lantus-indicator');
    const timeEl = document.getElementById('lantus-time');
    
    if (appState.lantusTaken) {
        statusEl.textContent = 'Yes';
        indicatorEl.className = 'w-3 h-3 rounded-full bg-green-500';
        
        if (appState.lantusTime) {
            const time = new Date(appState.lantusTime);
            timeEl.textContent = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    } else {
        statusEl.textContent = 'No';
        indicatorEl.className = 'w-3 h-3 rounded-full bg-orange-500';
        timeEl.textContent = '--:--';
    }
}

function updateDashboard() {
    // Update last reading
    if (appState.bsReadings.length > 0) {
        const lastReading = appState.bsReadings[appState.bsReadings.length - 1];
        document.getElementById('last-reading').textContent = lastReading.value + ' mg/dL';
    }
    
    // Update daily doses
    const today = new Date().toDateString();
    const todayDoses = appState.doseHistory.filter(dose => 
        new Date(dose.timestamp).toDateString() === today
    );
    document.getElementById('daily-doses').textContent = todayDoses.length;
    
    calculateHealthScore();
    updateInsulinLog();
}

function calculateHealthScore() {
    const today = new Date().toDateString();
    const todayDoses = appState.doseHistory.filter(dose => 
        new Date(dose.timestamp).toDateString() === today
    );
    
    let score = 0;
    
    // Blood sugar in range (40 points)
    if (appState.bsReadings.length > 0) {
        const recentReadings = appState.bsReadings.slice(-5);
        const inRange = recentReadings.filter(r => r.value >= 80 && r.value <= 180).length;
        score += (inRange / recentReadings.length) * 40;
    }
    
    // Meal compliance (30 points)
    const mealDoses = todayDoses.filter(d => d.carbs > 0).length;
    score += Math.min(mealDoses * 10, 30);
    
    // Lantus compliance (20 points)
    if (appState.lantusTaken) score += 20;
    
    // Regular monitoring (10 points)
    if (appState.bsReadings.length >= 3) score += 10;
    
    score = Math.round(score);
    document.getElementById('health-score').textContent = score;
    
    // Update indicator
    const indicator = document.getElementById('health-indicator');
    if (score >= 80) {
        indicator.className = 'w-3 h-3 rounded-full bg-green-500';
    } else if (score >= 60) {
        indicator.className = 'w-3 h-3 rounded-full bg-yellow-500';
    } else {
        indicator.className = 'w-3 h-3 rounded-full bg-red-500';
    }
}

function initializeChart() {
    const chartDom = document.getElementById('bs-chart');
    const myChart = echarts.init(chartDom);
    
    updateChart();
}

function updateChart() {
    const chartDom = document.getElementById('bs-chart');
    const myChart = echarts.getInstanceByDom(chartDom);
    
    if (!myChart) return;
    
    const recentReadings = appState.bsReadings.slice(-10);
    const times = recentReadings.map(r => new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    const values = recentReadings.map(r => r.value);
    
    const option = {
        grid: {
            left: '10%',
            right: '10%',
            top: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: times,
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            min: 50,
            max: 300,
            axisLabel: {
                fontSize: 10
            }
        },
        series: [{
            data: values,
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#4A9B9B',
                width: 3
            },
            itemStyle: {
                color: '#4A9B9B'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(74, 155, 155, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(74, 155, 155, 0.1)'
                    }]
                }
            }
        }],
        markLine: {
            data: [
                {yAxis: 80, lineStyle: {color: '#10B981', type: 'dashed'}},
                {yAxis: 180, lineStyle: {color: '#10B981', type: 'dashed'}}
            ],
            label: {
                show: false
            }
        }
    };
    
    myChart.setOption(option);
}

function updateInsulinLog() {
    const logEl = document.getElementById('insulin-log');
    const today = new Date().toDateString();
    const todayDoses = appState.doseHistory
        .filter(dose => new Date(dose.timestamp).toDateString() === today)
        .reverse()
        .slice(0, 5);
    
    if (todayDoses.length === 0) {
        logEl.innerHTML = '<p class="text-gray-500 text-center py-8">No doses logged today</p>';
        return;
    }
    
    logEl.innerHTML = todayDoses.map(dose => {
        const time = new Date(dose.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                    <p class="font-medium text-gray-900">${dose.totalDose} units</p>
                    <p class="text-sm text-gray-600">${dose.mealType} • BS: ${dose.bloodSugar || '--'} • Carbs: ${dose.carbs || '0'}g</p>
                </div>
                <span class="text-sm text-gray-500">${time}</span>
            </div>
        `;
    }).join('');
}

function getLastDoseTime() {
    if (appState.doseHistory.length === 0) return new Date(0);
    return new Date(appState.doseHistory[appState.doseHistory.length - 1].timestamp);
}

function startBackgroundAnimation() {
    // P5.js background animation
    new p5(function(p) {
        let particles = [];
        
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('p5-background');
            
            // Create particles
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Draw particle
                p.fill(74, 155, 155, 30);
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Reset Lantus status daily
function checkDailyReset() {
    const today = new Date().toDateString();
    
    // Get user settings from Firebase
    getUserSettings().then(settings => {
        const lastDate = settings.lastResetDate ? new Date(settings.lastResetDate).toDateString() : null;
        
        if (lastDate !== today) {
            appState.lantusTaken = false;
            
            // Update in database
            updateUserSettings({
                lantusTaken: false,
                lastResetDate: new Date().toISOString()
            }).then(() => {
                updateLantusStatus();
            }).catch(error => {
                console.error('Error resetting daily Lantus status:', error);
            });
        }
    }).catch(error => {
        console.error('Error checking daily reset:', error);
    });
}

// Check for daily reset when authenticated
if (FirebaseService.getCurrentUser()) {
    checkDailyReset();
}
