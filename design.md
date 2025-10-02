# Insulin Dosage Calculator - Design Style Guide

## Design Philosophy

### Color Palette
- **Primary**: Soft Teal (#4A9B9B) - Trust, medical professionalism, calm
- **Secondary**: Sage Green (#7FB069) - Health, wellness, natural healing
- **Accent**: Warm Coral (#FF8A80) - Alerts, important actions, warmth
- **Neutral**: Cool Gray (#F8F9FA) - Clean background, medical sterility
- **Text**: Deep Charcoal (#2C3E50) - High contrast, readability

### Typography
- **Display Font**: "Inter" - Modern, clean, highly legible for medical data
- **Body Font**: "Inter" - Consistent, accessible, professional
- **Monospace**: "JetBrains Mono" - For numerical data, dosages, readings

### Visual Language
- **Minimalist Medical**: Clean, uncluttered interface inspired by medical devices
- **Trust & Safety**: Soft rounded corners, gentle shadows, reassuring color palette
- **Data-First**: Clear hierarchy, prominent numerical displays, easy scanning
- **Accessibility**: High contrast ratios, large touch targets, clear visual feedback

## Visual Effects & Styling

### Used Libraries
- **Anime.js**: Smooth micro-interactions for dosage calculations and form submissions
- **ECharts.js**: Clean, medical-grade data visualizations for blood sugar trends
- **p5.js**: Subtle background particle effects representing cellular activity
- **Splide.js**: Smooth carousel for insulin type information and guidelines

### Animation & Effects
- **Gentle Pulse**: Blood sugar input field pulses softly when waiting for input
- **Smooth Transitions**: Dosage calculations animate smoothly from old to new values
- **Color Coding**: Blood sugar ranges show with subtle color transitions (green→yellow→red)
- **Progress Indicators**: Carb counting shows animated progress toward goal range

### Header Effect
- **Subtle Gradient Flow**: Soft teal-to-sage gradient background with gentle movement
- **Floating Particles**: Minimal p5.js particles representing glucose molecules
- **Clean Typography**: Large, clear headings with subtle text shadow for depth

### Interactive Elements
- **Soft Shadows**: All buttons and cards have gentle, medical-grade shadows
- **Hover States**: Subtle lift effect with increased shadow depth
- **Focus States**: Clear teal outline for accessibility and keyboard navigation
- **Loading States**: Gentle pulse animations during calculations

### Data Visualization
- **Medical Color Scheme**: Consistent with overall palette, avoiding harsh colors
- **Clean Charts**: Minimal grid lines, clear data points, accessible legends
- **Trend Indicators**: Simple up/down arrows with appropriate colors
- **Range Indicators**: Subtle background shading for target ranges

### Mobile Considerations
- **Large Touch Targets**: Minimum 44px for all interactive elements
- **Readable Text**: Minimum 16px font size for body text
- **Thumb-Friendly**: Important actions within easy thumb reach
- **Clear Hierarchy**: Prominent display of critical information

### Safety-Focused Design
- **Emergency Alerts**: High contrast, impossible-to-miss warning messages
- **Confirmation Dialogs**: Clear, prominent confirmations for critical actions
- **Visual Hierarchy**: Most important safety information always most prominent
- **Error Prevention**: Clear constraints and validation to prevent dangerous errors