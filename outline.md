# Insulin Dosage Calculator - Project Outline

## File Structure
```
/mnt/okcomputer/output/
├── index.html              # Main calculator interface
├── guidelines.html         # Insulin guidelines and information
├── main.js                # Core application logic
├── resources/             # Images and assets
│   ├── hero-dashboard.png
│   ├── medical-bg.png
│   ├── insulin-equipment.png
│   └── [additional images]
└── [documentation files]
```

## Page Structure

### index.html - Main Calculator Interface
**Purpose**: Primary insulin dosage calculation and tracking interface
**Sections**:
1. **Navigation Bar**: Simple, clean navigation with app title and guidelines link
2. **Hero Section**: 
   - Compact header with medical background image
   - App title and safety disclaimer
   - Quick status dashboard (today's doses, last reading)
3. **Blood Sugar Monitor** (Interactive Component #1):
   - Input field for current blood sugar reading
   - Time selection (before meals/bed)
   - Real-time correction dose calculation
   - Color-coded range indicators
4. **Meal Planning Dashboard** (Interactive Component #2):
   - Meal type selection (breakfast/lunch/dinner)
   - Carbohydrate counter with visual progress
   - Meal dose calculation display
   - Food portion guides
5. **Total Dose Calculator** (Interactive Component #3):
   - Combined meal + correction dose
   - Safety interval warnings
   - Dose confirmation system
   - Injection site rotation reminder
6. **Daily Summary** (Interactive Component #4):
   - Today's insulin log
   - Blood sugar trend visualization
   - Adherence tracking
   - Quick stats dashboard
7. **Footer**: Medical disclaimer and emergency contacts

### guidelines.html - Insulin Guidelines & Information
**Purpose**: Comprehensive insulin management information and safety protocols
**Sections**:
1. **Navigation Bar**: Consistent with main app
2. **Hero Section**: Medical equipment imagery with guidelines title
3. **Insulin Types Overview**:
   - Lantus/Semglee basal insulin information
   - Novolog rapid-acting insulin details
   - Timing and duration charts
4. **Dosage Guidelines**:
   - Blood sugar correction charts
   - Meal dose calculations
   - Carb counting guides
   - Safety protocols
5. **Emergency Procedures**:
   - Hypoglycemia treatment
   - When to contact healthcare provider
   - Sick day management
6. **Best Practices**:
   - Injection techniques
   - Site rotation
   - Storage guidelines
   - Travel considerations
7. **Footer**: Medical disclaimer and resources

## Interactive Components Details

### Component 1: Smart Blood Sugar Monitor
- **Input**: Blood sugar reading (mg/dL)
- **Processing**: Real-time validation and range checking
- **Output**: Correction dose recommendation with color coding
- **Features**: 
  - Emergency alerts for dangerous levels
  - Trend indication (up/down arrows)
  - Time-based calculations (meals vs bedtime)

### Component 2: Meal Planning Dashboard
- **Input**: Meal type, carbohydrate amount
- **Processing**: Carb goal tracking, meal dose calculation
- **Output**: Recommended meal dose, carb progress
- **Features**:
  - Visual carb counting tools
  - Portion size guides
  - Goal tracking with progress bars

### Component 3: Total Dose Calculator
- **Input**: Blood sugar reading, meal carbs, timing
- **Processing**: Safety checks, dose calculations
- **Output**: Total recommended dose with confirmations
- **Features**:
  - Safety interval warnings
  - Dose history tracking
  - Confirmation dialogs for high doses

### Component 4: Daily Health Dashboard
- **Input**: User's daily insulin data
- **Processing**: Trend analysis, adherence calculation
- **Output**: Visual dashboard with charts and summaries
- **Features**:
  - ECharts.js visualizations
  - Adherence scoring
  - Quick health metrics

## Technical Implementation

### Core Libraries Integration
- **Anime.js**: Smooth transitions, form animations, loading states
- **ECharts.js**: Blood sugar trends, dose history charts
- **p5.js**: Background particle effects, visual enhancements
- **Splide.js**: Information carousels in guidelines page

### Data Management
- **Local Storage**: Dose history, user preferences, settings
- **JSON Data**: Insulin calculation rules from provided data
- **State Management**: Real-time calculation updates
- **Validation**: Input sanitization, range checking

### Safety Features
- **Input Validation**: Prevent dangerous values
- **Confirmation Dialogs**: Double-check critical actions
- **Emergency Alerts**: Prominent warnings for dangerous conditions
- **Medical Disclaimers**: Clear statements about practice use only

### Responsive Design
- **Mobile-First**: Optimized for smartphone use
- **Touch-Friendly**: Large buttons, easy navigation
- **Accessible**: High contrast, clear typography
- **Fast Loading**: Optimized images, efficient code