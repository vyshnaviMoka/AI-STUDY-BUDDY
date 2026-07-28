import React from 'react';
import { HelpCircle, CheckCircle, RotateCw } from 'lucide-react';
import '../styles/components.css';

export function Flashcard({ card, isFlipped, onFlip, onMarkKnown, onMarkDifficult }) {
  if (!card) return null;

  const difficultyColor = {
    easy: 'text-success bg-success-glow',
    medium: 'text-warning bg-warning-glow',
    hard: 'text-danger bg-danger-glow'
  }[card.difficulty] || 'text-muted';

  return (
    <div className="flashcard-container">
      {/* 3D Flappable Card Wrapper */}
      <div 
        className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
        onClick={onFlip}
      >
        {/* Front Face */}
        <div className="flashcard-face flashcard-front glass-panel">
          <div className="card-face-header">
            <span className="card-face-badge">Front Face</span>
            <span className={`difficulty-badge ${difficultyColor}`}>
              {card.difficulty.toUpperCase()}
            </span>
          </div>
          
          <div className="card-face-body">
            <h2 className="card-question-text">{card.front}</h2>
          </div>

          <div className="card-face-footer">
            <span className="hint-click-to-flip">
              <RotateCw size={14} /> Click card to flip and view answer
            </span>
          </div>
        </div>

        {/* Back Face */}
        <div className="flashcard-face flashcard-back glass-panel">
          <div className="card-face-header">
            <span className="card-face-badge">Back Face</span>
            <span className="mastery-indicator">
              {card.known && <span className="text-success flex-center gap-1"><CheckCircle size={14} /> Mastered</span>}
              {card.flagged && <span className="text-danger flex-center gap-1"><HelpCircle size={14} /> Difficult</span>}
            </span>
          </div>

          <div className="card-face-body">
            <p className="card-answer-text">{card.back}</p>
          </div>

          <div className="card-face-footer" onClick={(e) => e.stopPropagation()}>
            <div className="card-feedback-actions">
              <button 
                className={`btn btn-secondary btn-sm ${card.flagged ? 'active-difficult' : ''}`}
                onClick={onMarkDifficult}
              >
                Mark Difficult
              </button>
              <button 
                className={`btn btn-primary btn-sm ${card.known ? 'active-known' : ''}`}
                onClick={onMarkKnown}
              >
                <CheckCircle size={16} /> Mark Known
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
