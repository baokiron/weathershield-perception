import mongoose, { Schema, Document } from 'mongoose';

// 1. Định nghĩa interface mô tả 1 document
export interface IAnalysisLog extends Document {
  imageUrl: string;
  status: 'success' | 'error';
  processingTimeMs: number;
  detections: {
    label: string;
    confidence: number;
    box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Định nghĩa Schema tương ứng
const AnalysisLogSchema = new Schema<IAnalysisLog>(
  {
    imageUrl: { type: String, required: true },
    status: { type: String, enum: ['success', 'error'], required: true },
    processingTimeMs: { type: Number, required: true },
    detections: [
      {
        label: { type: String, required: true },
        confidence: { type: Number, required: true },
        box: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
          width: { type: Number, required: true },
          height: { type: Number, required: true },
        },
      },
    ],
  },
  { timestamps: true } // tự động thêm createdAt, updatedAt
);

AnalysisLogSchema.index({ createdAt: -1 });

// 3. Tạo Model từ Schema và export
export default mongoose.model<IAnalysisLog>('AnalysisLog', AnalysisLogSchema);