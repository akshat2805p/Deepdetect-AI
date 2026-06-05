# Testing Guide

## Manual Testing Checklist

### Server Setup
- [ ] Server starts without errors on port 5002
- [ ] Health check endpoint responds: GET /api/health
- [ ] CORS headers are properly configured
- [ ] Environment variables load from .env

### Frontend Setup
- [ ] Client builds successfully
- [ ] Dev server runs on port 5173
- [ ] No TypeScript compilation errors
- [ ] All dependencies resolve correctly

### Feature Testing

#### Image Upload
1. [ ] Upload JPEG/PNG image
2. [ ] Verify file size validation
3. [ ] Confirm analysis completes
4. [ ] Check results display correctly

#### Live Camera
1. [ ] Grant camera permissions
2. [ ] Face detection initializes
3. [ ] HUD overlay displays data
4. [ ] Analysis works in real-time

#### Results & Export
1. [ ] Metrics display accurately
2. [ ] Charts render correctly
3. [ ] PDF export generates without errors
4. [ ] File downloads successfully

### Performance
- [ ] Analysis completes within 10 seconds
- [ ] No memory leaks during extended use
- [ ] Camera feed runs at 30+ FPS
- [ ] Bundle size within acceptable limits

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Automated Testing

Run type checking:
```bash
npm run typecheck:server
```

Build verification:
```bash
npm run verify
```
