import React from 'react';
import { FolderOpen, Loader2 } from 'lucide-react';

export default function FolderSelector({ onFolderSelected, loading }) {
  return (
    <div className="folder-selector">
      <div className="dropzone">
        <FolderOpen size={64} className="folder-icon" />
        <h2>Select a Local Image Folder</h2>
        <p>Your photos stay entirely client-side and are never uploaded to any server[cite: 1].</p>
        
        {loading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={24} />
            <span>Processing large directory structures...</span>
          </div>
        ) : (
          <label className="upload-btn">
            Browse Folder
            <input 
              type="file" 
              webkitdirectory="" 
              directory="" 
              multiple 
              onChange={(e) => e.target.files && onFolderSelected(e.target.files)} 
              style={{ display: 'none' }}
            />
          </label>
        )}
      </div>
    </div>
  );
}