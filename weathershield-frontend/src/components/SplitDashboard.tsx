import React, { useState } from 'react';
import axios from 'axios';
import BoundingBoxCanvas from './BoundingBoxCanvas';
import ImageUploader from './ImageUploader';
import type { DetectionItem, DetectionResponse } from '../types/detection';

const SplitDashboard: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<DetectionItem[]>([]);

  const handleImageSelect = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData();
      formData.append('image', file);

      // gọi POST tới http://localhost:5000/upload, truyền formData
      await axios.post('http://localhost:5000/upload', formData);

      // gọi tiếp POST tới http://localhost:5000/api/v1/detect
      const detectResponse = await axios.post<DetectionResponse>('http://localhost:5000/api/v1/detect')

      // lấy mảng detections từ response, set vào state
      setDetections(detectResponse.data.detections);

    } catch (err) {
      setError('Upload or anything else, try again')
    } finally {
      setIsLoading(false)
    }
  };

  return (
  <div className="p-6 flex flex-col gap-6">
    <ImageUploader onImageSelect={handleImageSelect} />

    {error && <div className="bg-red-900 text-red-200 p-3 rounded-md">{error}</div>} 


    {/* hiển thị dòng chữ "Đang phân tích..." — CHỈ khi isLoading là true */}
    {isLoading && <div className="bg-black text-white p-3 rounded-md">is loading...</div>}


    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-800 rounded-lg p-4">
        <h2 className="text-slate-300 font-medium mb-2">Original Version</h2>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Original weather frame"
            className="w-full rounded-md object-cover"
          />
        ) : (
          <p className="text-slate-500">No image selected yet</p>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h2 className="text-slate-300 font-medium mb-2">AI Detection</h2>
        {imageUrl ? (
          <BoundingBoxCanvas imageUrl={imageUrl} detections={detections}  />
        ) : (
          <p className="text-slate-500">No image selected yet</p>
        )}
      </div>
    </div>
  </div>
);
};

export default SplitDashboard;