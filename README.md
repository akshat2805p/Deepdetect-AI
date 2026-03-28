<div align="center">

# 🛡️ DeepDetect AI
### Advanced Synthetic Media Detection Platform

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&pause=1000&color=F59E0B&center=true&vCenter=true&width=600&lines=Military-Grade+Deepfake+Detection;Powered+by+Gemini+1.5+Vision;Real-time+Forensic+Analysis;Protecting+Digital+Authenticity)](https://git.io/typing-svg)

<br/>
<br/>

[![React](https://img.shields.io/badge/Frontend-React_18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node](https://img.shields.io/badge/Backend-Node.js_20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Microservice-Python_Flask-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://flask.palletsprojects.com/)
[![Gemini](https://img.shields.io/badge/AI_Model-Gemini_1.5_Flash-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)](https://deepmind.google/technologies/gemini/)

<br/>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-architecture">Architecture</a>
</p>

</div>

---

## 🚀 Overview

**DeepDetect AI** is a state-of-the-art forensic analysis platform designed to combat the rising threat of synthetic media. It provides instantaneous, high-accuracy detection of deepfakes and AI-generated content across multiple media types using **Google's Gemini 1.5 Flash Vision Model** and a live biometric neural scanning system.

The platform runs **completely without a database** — no account or login required. Just open the app and start scanning. Scan history is retained for the duration of your browser session.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **🔍 Multi-Modal Detection** | Analyze Images, Video, Audio, and ID Documents for AI manipulation. |
| **⚡ Real-Time Analysis** | Get forensic results in seconds via Gemini 1.5 Flash Vision API. |
| **🎥 Live Camera Scanner** | Real-time face detection using `@vladmandic/face-api` with a sci-fi biometric HUD overlay. |
| **🌐 Web Forensics** | Cross-references images with the live web via a Python/Google Cloud Vision microservice. |
| **📊 Advanced Metrics** | Deep breakdown of Perplexity, Burstiness, Similarity Score, and AI Probability. |
| **📈 Interactive Charts** | Pie chart (authenticity split) and bar chart (signal metrics) powered by Recharts. |
| **📄 PDF Export** | Download a full forensic report for any scan via jsPDF. |
| **🚫 No Login Required** | No database, no account. Open the app and scan immediately. |
| **💎 Premium UI** | Dark royal aesthetic with Framer Motion animations and micro-interactions. |

---

## 🛠️ Tech Stack

### **Frontend**
| Tech | Description |
| :--- | :--- |
| **React 18 + Vite** | High-performance SPA framework with lightning-fast HMR. |
| **TypeScript** | Fully typed, type-safe codebase for reliability. |
| **Tailwind CSS** | Utility-first styling with a custom dark royal design system. |
| **Framer Motion** | Cinematic entrance animations and micro-interactions. |
| **@vladmandic/face-api** | In-browser live face detection for biometric neural scanning. |
| **Recharts** | Interactive data visualization for forensic metrics. |
| **jsPDF + jspdf-autotable** | Client-side PDF generation for forensic reports. |
| **Lucide React** | Modern, consistent icon library. |

### **Backend (Node.js)**
| Tech | Description |
| :--- | :--- |
| **Node.js + Express** | Robust REST API handling scan analysis and history. |
| **TypeScript** | Type-safe server code with `ts-node`. |
| **Google Gemini API** | `gemini-1.5-flash` model for multimodal deepfake inference. |
| **Multer** | Secure file upload handling for images, video, and audio. |
| **In-Memory Store** | Session-based scan history — no database required. |

### **Microservice (Python)**
| Tech | Description |
| :--- | :--- |
| **Python Flask** | Lightweight microservice on Port 5003. |
| **Google Cloud Vision** | Reverse-image search: exact/partial match detection across the web. |

---

## 🏗️ Architecture

```
DeepDetectAi/
├── client/                  # React + Vite Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Landing page with "Get Started" CTA
│   │   │   ├── Dashboard.tsx    # Main forensics scanner + results
│   │   │   └── About.tsx        # About page
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Fixed navbar with "Get Started" button
│   │   │   ├── LiveHud.tsx      # Sci-fi live camera HUD overlay
│   │   │   └── ForensicMetrics.tsx
│   │   └── services/
│   │       └── api.ts           # API client with local/prod fallback
│   └── public/models/           # face-api.js model weights
│
├── server/                  # Node.js + Express Backend
│   ├── routes/
│   │   └── scan.ts          # /detect and /history endpoints
│   ├── utils/
│   │   └── fallbackStore.ts # In-memory scan history store
│   └── index.ts             # Server entry point
│
└── python_service/          # Python Flask Microservice (optional)
    └── app.py               # Google Cloud Vision web detection
```

---

## ⚡ Installation

### Prerequisites
- Node.js (v18+)
- Python 3.9+ *(optional, for web forensics)*
- Google Gemini API Key *(optional, uses simulation mode without it)*

### 1. Clone the Repository
```bash
git clone https://github.com/akshat2805p/Deepdetect-AI.git
cd Deepdetect-AI
```

### 2. Server Setup (Node.js)
```bash
cd server
npm install
# Create .env from example
cp .env.example .env
# Add your Gemini API key in .env (optional)
# GEMINI_API_KEY="your_key_here"
npm run dev
# Server runs on http://localhost:5002
```

### 3. Client Setup (React)
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

### 4. Python Microservice *(Optional — for web forensics)*
```bash
cd python_service
pip install -r requirements.txt
python app.py
# Microservice runs on http://localhost:5003
```

### 5. Access the App
Open **http://localhost:5173** → Click **"Get Started"** → Begin scanning!

> **No login required.** The app works immediately. Scan history is kept for your current browser session.

---

## 🔑 Environment Variables

### `server/.env`

```env
# Optional - leave as-is for simulation mode
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Server port
PORT=5002

# Optional - only needed for Python Vision microservice
GOOGLE_APPLICATION_CREDENTIALS="deepdetect-vision-credentials.json"

# CORS (add your frontend URL)
CORS_ORIGIN="http://localhost:5173"
```

---

## ☁️ Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "deploy: production ready"
   git push origin main
   ```

2. **Import to Vercel**
   - Framework preset: **Other** (uses root `vercel.json`)

3. **Set Environment Variables in Vercel**
   - `GEMINI_API_KEY` — Your Google Gemini API key
   - `CORS_ORIGIN` — Your Vercel frontend URL

4. **Redeploy** from the Vercel dashboard.

> **Note:** The backend uses in-memory storage. Scan history does not persist across server restarts (Vercel cold starts). This is by design — no database configuration needed.

---

## 🖥️ How It Works

1. **Navigate** to the Dashboard by clicking **"Get Started"** on the home page.
2. **Select** a scan mode: Upload, Live Camera, Video, Audio, or ID Verify.
3. **Upload** your file or use the live camera mode.
4. **Click** "Analyze Content" — the scan is sent to the Node.js backend.
5. **Gemini AI** analyzes the content and returns a forensic report.
6. **View** the results: authenticity verdict, confidence score, comparative analysis table, and signal metrics charts.
7. **Download** a full PDF forensic report.

---

<div align="center">

**DeepDetect AI** — *Authenticating Reality in a Synthetic World.*

[![GitHub](https://img.shields.io/badge/GitHub-akshat2805p-181717?style=for-the-badge&logo=github)](https://github.com/akshat2805p/Deepdetect-AI)

</div>
