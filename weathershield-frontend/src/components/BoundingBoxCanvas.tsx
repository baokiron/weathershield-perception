import React, { useEffect, useRef } from 'react';
import type { DetectionItem } from '../types/detection';


interface BoundingBoxCanvasProps {
  imageUrl: string;
  detections: DetectionItem[]
}

// viết hàm tra màu theo label
const getColorForLabel = (label: string): string => {
     switch (label.toLowerCase()) {
       case 'car': return 'red';
       case 'pedestrian': return 'blue';
       case 'rider': return 'yellow';
       case 'traffic light': return 'white';
       default: return 'gray'; 
     }
};

const LABEL_HEIGHT = 20;
const LABEL_PADDING = 9;
const TEXT_OFFSET_X = 4;
const TEXT_OFFSET_Y = 5;

const BoundingBoxCanvas: React.FC<BoundingBoxCanvasProps> = ({ imageUrl, detections }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    const drawCanvas = () => {
      // Skip if the image hasn't finished loading yet (e.g. resize fired too early)
      if (!img.complete || img.naturalWidth === 0) return;

      const { width: displayWidth } = container.getBoundingClientRect();
      const displayHeight = displayWidth * (img.naturalHeight / img.naturalWidth);

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      const scaleX = displayWidth / img.naturalWidth;
      const scaleY = displayHeight / img.naturalHeight;

      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);


      // TODO 6: đổi mockDetections.forEach thành detections.forEach
      detections.forEach((item) => {
        // TODO 7: trước đây box.x/box.y/box.width/box.height — giờ cần lấy qua item.box.x, v.v.
        const renderX = item.box.x * scaleX;
        const renderY = item.box.y * scaleY;
        const renderWidth = item.box.width * scaleX;
        const renderHeight = item.box.height * scaleY;

        // TODO 8: màu giờ lấy từ hàm getColorForLabel(item.label), không còn box.color
        const color = getColorForLabel(item.label);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(renderX, renderY, renderWidth, renderHeight);

        // TODO 9: labelText giờ dùng item.label, item.confidence thay vì box.label, box.confidence
        const labelText = `${item.label} ${(item.confidence * 100).toFixed(0)}%`;
        ctx.font = '14px sans-serif';
        const textWidth = ctx.measureText(labelText).width;

        ctx.fillStyle = color;
        ctx.fillRect(renderX, renderY - LABEL_HEIGHT, textWidth + LABEL_PADDING, LABEL_HEIGHT);

        ctx.fillStyle = 'white';
        ctx.fillText(labelText, renderX + TEXT_OFFSET_X, renderY - TEXT_OFFSET_Y);
      });
    };

    img.onload = () => {
      drawCanvas();
    };

    const handleResize = () => {
      drawCanvas();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [imageUrl, detections]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} className="w-full rounded-md" />
    </div>
    );
};

export default BoundingBoxCanvas;