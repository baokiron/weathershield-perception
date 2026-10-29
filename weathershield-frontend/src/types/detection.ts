export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionItem {
  id: string;
  label: string;
  confidence: number;
  box: BoundingBox;
}

export interface DetectionResponse {
  status: 'success' | 'error';
  processingTimeMs: number;
  detections: DetectionItem[];
}