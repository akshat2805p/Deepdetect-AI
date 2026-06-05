# Deepdetect AI - Development Guide

## Project Architecture

### Directory Structure
```
Deepdetect-AI/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   └── services/      # API client utilities
│   └── package.json
├── server/                # Node.js + Express Backend
│   ├── routes/            # API route handlers
│   ├── utils/             # Utility functions
│   └── package.json
└── scripts/               # Development automation
```

## Development Workflow

### Frontend Development

1. Components are built with React 19 and TypeScript
2. Styling uses Tailwind CSS with custom configuration
3. Animations powered by Framer Motion
4. State management via React Hooks

### Backend Development

1. Express.js server with TypeScript
2. Multer for file upload handling
3. CORS configuration for frontend communication
4. In-memory storage for scan history

## Building and Testing

### Type Checking
```bash
npm run typecheck:server
```

### Building for Production
```bash
npm run build:client
npm run build:server
```

### Full Verification
```bash
npm run verify
```

## API Endpoints

### POST /api/scan/detect
Analyze images for deepfakes
- Accepts multipart/form-data with image file
- Returns forensic analysis results

### GET /api/scan/history
Retrieve scan history for current session

## Common Issues and Solutions

### TypeScript Errors
- Run: `npm run typecheck:server`
- Fix any type mismatches before building

### Port Conflicts
- Default: 5002 (server), 5173 (client)
- Override: Change PORT in .env

### Build Failures
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (must be 18+)
