import React from 'react';
import { BookOpen } from 'lucide-react';
import '../styles/components.css';

export function EmptyState({ 
  title = "No study deck loaded", 
  description = "Paste some notes on the Home screen to generate custom AI study materials instantly.",
  actionText = "Get Started", 
  onAction 
}) {
  return (
    <div className="empty-state-card glass-panel animate-slide-up">
      <div className="empty-state-icon-wrapper">
        <BookOpen className="empty-state-icon" size={48} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
