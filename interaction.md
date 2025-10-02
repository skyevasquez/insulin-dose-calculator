# Insulin Dosage Calculator - Interaction Design

## Core Functionality

### 1. Blood Sugar Input & Correction Dose Calculator
- **Input Field**: Current blood sugar reading (mg/dL)
- **Time Selection**: Before meals vs before bed (affects correction dose calculation)
- **Real-time Calculation**: Automatically shows recommended correction dose based on ranges
- **Visual Feedback**: Color-coded ranges (green=normal, yellow=caution, red=action needed)

### 2. Meal Planning & Carb Calculator
- **Meal Type Selection**: Breakfast, Lunch, Dinner
- **Carb Counter**: Input carbohydrates for meal (30-60g goal range)
- **Meal Dose Calculator**: Based on carb intake and meal timing
- **Visual Progress**: Show carb goal progress with animated progress bar

### 3. Total Insulin Dose Calculator
- **Combined Calculation**: Meal dose + Correction dose
- **Safety Checks**: Warn if last dose was <4 hours ago
- **Dose History**: Track recent doses to prevent stacking
- **Confirmation System**: Double-check high doses before recommendation

### 4. Lantus/Semglee Basal Insulin Tracker
- **Daily Dose Display**: 15 units (fixed from data)
- **Timing Reminder**: Same time daily reminder system
- **Skip Conditions**: Sick day protocols and eating status
- **Check-in System**: Mark as taken with timestamp

## Interactive Components

### Component 1: Smart Blood Sugar Monitor
- Digital input with voice-like interface
- Real-time range indicator with color zones
- Automatic correction dose calculation
- Emergency alerts for dangerous levels
- Trend visualization (simple graph)

### Component 2: Meal Planning Dashboard
- Carb calculator with food database
- Visual meal plate builder
- Portion size guides
- Real-time carb counting
- Meal dose recommendations

### Component 3: Insulin Dose Tracker
- Dose history timeline
- Safety interval warnings
- Dose confirmation system
- Injection site rotation reminder
- Effectiveness tracking

### Component 4: Daily Health Dashboard
- Today's insulin summary
- Blood sugar trends
- Meal compliance tracking
- Medication adherence
- Health score visualization

## User Flow
1. User opens app → Dashboard with current status
2. Check blood sugar → Input reading → Get correction dose
3. Plan meal → Count carbs → Calculate meal dose
4. View total recommended dose → Confirm or adjust
5. Log actual dose taken → Update history
6. Set reminders for next dose

## Safety Features
- Maximum dose warnings
- Hypoglycemia treatment prompts
- Emergency contact integration
- Dose timing validation
- Medical disclaimer prominent display

## Data Persistence
- Local storage for dose history
- Blood sugar log
- Meal patterns
- Settings and preferences
- Export for healthcare provider