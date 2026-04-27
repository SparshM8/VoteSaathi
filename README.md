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
- **Sanitization**: Deep input validation via `express-validator` to prevent XSS and Injection.
- **Rate Limiting**: Integrated DDoS protection using `express-rate-limit`.
- **Testing**: 100% pass-rate on automated API tests using **Jest** and **Supertest**.
- **Aesthetics**: Fully responsive, glassmorphic UI with **AOS** reveals and **Lenis** smooth scrolling.

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
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_key_here
   MONGO_URI=your_mongodb_uri_here
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
