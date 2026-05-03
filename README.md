# 🗳️ VoteSaathi — The AI Layer of Democracy

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![AI: Google Gemini](https://img.shields.io/badge/AI-Gemini_1.5_Flash-blue.svg)](https://ai.google.dev/)
[![Testing: Jest](https://img.shields.io/badge/Testing-Jest_100%25-brightgreen.svg)](https://jestjs.io/)

**VoteSaathi** is a premium, AI-powered civic education platform designed to empower citizens with real-time election intelligence. It bridges the gap between complex democratic processes and the modern voter using state-of-the-art AI.

---

## ✨ Key Features

### 🤖 AI Civic Mentor
An advanced LLM-driven chat interface powered by **Google Gemini**. It provides instant guidance on registration, voter rights, and candidate backgrounds in plain, accessible language.

### 🛡️ Deep Fact-Checker
A specialized AI engine that analyzes news snippets and claims. It provides a credibility verdict (Likely True, Suspicious, or Fake) and a detailed explanation to combat election misinformation.

### 📊 Voter Intelligence Dashboard
Real-time participation analytics and participation trends using **Chart.js**. Visualizes voter turnout from 2004–2024 to provide context for modern democracy.

### 📍 Station Locator & Tools
- **Booth Locator**: Proximity-aware search by PIN code.
- **Eligibility Wizard**: A multi-step validator for first-time voters.
- **Candidate Explorer**: Detailed breakdown of constituency-wise candidates and their visions.

---

## 🛠️ Technical Excellence

### Architecture
- **Frontend**: Clean, high-performance Vanilla JS & CSS3 (Linear-inspired design system).
- **Backend**: Robust Node.js & Express framework with modular MVC architecture.
- **AI Integration**: Native Google Generative AI SDK for Gemini 1.5 Flash.
- **Database**: MongoDB integration for query logging and analytics.

### Security & Quality
- **Input Validation**: Deep input validation and sanitization via `express-validator` and custom XSS protection.
- **Parameter Pollution**: Protection against HTTP parameter pollution via `hpp`.
- **Rate Limiting**: Tiered DDoS protection — 100 req/15min for general API, 20 req/15min for AI endpoints.
- **Security Headers**: Full Helmet.js suite with custom CSP, HSTS (`max-age=63072000`), `X-Frame-Options`, and `Permissions-Policy`.
- **CORS**: Strict origin whitelist with dynamic validation for production environments.
- **Efficiency**: PWA capabilities with **Service Worker v2** (cache-first with dynamic caching + stale cleanup) and **Gzip compression**.
- **Monitoring**: Live **GCP Cloud Status** heartbeat monitor.
- **Testing**: 9 automated API tests using **Jest** and **Supertest** — covering election endpoints, AI validation, security headers, CORS, and production config protection.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google AI (Gemini) API Key

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/VoteSaathi.git
   cd VoteSaathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory (see `.env.example`):
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_key_here
   MONGODB_URI=your_mongodb_uri_here
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. **Run the Application**
   ```bash
   # Development mode (with hot-reload)
   npm run dev

   # Production mode
   npm start
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

---

## 🎨 Design Inspiration
Inspired by the clean, high-contrast aesthetics of **Linear**, **Stripe**, and **Vercel**. Focuses on visual hierarchy, accessibility, and a premium "Pro-level" civic experience.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built with ❤️ for a more informed democracy.
