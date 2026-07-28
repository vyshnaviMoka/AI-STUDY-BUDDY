import React from 'react';
import '../styles/components.css';

export function ProgressBar({ value = 0, type = 'linear', size = 120, strokeWidth = 8, label }) {
  const percentage = Math.max(0, Math.min(100, value));

  if (type === 'circular') {
    const radius = size / 2 - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-progress-wrapper" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="circular-progress-svg">
          {/* Track Ring */}
          <circle
            className="circular-progress-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress Ring */}
          <circle
            className="circular-progress-bar"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>
        <div className="circular-progress-content">
          <span className="circular-progress-value">{percentage}%</span>
          {label && <span className="circular-progress-label">{label}</span>}
        </div>
      </div>
    );
  }

  // Default: Linear Bar
  return (
    <div className="linear-progress-container">
      <div className="linear-progress-meta">
        <span className="linear-progress-label">{label}</span>
        <span className="linear-progress-value">{percentage}% Completed</span>
      </div>
      <div className="linear-progress-track">
        <div 
          className="linear-progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
