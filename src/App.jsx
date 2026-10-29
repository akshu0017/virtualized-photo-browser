import React, { useState, useEffect } from 'react';
import FolderSelector from './components/FolderSelector';
import VirtualGrid from './components/VirtualGrid';
import PhotoModal from './components/PhotoModal';
import './App.css';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [errorStats, setErrorStats] = useState({ skipped: 0, total: 0 });

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  const handleFolderSelected = async (fileList) => {
    setLoading(true);
    const validPhotos = [];
    let skippedCount = 0;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

    const files = Array.from(fileList);
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        skippedCount++;
        continue;
      }

      try {
        const objectUrl = URL.createObjectURL(file);
        // Load image dimensions metadata asynchronously
        const dimensions = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.onerror = () => resolve({ width: 0, height: 0 });
          img.src = objectUrl;
        });

        validPhotos.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type,
          dimensions: `${dimensions.width} x ${dimensions.height}`,
          url: objectUrl,
        });
      } catch (err) {
        skippedCount++;
      }
    }

    setPhotos(validPhotos);
    setErrorStats({ skipped: skippedCount, total: files.length });
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Virtualized Photo Browser</h1>
        <p>Handle 20,000+ local images smoothly with zero server uploads[cite: 1].</p>
      </header>

      {photos.length === 0 ? (
        <FolderSelector onFolderSelected={handleFolderSelected} loading={loading} />
      ) : (
        <div className="workspace">
          <div className="toolbar">
            <span>Loaded: <strong>{photos.length}</strong> photos</span>
            {errorStats.skipped > 0 && (
              <span className="warning-text">Skipped {errorStats.skipped} non-image files.</span>
            )}
            <button className="reset-btn" onClick={() => {
              photos.forEach(p => URL.revokeObjectURL(p.url));
              setPhotos([]);
            }}>
              Choose Another Folder
            </button>
          </div>

          <VirtualGrid 
            photos={photos} 
            onImageClick={(index) => setSelectedIndex(index)} 
          />
        </div>
      )}

      {selectedIndex !== null && (
        <PhotoModal 
          photos={photos} 
          currentIndex={selectedIndex} 
          onClose={() => setSelectedIndex(null)}
          onNavigate={(newIndex) => setSelectedIndex(newIndex)}
        />
      )}
    </div>
  );
}