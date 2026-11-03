import { Request, Response } from 'express';
import AnalysisLog from '../models/AnalysisLog';

const MOCK_INFERENCE_MS = 500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const detectImage = async (req: Request, res: Response) => {
  const filename =
    typeof req.body?.filename === 'string' ? req.body.filename.trim() : '';

  if (!filename) {
    res.status(400).json({
      status: 'error',
      processingTimeMs: 0,
      detections: [],
      message: 'filename is required',
    });
    return;
  }

  const startedAt = Date.now();
  await delay(MOCK_INFERENCE_MS);
  const processingTimeMs = Date.now() - startedAt;

  const mockResponseData = {
    status: 'success' as const,
    processingTimeMs,
    detections: [
      { id: 'det-1', label: 'car', confidence: 0.92, box: { x: 50, y: 80, width: 120, height: 100 } },
      { id: 'det-2', label: 'pedestrian', confidence: 0.85, box: { x: 60, y: 30, width: 50, height: 75 } },
    ],
  };

  try {
    await AnalysisLog.create({
      imageUrl: filename,
      status: mockResponseData.status,
      processingTimeMs: mockResponseData.processingTimeMs,
      detections: mockResponseData.detections.map(({ label, confidence, box }) => ({
        label,
        confidence,
        box,
      })),
    });
  } catch (err) {
    console.error('Failed to save analysis log:', err);
  }

  res.status(200).json(mockResponseData);
};
