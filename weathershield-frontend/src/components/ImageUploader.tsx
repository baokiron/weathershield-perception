import React, { useState } from 'react';

interface ImageUploaderProps {
  // TODO 1: Định nghĩa prop callback — component này cần "báo" lên cho
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {

    // TODO 2: State lưu trạng thái "đang kéo file lên vùng thả hay không"
    const [isDragging, setIsDragging] = useState(false);

    // Các hàm xử lý sự kiện (Phần 2) và JSX return (Phần 3-4) sẽ làm sau
    // TODO 3: Xử lý khi file đang được kéo rê TRÊN vùng thả
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true);
    };

    // TODO 4: Xử lý khi file bị kéo RA KHỎI vùng thả (không thả xuống)
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            onImageSelect(file);
        }
    };

    // TODO 6: Xử lý khi người dùng chọn file qua input (click thường, không kéo-thả)
    // Gợi ý cấu trúc:
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelect(file);
    }
    };

    return (
    <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-sky-400 bg-slate-800' : 'border-slate-600 bg-slate-900'
        }`}
    >
        <label className="cursor-pointer flex flex-col items-center gap-2">
        {<input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />}

        <span className="text-slate-300">
            {isDragging ? 'Thả ảnh vào đây...' : 'Kéo-thả ảnh vào đây, hoặc bấm để chọn file'}
        </span>
        </label>
    </div>
    );
};

export default ImageUploader;