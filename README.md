## Judo Mastery App

## Project Deliverables Description

This project delivers a complete mobile application for judo training and mastery, built with modern React Native technologies. The application provides comprehensive judo learning resources, training modules, and progress tracking capabilities for practitioners of all levels.

**Repository Address:** https://github.com/cosmin-oros/judo-mastery

**Note:** This repository contains only source code without compiled binaries. All compilation, installation, and application launch steps are detailed below for complete project setup and deployment.

## Table of Contents
- [Project Deliverables Description](#project-deliverables-description)
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Compilation Steps](#compilation-steps)
- [Application Launch Steps](#application-launch-steps)
- [Usage](#usage)
- [Deployment](#deployment)

## Overview

This is the frontend for the Judo Mastery app, built using [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) and [Tamagui](https://tamagui.dev/) for UI components. It provides a smooth and responsive user interface for interacting with the app's backend services, delivering comprehensive judo training content and progress tracking functionality.

## Features

- **Responsive UI**: Utilizing Tamagui for a consistent and responsive design across all device sizes
- **Multi-language Support**: Integrated with language providers for dynamic translations
- **Push Notifications**: Handling push notifications with Expo for training reminders and updates
- **Social Authentication**: Implemented authentication with email and Google sign-in
- **Judo Training Modules**: Comprehensive training content with video tutorials and step-by-step guides
- **Progress Tracking**: Track learning progress and achievements
- **Offline Support**: Access content even without internet connection
- **Interactive Learning**: Gamified learning experience with achievements and badges

## Project Structure

```
judo-mastery/
├── app/                      # Expo Router folder
│   ├── (tabs)/               # Folder for tab-based navigation
│   │   ├── welcome/          # Welcome screen components
│   │   ├── training/         # Training module screens
│   │   ├── progress/         # Progress tracking screens
│   │   ├── profile/          # User profile screens
│   │   ├── _layout.tsx       # Layout wrapper for tabs
│   │   └── index.tsx         # Default entry page
│   ├── assets/
│   │   ├── images/           # Application images and icons
│   │   ├── videos/           # Training video assets
│   │   └── sounds/           # Audio feedback files
│   └── api/
│       └── firestoreService/ # Firebase/Firestore services
├── src/                      # Main source folder
│   ├── screens/              # Application screens
│   │   ├── welcome/          # Welcome and onboarding screens
│   │   │   ├── components/   # Reusable welcome components
│   │   │   │   ├── OnboardingSlider.tsx
│   │   │   │   ├── WelcomeCard.tsx
│   │   │   │   └── LanguageSelector.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   ├── home/             # Home dashboard screen
│   │   ├── training/         # Training module screens
│   │   ├── progress/         # Progress and statistics screens
│   │   └── profile/          # User profile and settings
│   ├── api/                  # API integration functions
│   │   ├── auth.ts           # Authentication API calls
│   │   ├── training.ts       # Training content API
│   │   └── progress.ts       # Progress tracking API
│   ├── i18n/                 # Internationalization setup
│   │   └── index.ts          # i18n configuration
│   ├── locales/              # Language translation files
│   │   ├── en.json           # English translations
│   │   ├── ro.json           # Romanian translations
│   │   └── fr.json           # French translations
│   ├── provider/             # React Context Providers
│   │   ├── AuthProvider.tsx  # Authentication context
│   │   ├── ThemeProvider.tsx # Theme management
│   │   └── LanguageProvider.tsx # Language switching
│   ├── theme/                # Theme configuration files
│   │   ├── colors.ts         # Color definitions
│   │   ├── fonts.ts          # Font configurations
│   │   └── tokens.ts         # Design tokens
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.ts           # Authentication types
│   │   ├── training.ts       # Training content types
│   │   └── navigation.ts     # Navigation types
│   └── utils/                # Helper utilities and functions
│       ├── storage.ts        # Local storage utilities
│       ├── validation.ts     # Form validation helpers
│       └── formatters.ts     # Data formatting functions
├── .gitignore                # Git ignore configuration
├── .env.example              # Environment variables template
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── yarn.lock                 # Yarn dependency lock file
```

## Prerequisites

Before beginning the installation process, ensure you have the following requirements met on your development machine:

### Required Software
- **Node.js** (version 18.0 or higher) - Download from [nodejs.org](https://nodejs.org)
- **Yarn** package manager - Install from [yarnpkg.com](https://yarnpkg.com) or via npm:
  ```bash
  npm install -g yarn
  ```
- **Expo CLI** - Install globally via npm:
  ```bash
  npm install -g expo-cli
  ```

### Development Environment Setup
- **Android Studio** (for Android development) - Download from [developer.android.com](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - Available from Mac App Store
- **Git** version control system - Download from [git-scm.com](https://git-scm.com)

### Device Requirements
- **Physical Device**: Android 7.0+ or iOS 12.0+ with Expo Go app installed
- **Emulator**: Android Virtual Device or iOS Simulator properly configured

## Installation Steps

Follow these detailed steps to install and set up the Judo Mastery application:

### Step 1: Clone the Repository
```bash
# Clone the repository from GitHub
git clone https://github.com/cosmin-oros/judo-mastery.git

# Navigate to the project directory
cd judo-mastery
```

### Step 2: Install Dependencies
```bash
# Install all project dependencies using Yarn
yarn install

# Alternative: if you prefer npm
npm install
```

### Step 3: Environment Configuration
```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your configuration values
# Add your Firebase configuration, API keys, etc.
```

### Step 4: Platform-Specific Setup

#### For Android Development:
```bash
# Ensure Android SDK is properly configured
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### For iOS Development (macOS only):
```bash
# Install iOS dependencies
cd ios && pod install && cd ..
```

## Compilation Steps

The application compilation process differs based on your target platform and deployment requirements:

### Development Build Compilation
```bash
# Start the Metro bundler for development
yarn start

# Or start with cache clearing
yarn start --clear
```

### Production Build Compilation

#### Android Production Build:
```bash
# Build APK for Android
expo build:android

# Or build Android App Bundle (recommended for Play Store)
expo build:android -t app-bundle

# Using EAS Build (modern approach)
eas build --platform android
```

#### iOS Production Build:
```bash
# Build for iOS
expo build:ios

# Using EAS Build (modern approach)
eas build --platform ios
```

## Application Launch Steps

### Development Environment Launch

#### Step 1: Start the Development Server
```bash
# Start Expo development server
yarn start

# The following options will be available:
# - Press 'a' to run on Android device/emulator
# - Press 'i' to run on iOS simulator
# - Press 'w' to run on web browser
# - Scan QR code with Expo Go app on physical device
```

#### Step 2: Platform-Specific Launch Commands

**For Android:**
```bash
# Launch on Android emulator or connected device
yarn android

# Or run with specific emulator
yarn android --variant=debug
```

**For iOS:**
```bash
# Launch on iOS simulator (macOS only)
yarn ios

# Or specify iOS simulator device
yarn ios --simulator="iPhone 14 Pro"
```

**For Web:**
```bash
# Launch web version in browser
yarn web
```

### Production Environment Launch

#### Step 1: Install Production Build
- **Android**: Install the generated APK file on Android device
- **iOS**: Install through TestFlight or App Store
- **Web**: Deploy to hosting service (Vercel, Netlify, etc.)

#### Step 2: Configure Production Environment
```bash
# Set production environment variables
export NODE_ENV=production
export API_URL=https://your-production-api.com
export FIREBASE_CONFIG=your-production-firebase-config
```

## Usage

### Running the App in Development Mode

1. **Start the development server:**
   ```bash
   yarn start
   ```

2. **Choose your platform:**
   - **Physical Device**: Install Expo Go app and scan the QR code
   - **Android Emulator**: Press 'a' or run `yarn android`
   - **iOS Simulator**: Press 'i' or run `yarn ios` (macOS only)
   - **Web Browser**: Press 'w' or run `yarn web`

3. **Development Features:**
   - Hot reloading for instant code changes
   - Remote debugging with React Developer Tools
   - Network request inspection
   - Performance monitoring

### Testing the Application

```bash
# Run unit tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run end-to-end tests
yarn test:e2e

# Run specific test file
yarn test AuthService.test.ts
```

## Deployment

### Mobile App Deployment

#### Android Deployment:
1. **Prepare for deployment:**
   ```bash
   # Build production APK
   eas build --platform android --profile production
   ```

2. **Deploy to Google Play Store:**
   - Create developer account at [play.google.com/console](https://play.google.com/console)
   - Upload APK/AAB file
   - Complete store listing information
   - Submit for review

#### iOS Deployment:
1. **Prepare for deployment:**
   ```bash
   # Build production IPA
   eas build --platform ios --profile production
   ```

2. **Deploy to App Store:**
   - Create developer account at [developer.apple.com](https://developer.apple.com)
   - Upload IPA via App Store Connect
   - Complete app information
   - Submit for App Store review
