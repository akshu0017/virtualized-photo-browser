import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function PhotoModal({ photos, currentIndex, onClose, onNavigate }) {
  const currentPhoto = photos[currentIndex];

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentPhoto) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X size={24} /></button>

        {currentIndex > 0 && (
          <button className="nav-btn prev" onClick={() => onNavigate(currentIndex - 1)}>
            <ChevronLeft size={36} />
          </button>
        )}

        <div className="image-stage">
          <img src={currentPhoto.url} alt={currentPhoto.name} />
        </div>

        {currentIndex < photos.length - 1 && (
          <button className="nav-btn next" onClick={() => onNavigate(currentIndex + 1)}>
            <ChevronRight size={36} />
          </button>
        )}

        <div className="metadata-bar">
          <Info size={18} />
          <span><strong>{currentPhoto.name}</strong></span>
          <span>•</span>
          <span>{currentPhoto.dimensions}px</span>
          <span>•</span>
          <span>{currentPhoto.size}</span>
          <span>•</span>
          <span>{currentIndex + 1} of {photos.length}</span>
        </div>
      </div>
    </div>
  );
}