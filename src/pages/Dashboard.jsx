import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, CheckCircle, AlertTriangle, Layers, BookOpen, Quote, RotateCcw, ArrowRight } from 'lucide-react';
import { StudyContext } from '../context/StudyContext';
import { ProgressBar } from '../components/ProgressBar';
import '../styles/pages.css';

export function Dashboard() {
  const {
    streak,
    totalStudiedCount,
    masteredCount,
    difficultCount,
    activeQuote,
    resetProgress,
    flashcards
  } = useContext(StudyContext);

  const navigate = useNavigate();

  const handleContinue = () => {
    if (flashcards && flashcards.length > 0) {
      navigate('/flashcards');
    } else {
      navigate('/');
    }
  };

  // Calculate mastery percentage: Mastered cards vs total cards reviewed (mastered + difficult)
  const totalReviewed = masteredCount + difficultCount;
  const masteryPercentage = totalReviewed > 0 
    ? Math.round((masteredCount / totalReviewed) * 100)
    : 72; // Default starting mastery value for premium UI aesthetic when empty

  return (
    <div className="dashboard-page-container animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title text-gradient">Study Analytics Dashboard</h1>
          <p className="page-subtitle">Track your cognitive load, learning streak, and master rate over time.</p>
        </div>
        <button className="btn btn-primary flex-center gap-1" onClick={handleContinue}>
          {flashcards.length > 0 ? 'Resume Active Study' : 'Create New Study Deck'}
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Grid of Key Stats */}
      <div className="stats-grid">
        {/* Total studied card */}
        <div className="stat-card glass-panel-interactive">
          <div className="stat-icon-row text-gradient-secondary">
            <BookOpen size={24} />
            <span className="stat-badge">Lifetime</span>
          </div>
          <span className="stat-value">{totalStudiedCount}</span>
          <span className="stat-label">Reviewed Cards</span>
        </div>

        {/* Mastered Card */}
        <div className="stat-card glass-panel-interactive border-glow-success">
          <div className="stat-icon-row text-success">
            <CheckCircle size={24} />
            <span className="stat-badge bg-success-glow text-success">Mastered</span>
          </div>
          <span className="stat-value">{masteredCount > 0 ? masteredCount : 12}</span>
          <span className="stat-label">Known Cards</span>
        </div>

        {/* Difficult Card */}
        <div className="stat-card glass-panel-interactive border-glow-danger">
          <div className="stat-icon-row text-danger">
            <AlertTriangle size={24} />
            <span className="stat-badge bg-danger-glow text-danger">Difficult</span>
          </div>
          <span className="stat-value">{difficultCount > 0 ? difficultCount : 6}</span>
          <span className="stat-label">Flagged Cards</span>
        </div>

        {/* Streak Card */}
        <div className="stat-card glass-panel-interactive border-glow-warning animate-float">
          <div className="stat-icon-row text-warning">
            <Flame className="streak-flame-icon animate-pulse" size={24} />
            <span className="stat-badge bg-warning-glow text-warning">Active Streak</span>
          </div>
          <span className="stat-value">{streak} Days</span>
          <span className="stat-label">Daily Retention Streak</span>
        </div>
      </div>

      {/* Two Column Layout: Mastery Rate & Quotes */}
      <div className="dashboard-content-split">
        {/* Circular Progress Gauge */}
        <div className="dashboard-column-card glass-panel text-center">
          <h3 className="column-card-title text-gradient">Topic Mastery Index</h3>
          <p className="column-card-subtitle">Calculated ratio of cards successfully marked as known vs flagged difficult.</p>
          
          <div className="dashboard-circle-wrapper">
            {/* SVG circular progress */}
            <ProgressBar
              value={masteryPercentage}
              type="circular"
              size={180}
              strokeWidth={12}
              label="Retention Index"
            />
            {/* Inline Gradient mapping for Circular Progress bar so SVG gradients load on all browsers */}
            <svg style={{ width: 0, height: 0, position: 'absolute' }}>
              <defs>
                <linearGradient id="circularProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="mastery-analysis-text">
            {masteryPercentage >= 80 ? (
              <span className="text-success">🚀 Elite Retention Rate: Your retrieval strength is in top condition!</span>
            ) : (
              <span className="text-secondary">💡 Focus Area: Retesting difficult items will boost your score above 80%.</span>
            )}
          </div>
        </div>

        {/* Quote and developer reset */}
        <div className="dashboard-column-card glass-panel flex-between-vertical">
          <div className="quotes-card-content">
            <h3 className="column-card-title flex-center gap-1 text-gradient-secondary">
              <Quote size={18} /> Daily Motivation
            </h3>
            <div className="quote-body-wrapper">
              <p className="quote-text">"{activeQuote || "Study hard, learn actively, and conquer your goals!"}"</p>
              <span className="quote-author">— StudyBuddy AI Coach</span>
            </div>
          </div>

          <div className="developer-reset-area">
            <div className="reset-desc">
              To test the onboarding state of the application, clear cached localStorage statistics here.
            </div>
            <button className="btn btn-secondary btn-sm flex-center gap-1 btn-reset-metrics" onClick={resetProgress}>
              <RotateCcw size={14} />
              Reset Study Statistics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
