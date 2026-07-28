import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Cpu, AlertTriangle, Play, HelpCircle } from 'lucide-react';
import { StudyContext } from '../context/StudyContext';
import '../styles/pages.css';

export function Home() {
  const {
    notes,
    setNotes,
    subject,
    setSubject,
    difficulty,
    setDifficulty,
    cardCount,
    setCardCount,
    simulateMode,
    setSimulateMode,
    isLoading,
    generateDeck
  } = useContext(StudyContext);

  const navigate = useNavigate();
  const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    await generateDeck();
    
    // Redirect to flashcards only if no error occurred in success/empty simulations
    if (simulateMode === 'success' || simulateMode === 'empty_response') {
      navigate('/flashcards');
    } else {
      // For testing error screens, navigate to flashcards page as well to let them see the error container
      navigate('/flashcards');
    }
  };

  const getTopicSuggestion = (topic) => {
    switch (topic) {
      case 'science':
        return "Photosynthesis, Cellular Respiration, CRISPR gene editing, Entropy and thermodynamics...";
      case 'history':
        return "The French Revolution of 1789, Causes of World War I, The Fall of the Roman Empire...";
      case 'programming':
        return "JavaScript Closures, Big O Complexity, React Lifecycle hooks, RESTful API conventions...";
      case 'literature':
        return "Homer's Odyssey, Themes in George Orwell's 1984, Harper Lee's character arcs...";
      default:
        return "Paste your notes or write details here...";
    }
  };

  return (
    <div className="home-page-container animate-fade-in">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="hero-badge animate-float">
          <Brain className="hero-badge-icon" size={14} />
          <span>Supercharged Study Platform</span>
        </div>
        <h1 className="hero-main-title">
          Elevate Your Learning with <br />
          <span className="text-gradient">AI Study Assistant</span>
        </h1>
        <p className="hero-subtitle">
          Transform raw notes, lecture slides, or complex topics into customized 
          interactive flashcard decks and practice tests instantly.
        </p>
      </section>

      {/* Main Form Input Panel */}
      <div className="home-form-card glass-panel">
        <form onSubmit={handleSubmit}>
          {/* Notes Input Area */}
          <div className="form-group">
            <div className="textarea-header">
              <label htmlFor="notes-textarea" className="form-label">
                Study Material / Notes Source
              </label>
              <span className="char-counter">{notes.length} characters</span>
            </div>
            <textarea
              id="notes-textarea"
              className="form-textarea home-notes-textarea"
              placeholder={getTopicSuggestion(subject)}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              required
            ></textarea>
          </div>

          {/* Quick Select Grid */}
          <div className="study-config-grid">
            {/* Subject Selector */}
            <div className="form-group">
              <label htmlFor="subject-select" className="form-label">Subject Domain</label>
              <select
                id="subject-select"
                className="form-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="science">🧬 Biological Science</option>
                <option value="history">📜 World History</option>
                <option value="programming">💻 Computer Programming</option>
                <option value="literature">📚 English Literature</option>
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="form-group">
              <label htmlFor="difficulty-select" className="form-label">Target Difficulty</label>
              <select
                id="difficulty-select"
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy (Fundamentals)</option>
                <option value="medium">Medium (Application)</option>
                <option value="hard">Hard (Conceptual)</option>
              </select>
            </div>

            {/* Card Count Selector */}
            <div className="form-group slider-group">
              <div className="slider-label-row">
                <label className="form-label">Flashcard Deck size</label>
                <span className="slider-value-badge">{cardCount} Cards</span>
              </div>
              <input
                type="range"
                className="card-count-slider"
                min={3}
                max={10}
                value={cardCount}
                onChange={(e) => setCardCount(parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="form-action-row">
            <button 
              type="submit" 
              className="btn btn-primary btn-generate-deck"
              disabled={isLoading || !notes.trim()}
            >
              {isLoading ? (
                <>
                  <div className="btn-spinner"></div>
                  Synthesizing Deck...
                </>
              ) : (
                <>
                  <Play size={18} fill="white" />
                  Generate Study Materials
                </>
              )}
            </button>
          </div>
        </form>

        {/* Developer / Assigner Tools Toggle */}
        <div className="developer-diagnostics-toggle">
          <button 
            type="button"
            className="btn-link-toggle"
            onClick={() => setShowDeveloperPanel(prev => !prev)}
          >
            <Cpu size={14} /> 
            {showDeveloperPanel ? "Hide Internship Review Panel" : "Show Internship Review Panel"}
          </button>
        </div>

        {/* Developer Control Console */}
        {showDeveloperPanel && (
          <div className="developer-glass-panel animate-slide-up">
            <div className="dev-panel-header">
              <AlertTriangle className="text-warning" size={16} />
              <h4>Review Diagnostics Panel</h4>
            </div>
            <p className="dev-panel-desc">
              Select simulation parameters below to evaluate specific error boundaries and data structures.
            </p>
            <div className="dev-grid">
              <div className="form-group">
                <label htmlFor="simulate-select" className="form-label">Simulation Mode</label>
                <select
                  id="simulate-select"
                  className="form-select dev-select"
                  value={simulateMode}
                  onChange={(e) => setSimulateMode(e.target.value)}
                >
                  <option value="success">Success (Standard mock load)</option>
                  <option value="network_error">Network Offline Error</option>
                  <option value="timeout">Request Timeout (6.0s duration)</option>
                  <option value="invalid_json">Malformed JSON Response</option>
                  <option value="wrong_structure">JSON Validation Failure</option>
                  <option value="empty_response">Empty JSON Array</option>
                </select>
              </div>
              <div className="dev-guidelines-box">
                <h5>Evaluation Guidelines:</h5>
                <ul>
                  <li><strong>Network Error</strong>: Simulates server offline, triggers WifiOff screen.</li>
                  <li><strong>Timeout</strong>: Exceeds threshold, triggers Timer retry card.</li>
                  <li><strong>Malformed JSON</strong>: Returns corrupted characters, caught by safeJsonParse.</li>
                  <li><strong>JSON Validation</strong>: Missing schema attributes, fails normalizer checks safely.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
