import React from 'react';
import '../styles/components.css';

export function Loader({ type = 'spinner', message = 'Generating study deck...' }) {
  if (type === 'skeleton') {
    return (
      <div className="skeleton-container animate-fade-in">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-card shimmer"></div>
        <div className="skeleton-grid">
          <div className="skeleton-item shimmer"></div>
          <div className="skeleton-item shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-container animate-fade-in">
      <div className="spinner-glow-ring">
        <div className="spinner-core"></div>
      </div>
      <p className="loader-message">{message}</p>
      <div className="loader-subtext">Optimizing knowledge tokens and structuring cards...</div>
    </div>
  );
}
