# Deepdetect AI - Setup Guide

## Local Development Setup

This guide walks through setting up Deepdetect AI for local development.

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/akshat2805p/Deepdetect-AI.git
cd Deepdetect-AI
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables:

**Server (.env)**:
```bash
cd server
cp .env.example .env
# Edit .env and add your Gemini API key if you have one
```

**Client (.env)**:
```bash
cd ../client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5002
```

4. Run development servers:

In separate terminals:
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

Access the app at `http://localhost:5173`

### Troubleshooting

**Issue**: Port 5002 already in use
- Solution: Change PORT in server/.env

**Issue**: CORS errors
- Solution: Update CORS_ORIGIN in server/.env

**Issue**: Gemini API errors
- Solution: App runs in simulation mode without API key
