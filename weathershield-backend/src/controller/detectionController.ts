import { Request, Response } from 'express';

export const detectImage = (req: Request, res: Response) => {
    // Tạo mock data trả về, đúng theo cấu trúc DetectionResponse 
  const mockResponseData = {
    status: 'success',
    processingTimeMs: 487,
    detections: [
      { id: 'det-1', label: 'car', confidence: 0.92, box: { x: 50, y: 80, width: 120, height: 100 } },
      { id: 'det-2', label: 'pedestrian', confidence: 0.85, box: { x: 60, y: 30, width: 50, height: 75 } },
    ],
  }

  // Dùng setTimeout để giả lập độ trễ xử lý AI (~500ms)
    setTimeout(() => {
        res.status(200).json(mockResponseData);
    }, 500);

};