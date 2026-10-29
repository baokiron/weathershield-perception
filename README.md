# WeatherShield Perception

AI-powered perception dashboard that detects objects (vehicles, pedestrians, traffic signs) in images captured under adverse weather conditions — rain, fog, and low-light night driving — for autonomous vehicle research.

## Overview

WeatherShield Perception addresses a core problem in autonomous vehicle computer vision: standard object detection models perform well in daylight but suffer severe accuracy drops in bad weather. This project builds a full-stack, cloud-deployable system with:

- A **web dashboard** to upload images, preview them, and visualize AI detection results side-by-side (original vs. annotated)
- A **backend gateway** that handles uploads, forwards images for analysis, and logs results
- An **AI inference pipeline** (in progress) combining image restoration (dehazing, enhancement) with object detection fine-tuned for adverse weather

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| File Handling | Multer |
| HTTP Client | Axios |
| Database | MongoDB Atlas + Mongoose  |
| AI Engine | Python + FastAPI + YOLOv8 + OpenCV (planned) |

## Project Structure

```
weathershield-perception/
├── weathershield-frontend/    # React dashboard
│   └── src/
│       ├── components/        # Navbar, SplitDashboard, ImageUploader, BoundingBoxCanvas
│       └── types/              # Shared TypeScript data contracts (detection.ts)
├── weathershield-backend/     # Express API gateway
│   └── src/
│       ├── controllers/        # detectionController.ts
│       └── index.ts            # Routes: /upload, /api/v1/detect
└── README.md
```


## Features Implemented

- **Split-screen dashboard**: compare the original image against AI detection results side by side
- **Drag-and-drop image upload** with instant client-side preview
- **Dynamic bounding box rendering** on an HTML5 Canvas, with coordinates scaled proportionally to any display size (responsive, resize-safe)
- **File upload API** (`POST /upload`) with size limits (5MB) and image-type validation via Multer
- **Mock detection API** (`POST /api/v1/detect`) simulating AI inference latency, returning structured detection results
- **Loading and error states** across the upload-to-render flow

## In Progress / Planned

- [ ] MongoDB Atlas + Mongoose integration to persist analysis logs
- [ ] Real AI inference service (FastAPI + YOLOv8 + OpenCV restoration pipeline), replacing the current mock response
- [ ] Metrics endpoint (`GET /api/v1/metrics`) and charts (Recharts) for mAP / latency visualization
- [ ] Cloud deployment (Frontend → Vercel, Backend → Render, AI service → Hugging Face Spaces / Render)

## Getting Started

**Prerequisites:** Node.js, npm

**1. Run the backend**
```bash
cd weathershield-backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

**2. Run the frontend** (in a separate terminal)
```bash
cd weathershield-frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

Both servers must be running simultaneously for the upload-to-detection flow to work.

## Data Contract

Frontend and backend communicate using a shared detection response shape:

```ts
interface DetectionResponse {
  status: 'success' | 'error';
  processingTimeMs: number;
  detections: DetectionItem[];
}

interface DetectionItem {
  id: string;
  label: string;
  confidence: number;
  box: { x: number; y: number; width: number; height: number };
}
```

## License

Academic project — no license specified.