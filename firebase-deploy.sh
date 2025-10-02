#!/bin/bash

# Firebase Deployment Script for Insulin Dose Calculator
# This script will guide you through deploying to Firebase

set -e

echo "================================================"
echo "🚀 Firebase Deployment - Insulin Dose Calculator"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI is not installed${NC}"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    echo -e "${GREEN}✅ Firebase CLI installed${NC}"
fi

echo -e "${GREEN}✅ Firebase CLI version: $(firebase --version)${NC}"
echo ""

# Step 1: Login to Firebase
echo "================================================"
echo "Step 1: Login to Firebase"
echo "================================================"
echo ""
echo "This will open a browser window for authentication."
echo "Please log in with your Google account."
echo ""
read -p "Press Enter to continue..."

firebase login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Login failed. Please try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Successfully logged in to Firebase${NC}"
echo ""

# Step 2: Check Firebase configuration
echo "================================================"
echo "Step 2: Check Firebase Configuration"
echo "================================================"
echo ""

if grep -q "YOUR_API_KEY" firebase-config.js; then
    echo -e "${YELLOW}⚠️  Warning: firebase-config.js still has placeholder values${NC}"
    echo ""
    echo "Before deploying, you need to:"
    echo "1. Go to https://console.firebase.google.com/"
    echo "2. Create a new project (or select existing one)"
    echo "3. Go to Project Settings > Your apps"
    echo "4. Click the web icon </> to add a web app"
    echo "5. Copy the firebaseConfig object"
    echo "6. Update firebase-config.js with your actual values"
    echo ""
    read -p "Have you updated firebase-config.js? (y/n): " UPDATED_CONFIG
    
    if [ "$UPDATED_CONFIG" != "y" ] && [ "$UPDATED_CONFIG" != "Y" ]; then
        echo ""
        echo -e "${YELLOW}Please update firebase-config.js and run this script again.${NC}"
        exit 0
    fi
fi

# Step 3: Initialize Firebase
echo ""
echo "================================================"
echo "Step 3: Initialize Firebase Project"
echo "================================================"
echo ""

if [ ! -f ".firebaserc" ]; then
    echo "Initializing Firebase project..."
    echo ""
    echo "You'll be asked to select:"
    echo "  - Firestore ✓"
    echo "  - Hosting ✓"
    echo ""
    echo "For other prompts, just press Enter to accept defaults."
    echo ""
    read -p "Press Enter to start firebase init..."
    
    firebase init
    
    echo -e "${GREEN}✅ Firebase project initialized${NC}"
else
    echo -e "${GREEN}✅ Firebase already initialized${NC}"
fi

echo ""

# Step 4: Check if Authentication is enabled
echo "================================================"
echo "Step 4: Enable Authentication"
echo "================================================"
echo ""
echo "Please ensure Email/Password authentication is enabled:"
echo "1. Go to https://console.firebase.google.com/"
echo "2. Select your project"
echo "3. Go to Authentication > Sign-in method"
echo "4. Enable 'Email/Password'"
echo ""
read -p "Is Email/Password authentication enabled? (y/n): " AUTH_ENABLED

if [ "$AUTH_ENABLED" != "y" ] && [ "$AUTH_ENABLED" != "Y" ]; then
    echo ""
    echo -e "${YELLOW}Please enable authentication in Firebase Console, then continue.${NC}"
    read -p "Press Enter when ready to continue..."
fi

echo -e "${GREEN}✅ Authentication ready${NC}"
echo ""

# Step 5: Deploy to Firebase
echo "================================================"
echo "Step 5: Deploy to Firebase"
echo "================================================"
echo ""
echo "This will deploy:"
echo "  - Firestore security rules"
echo "  - Firestore indexes"
echo "  - Your web application to Firebase Hosting"
echo ""
read -p "Ready to deploy? (y/n): " READY_DEPLOY

if [ "$READY_DEPLOY" = "y" ] || [ "$READY_DEPLOY" = "Y" ]; then
    echo ""
    echo "Deploying to Firebase..."
    echo ""
    
    firebase deploy
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "================================================"
        echo -e "${GREEN}🎉 Deployment Successful!${NC}"
        echo "================================================"
        echo ""
        
        # Get project info
        PROJECT_ID=$(grep -o '"projectId"[[:space:]]*:[[:space:]]*"[^"]*"' .firebaserc | cut -d'"' -f4)
        
        if [ ! -z "$PROJECT_ID" ]; then
            echo -e "Your app is live at: ${BLUE}https://${PROJECT_ID}.web.app${NC}"
            echo ""
            echo "Firebase Console: https://console.firebase.google.com/project/${PROJECT_ID}"
        else
            echo "Your app has been deployed!"
            echo "Check Firebase Console for your app URL."
        fi
        
        echo ""
        echo "Next steps:"
        echo "1. Visit your deployed app URL"
        echo "2. Create a test account"
        echo "3. Log some insulin doses"
        echo "4. Verify data persists after logout/login"
        echo ""
    else
        echo ""
        echo -e "${RED}❌ Deployment failed${NC}"
        echo "Please check the error messages above."
        exit 1
    fi
else
    echo ""
    echo "Deployment cancelled. Run this script again when ready."
fi

echo ""
echo "================================================"
echo "Deployment Complete!"
echo "================================================"
echo ""
echo "Documentation:"
echo "  - Quick Start: FIREBASE_QUICKSTART.md"
echo "  - Full Guide: FIREBASE_DEPLOYMENT.md"
echo "  - Migration Info: MIGRATION_SUMMARY.md"
echo ""
echo "⚠️  Medical Disclaimer: This tool is for practice use only."
echo "Always consult your healthcare provider for medical decisions."
echo ""
