import React, { useState, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

export default function VirtualGrid({ photos, onImageClick }) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth - 40,
    height: window.innerHeight - 180,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth - 40,
        height: window.innerHeight - 180,
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute column count based on available screen width (e.g., 220px per tile)
  const columnWidth = 220;
  const rowHeight = 220;
  const columnCount = Math.max(1, Math.floor(windowDimensions.width / columnWidth));
  const rowCount = Math.ceil(photos.length / columnCount);

  // Cell renderer for react-window grid
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const itemIndex = rowIndex * columnCount + columnIndex;
    if (itemIndex >= photos.length) return null;

    const photo = photos[itemIndex];

    return (
      <div style={style} className="grid-cell-wrapper" onClick={() => onImageClick(itemIndex)}>
        <div className="grid-item">
          <img 
            src={photo.url} 
            alt={photo.name} 
            loading="lazy" 
            draggable="false"
          />
          <div className="overlay-info">
            <span className="file-name">{photo.name}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={windowDimensions.width / columnCount}
      height={windowDimensions.height}
      rowCount={rowCount}
      rowHeight={rowHeight}
      width={windowDimensions.width}
      className="virtual-grid"
    >
      {Cell}
    </Grid>
  );
}