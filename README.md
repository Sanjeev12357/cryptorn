Sure! Here's a beautifully formatted, professional README for your app **Crypto**. It's clean, developer-friendly, and ready to be used on GitHub or any project showcase:

---

# 🚀 Crypto - React Native Crypto Tracker App


<br />

<div align="center">
  <h3>📱 Cross-platform cryptocurrency tracking app built with React Native & Expo</h3>
  <p>Track real-time prices, manage your portfolio, and explore crypto markets with a sleek UI inspired by modern fintech and iOS aesthetics.</p>
</div>

---

## ✨ Features

### 📊 Core Functionality

* 📈 **Live Crypto Prices** via CoinGecko API
* 🔍 **Smart Search & Filters** for quick discovery
* ⭐ **Watchlist** to track favorites
* 💼 **Portfolio Management** with gain/loss tracking
* 🌍 **Runs on iOS and Android**

### 🎨 User Experience

* 🌟 Clean, beautiful UI with purple gradient accents
* 📊 7-day price sparkline charts
* 🔄 Pull-to-refresh for live updates
* 🌙 Light theme optimized for readability
* ⚡ Virtualized lists for smooth performance

### 🧭 Screens & Navigation

* 🏠 Home: Top cryptocurrencies and filters
* 🔍 Search: Instant results and history
* ⭐ Watchlist: Save and manage your coins
* 💼 Portfolio: View and calculate holdings
* 📊 Detail: Charts, market stats, and more

---

## 🛠️ Setup Instructions

### 📋 Prerequisites

* Node.js v16+
* npm or yarn
* Git
* Expo CLI:

  ```bash
  npm install -g expo-cli
  ```

### 📱 Device Testing

* Install **Expo Go** on your phone: [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 💻 Emulator Testing

* Android: Install Android Studio
* iOS (macOS only): Install Xcode

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sanjeev12357/cryptorn.git
cd crypto
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Run the App

```bash
npx expo start
```

### 📱 Running on Devices

* Scan QR code in terminal using **Expo Go**
* For emulators:

  ```bash
  npx expo start --android
  npx expo start --ios
  ```

---

## 📁 Project Structure

```
crypto/
├── src/
│   ├── components/
│   │   ├── CryptoRateCard.js
│   │   ├── FilterModal.js
│   │   ├── MiniChart.js
│   │   ├── PortfolioSummary.js
│   │   └── HoldingCard.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── SearchScreen.js
│   │   ├── WatchlistScreen.js
│   │   ├── PortfolioScreen.js
│   │   ├── CryptoDetailScreen.js
│   │   └── SplashScreen.js
│   └── services/
│       ├── CryptoService.js
│       └── StorageService.js
├── App.js
├── app.json
├── package.json
└── README.md
```

---

## 🧩 Configuration

### 🎨 app.json

```json
{
  "expo": {
    "name": "Crypto",
    "slug": "crypto",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "splash": {
      "backgroundColor": "#667eea"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.crypto"
    },
    "android": {
      "package": "com.yourcompany.crypto"
    }
  }
}
```

### 🔑 API Setup

* Uses **CoinGecko API** (no key required for basic use)

---

## 📦 Production Build

### ✅ Recommended: EAS Build

```bash
npm install -g eas-cli
eas login
eas build:configure
```

#### Build Commands

* Android APK:

  ```bash
  eas build --platform android --profile production
  ```
* Android AAB:

  ```bash
  eas build --platform android --profile production --format aab
  ```
* iOS:

  ```bash
  eas build --platform ios --profile production
  ```

### 📦 Legacy (Expo Build)

* Android APK:

  ```bash
  expo build:android -t apk
  ```
* iOS IPA:

  ```bash
  expo build:ios -t archive
  ```

---

## 🧪 Testing Checklist

* ✅ App launches correctly
* ✅ Real-time crypto data loads
* ✅ Search and filters work
* ✅ Watchlist updates persist
* ✅ Portfolio values update
* ✅ Navigation is smooth
* ✅ Pull-to-refresh triggers
* ✅ Charts load properly

---

## 🛠 Troubleshooting

| Issue               | Solution                                  |
| ------------------- | ----------------------------------------- |
| Metro bundler error | `npx expo start --clear`                  |
| Node module errors  | `rm -rf node_modules && npm install`      |
| Android build fails | Check SDK, Java, Android Studio           |
| iOS issues          | Check Xcode, CLI tools, Apple dev account |

---

## 📚 Dependencies

### Core

* `expo`
* `react-native`
* `@react-navigation/native`
* `@react-navigation/bottom-tabs`
* `@react-navigation/stack`

### UI & Utils

* `expo-linear-gradient`
* `react-native-chart-kit`
* `@react-native-async-storage/async-storage`
* `react-native-safe-area-context`
* `@expo/vector-icons`
* `react-native-svg`

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and open a pull request

### ✅ Guidelines

* Follow code conventions
* Test across platforms
* Write clear commit messages
* Update docs if needed


## 🙏 Acknowledgments

* [CoinGecko](https://www.coingecko.com/) for the API
* [Expo](https://expo.dev/) for the development framework
* React Native & Open Source community
* UI inspired by Apple & fintech apps

---

<div align="center">
  <strong>Built with ❤️ and ☕ by Sanjeev Singh Saini</strong><br />
  ⭐ Star this repo if you like it!  
  🔗 <a href="https://github.com/Sanjeev12357/cryptorn">View on GitHub</a>
</div>

---
