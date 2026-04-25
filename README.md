# SovereignLedger

SovereignLedger is a premium financial dashboard and expense tracking application built with React Native and Expo. It focuses on security, data privacy, and a high-fidelity user experience.

Experience the live mobile demo here: [Appetize.io](https://appetize.io/app/b_7oepgqmel54ngqbekiqat2lbea)

## Key Features

### Transaction Management
- Log income and expenses with a custom numeric keypad.
- Categorize transactions using a dynamic, scrollable dropdown.
- Real-time balance updates across the dashboard.

### Security and Privacy
- Facial Liveness Verification: Secure access to sensitive parts of the app using real-time camera-based liveness detection.
- Challenge-Response System: Integrated detection for blinking, nodding, and smiling to ensure authentic user presence.
- Local Data Storage: All financial data stays securely on your device using encrypted local persistence.

### Financial Planning
- Budgeting System: Set monthly, weekly, or daily limits for specific categories.
- Visual progress tracking for all allocations and savings goals.
- Smart Icon Mapping: Automatic category icon detection based on transaction descriptions.

### Data Visualization
- Interactive Spline Charts: Visualize daily spending patterns and trends.
- Comprehensive financial overviews with income and expense breakdowns.

### Recurring Transactions
- Automate regular finances by setting up recurring income or expense logs.
- Support for Daily, Weekly, and Monthly frequencies.

### Data Export
- Export full transaction history as a CSV file directly from the settings menu for external reporting.

## Technology Stack

- Framework: React Native with Expo SDK 54
- Navigation: Expo Router (File-based routing)
- State Management: Zustand
- Persistence: expo-sqlite
- Camera Engine: react-native-vision-camera
- Face Detection: react-native-vision-camera-face-detector
- Background Processing: react-native-worklets-core
- Icons: Lucide React Native
- Components: Custom high-fidelity UI system

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

The application implements a robust Facial Liveness Verification system. This system restricts access to the dashboard until a successful identity check is performed. The check involves a series of randomized challenges (blink detection, head nodding, and smiling) processed in real-time via the device's front camera. 

The implementation utilizes Vision Camera frame processors and specialized face detection worklets to ensure low-latency performance and high reliability without sending biometric data to any external server.

## Data Persistence

SovereignLedger utilizes an SQLite database via expo-sqlite to store all transactions, budgets, and settings. This ensures that your data is persistent across app restarts without relying on an external server, keeping your financial information private and under your control.

## Future Roadmap

- Enhanced Anti-Spoofing: Further optimization of detection heuristics for varied lighting conditions.
- Server-Side Verification: Optional remote cryptographic signing of liveness packets for enterprise environments.
- Multi-Account Sync: Optional end-to-end encrypted cloud backup.
- Advanced Analytics: Deeper financial insights and predictive spending behavior modeling.
