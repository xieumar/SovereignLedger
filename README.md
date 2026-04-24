# SovereignLedger

SovereignLedger is a premium financial dashboard and expense tracking application built with React Native and Expo. It focuses on security, data privacy, and a high-fidelity user experience.

## Key Features

### Transaction Management
- Log income and expenses with a custom numeric keypad.
- Categorize transactions using a dynamic, scrollable dropdown.
- Real-time balance updates across the dashboard.

### Security and Privacy
- Facial Liveness Verification: Secure access to sensitive parts of the app using advanced camera-based liveness detection.
- Real-time challenge-response system (blink, nod, etc.) to ensure authentic user presence.
- Local Data Storage: No backend required. All your financial data stays securely on your device.

### Financial Planning
- Budgeting System: Set monthly, weekly, or daily limits for specific categories.
- Visual progress tracking for all allocations and savings goals.
- Smart Icon Mapping: Automatic category icon detection based on transaction descriptions.

### Data Visualization
- Interactive Spline Charts: Visualize daily spending patterns and trends.
- Comprehensive financial overviews with income and expense breakdowns.

### Recurring Transactions
- Automate your regular finances by setting up recurring income or expense logs.
- Support for Daily, Weekly, and Monthly frequencies.

### Data Export
- Export your full transaction history as a CSV file directly from the settings menu for external reporting.

## Technology Stack

- Framework: React Native with Expo
- Navigation: Expo Router (File-based routing)
- State Management: Zustand
- Persistence: expo-sqlite
- Icons: Lucide React Native
- Components: Custom-built high-fidelity UI components

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo Go app on your mobile device (or an emulator)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with the Expo Go app or press 'a' for Android / 'i' for iOS.

## Security Implementation

The app uses a custom-built Facial Liveness Verification system. This system restricts access to the dashboard until a successful identity check is performed. The check involves a series of randomized challenges to prevent spoofing.

## Data Persistence

SovereignLedger utilizes an SQLite database via expo-sqlite to store all transactions, budgets, and settings. This ensures that your data is persistent across app restarts without relying on an external server.
