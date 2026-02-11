# AI Doctor v3.1 - Intelligent Healthcare Assistant

![Landing Page](./frontend/src/assets/screenshots/landing.png)

AI Doctor is a cutting-edge, full-stack healthcare platform that leverages advanced Large Language Models (LLMs) to provide instant, structured, and personalized medical consultation. Featuring a modern, immersive 3D interface and multi-model comparison capabilities, it represents the future of AI-driven primary care.

## 🚀 Key Features

- **Multi-Model Arena**: Compare medical advice from industry-leading LLMs including **Google Gemini 2.0 Flash**, **GLM 4.5**, and **GPT-3.5 Turbo** (via OpenRouter) simultaneously.
- **Structured Medical Consultation**: Follows a rigorous clinical protocol to collect patient data (vitals, symptoms, history) and deliver structured advice:
    - General Treatment
    - Medical Treatment (Composition-focused)
    - Precautions & Safety Guidelines
    - Clinical Reasoning
    - Emergency Escalation Triggers
- **Immersive 3D Experience**: Powered by **Spline**, the landing page features a high-fidelity 3D medical robot assistant to engage users.
- **Multilingual & Accessible**: Full support for English, Hindi, and Marathi with real-time translation powered by the MyMemory API.
- **Voice-First Interface**: Hands-free interaction using high-accuracy Speech-to-Text (STT) and natural-sounding Text-to-Speech (TTS).
- **Responsive & Modern UI**: Built with **React**, **Tailwind CSS**, and **Framer Motion** for a fluid, dark-themed industrial aesthetic.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite & TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Components**: Radix UI (Headless UI) & shadcn/ui
- **Animations**: Framer Motion
- **3D Graphics**: Spline Runtime

### Backend
- **Server**: Flask (Python 3.x)
- **AI Orchestration**: Google Generative AI, Zhipu AI (GLM), OpenRouter
- **Translation**: MyMemory API
- **Deployment**: Vercel Serverless Functions

## 📸 Screenshots

### 1. Immersive Landing Page
The landing page features a 3D medical robot, setting the tone for a futuristic healthcare experience.
![Landing Page](./frontend/src/assets/screenshots/landing.png)

### 2. Multi-Model Arena
Compare responses from different AI models to ensure the most comprehensive advice.
![Model Arena](./frontend/src/assets/screenshots/arena.png)

### 3. Intelligent Chat Interface
Dr. Vaani provides personalized care with multilingual support.
![Chat Interface](./frontend/src/assets/screenshots/chat.png)

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- API Keys: Google Gemini, GLM (Zhipu AI), OpenRouter

### Step-by-Step Guide

1. **Clone & Environment Setup**
   ```bash
   git clone https://github.com/your-repo/ai-doctor-v3.1.git
   cd ai-doctor-v3.1
   python -m venv venv
   source venv/bin/activate # Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

3. **Configuration**
   Create a `.env` file in the root:
   ```env
   GOOGLE_API_KEY=your_key
   GLM_API_KEY=your_key
   OPENROUTER_API_KEY=your_key
   ```

4. **Launch**
   ```bash
   python app.py
   ```
   Access at `http://localhost:5000`

## 📊 Dataset Reference

This project utilizes the [AI Doctor - BluePlanet](https://www.kaggle.com/datasets/saahilgange/ai-doctor-blueplanet/) dataset for optimized medical terminology and phrasing patterns.

## ⚖️ Disclaimer

AI Doctor is an experimental AI tool designed for informational purposes only. It is **not a substitute for professional medical advice, diagnosis, or treatment**. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.