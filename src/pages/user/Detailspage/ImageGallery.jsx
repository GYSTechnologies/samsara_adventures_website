import React, { useState } from "react";
import { X } from "lucide-react";

const ImageGallery = ({ images = [], title = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);

  if (!images.length) return null;

  if (showFullGallery) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 bg-black text-white">
            <button onClick={() => setShowFullGallery(false)} className="p-2 rounded-full bg-white/20">
              <X size={20} />
            </button>
            <span className="text-sm">{currentImageIndex + 1} / {images.length}</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src={images[currentImageIndex]} alt={`${title} ${currentImageIndex + 1}`} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex justify-center p-4 space-x-2">
            {images.map((_, index) => (
              <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden cursor-pointer" onClick={() => setShowFullGallery(true)}>
        <img src={images[currentImageIndex]} alt={`${title} ${currentImageIndex + 1}`} className="w-full h-full object-cover" />
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.slice(0, 5).map((image, index) => (
            <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'}`}>
              <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
          {images.length > 5 && (
            <button onClick={() => setShowFullGallery(true)} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 border-2 border-gray-200">
              <span className="text-xs font-medium">+{images.length - 5}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;