import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shuffle, AlertCircle, Home, RotateCcw } from 'lucide-react';
import { StudyContext } from '../context/StudyContext';
import { useFlashcards } from '../hooks/useFlashcards';
import { Flashcard } from '../components/Flashcard';
import { ProgressBar } from '../components/ProgressBar';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { StatusMessage } from '../components/StatusMessage';
import '../styles/pages.css';

export function Flashcards() {
  const { isLoading, error, handleRetry } = useContext(StudyContext);
  const navigate = useNavigate();

  const {
    cards,
    currentCard,
    currentIndex,
    isFlipped,
    setIsFlipped,
    totalCards,
    nextCard,
    prevCard,
    shuffle,
    markKnown,
    markDifficult,
    progressPercentage,
    reviewedCount
  } = useFlashcards();

  const handleReturnHome = () => {
    navigate('/');
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flashcards-page-container flex-center-vertical">
        <Loader type="spinner" message="Crafting interactive AI Flashcards..." />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flashcards-page-container flex-center-vertical">
        <StatusMessage 
          type={error.type} 
          message={error.message} 
          onRetry={handleRetry} 
        />
      </div>
    );
  }

  // 3. Empty State
  if (!cards || cards.length === 0) {
    return (
      <div className="flashcards-page-container flex-center-vertical">
        <EmptyState 
          title="No Flashcards Available"
          description="It looks like you haven't generated a study deck yet. Paste some notes on the home screen to let StudyBuddy build a customized study list."
          actionText="Create Deck Now"
          onAction={handleReturnHome}
        />
      </div>
    );
  }

  return (
    <div className="flashcards-page-container animate-fade-in">
      {/* Header Area */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title text-gradient">Flashcard Study Deck</h1>
          <p className="page-subtitle">Interactive cards to test your active recall. Click a card to reveal its answer.</p>
        </div>
        <button className="btn btn-secondary flex-center gap-1" onClick={handleReturnHome}>
          <Home size={16} />
          Return Home
        </button>
      </div>

      {/* Progress Track */}
      <div className="flashcard-progress-bar-wrapper glass-panel">
        <ProgressBar 
          value={progressPercentage} 
          type="linear" 
          label={`${reviewedCount} of ${totalCards} cards reviewed`} 
        />
      </div>

      {/* Flashcard Component */}
      <div className="active-card-viewport">
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(prev => !prev)}
          onMarkKnown={markKnown}
          onMarkDifficult={markDifficult}
        />
      </div>

      {/* Control Buttons */}
      <div className="flashcard-deck-controls glass-panel">
        <div className="controls-group-left">
          <button 
            className="btn btn-secondary flex-center gap-1" 
            onClick={shuffle}
            title="Shuffle study deck"
          >
            <Shuffle size={16} />
            Shuffle Deck
          </button>
        </div>

        <div className="controls-group-center">
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={prevCard} 
            disabled={currentIndex === 0}
            title="Previous card"
          >
            <ArrowLeft size={18} />
          </button>
          
          <span className="card-counter-badge">
            {currentIndex + 1} / {totalCards}
          </span>

          <button 
            className="btn btn-secondary btn-icon" 
            onClick={nextCard} 
            disabled={currentIndex === totalCards - 1}
            title="Next card"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="controls-group-right">
          <span className="keyboard-hint-badge">
            💡 Tap Card to Flip
          </span>
        </div>
      </div>
    </div>
  );
}
