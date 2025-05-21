## ✨ Project Overview

* **Objective**: To address the low medication adherence among young adults and provide a personalized health management experience
* **Core Features**:

  * Automatic medication registration via prescription/envelope image recognition
  * Daily medication reminder notifications
  * Calendar-based hospital visit tracking and memos
  * Chatbot service for medication-related Q\&A

---

## 📚 Tech Stack

| Category       | Technology                    |
| -------------- | ----------------------------- |
| Framework      | React Native (Expo)           |
| Navigation     | React Navigation              |
| Notifications  | expo-notifications            |
| Image Handling | expo-image-picker             |
| Data Storage   | AsyncStorage, API integration |
| Database       | PostgreSQL                    |

---

## 🚀 How to Run

1. **Clone & Install**

```bash
git clone https://github.com/wogns-kim/MyHealthAppExpo.git
cd MyHealthAppExpo
npm install
```

2. **Start Expo**

```bash
npx expo start
```

3. **Testing**

* Scan the QR code using the Expo Go app
* Run on iOS simulator or real device

---

## 📅 Key Screens Overview

| Screen           | Description                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| Sign Up / Login  | User authentication and token issuance                                       |
| Registration     | Input of name, birth date, gender, chronic diseases, allergies               |
| Home             | Today's medication checklist, hospital record cards, chatbot button          |
| Register Card    | Upload prescription or envelope photos to generate cards automatically       |
| Card Detail      | Displays hospital name, doctor info, medication image, and progress tracking |
| Edit Card Info   | Edit card title and hospital name manually                                   |
| Card Detail View | Chatbot Q\&A, medication reminder settings, drug efficacy info               |

---

## 📑 Folder Structure

```
MyHealthAppExpo/
├── assets/             # Static assets like images and icons
├── pic/                # Demo and test images
├── src/
│   └── screens/        # React components for each screen
├── App.js              # Entry point
├── constants.js        # API endpoints and constants
├── package.json        # Project metadata
└── ...
```

---

## 🎉 Purpose for Submission

This app was designed to solve the **low medication adherence problem among young adults**. It simulates a real-world healthcare use case and is optimized for quick review and experience by hackathon judges through an intuitive UI/UX.

* Quick demo via Expo Go
* Unique user experience with automated medication card creation
* Built with iterative feedback from actual users

---

## 🌐 Links

* GitHub: [https://github.com/wogns-kim/MyHealthAppExpo](https://github.com/wogns-kim/MyHealthAppExpo)


