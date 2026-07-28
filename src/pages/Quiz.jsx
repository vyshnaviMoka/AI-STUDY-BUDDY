import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { StudyContext } from '../context/StudyContext';
import { useQuiz } from '../hooks/useQuiz';
import { QuizCard } from '../components/QuizCard';
import { ProgressBar } from '../components/ProgressBar';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { StatusMessage } from '../components/StatusMessage';
import '../styles/pages.css';

export function Quiz() {
  const { isLoading, error, handleRetry } = useContext(StudyContext);
  const navigate = useNavigate();

  const {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    userAnswers,
    selectOption,
    score,
    isSubmitted,
    wrongAnswers,
    submit,
    retestWrong,
    nextQuestion,
    prevQuestion,
    progressPercentage,
    allAnswered
  } = useQuiz();

  const handleReturnHome = () => {
    navigate('/');
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="quiz-page-container flex-center-vertical">
        <Loader type="spinner" message="Synthesizing assessment questions..." />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="quiz-page-container flex-center-vertical">
        <StatusMessage 
          type={error.type} 
          message={error.message} 
          onRetry={handleRetry} 
        />
      </div>
    );
  }

  // 3. Empty State
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-page-container flex-center-vertical">
        <EmptyState 
          title="No Quiz Available"
          description="You haven't generated a study deck containing assessment files. Paste your notes on the home screen to build test questions."
          actionText="Create Quiz Now"
          onAction={handleReturnHome}
        />
      </div>
    );
  }

  // 4. Score / Post-Submit Screen
  if (isSubmitted && score) {
    const feedbackMessage = () => {
      if (score.percentage === 100) return "Mastery Achieved! Perfect Score!";
      if (score.percentage >= 80) return "Outstanding Work! You've mastered most of the concepts.";
      if (score.percentage >= 50) return "Good effort! Practice makes perfect.";
      return "Keep studying. Let's review the concepts and try again!";
    };

    return (
      <div className="quiz-page-container animate-fade-in">
        {/* Results Hero */}
        <div className="quiz-results-card glass-panel text-center">
          <div className="results-badge-row">
            <Award className="results-award-icon animate-float" size={40} />
          </div>
          
          <h2 className="results-title">{feedbackMessage()}</h2>
          <p className="results-subtitle">You got {score.correct} out of {score.total} questions correct.</p>

          <div className="results-indicators-row">
            {/* SVG Circular progress */}
            <ProgressBar 
              value={score.percentage} 
              type="circular" 
              size={140}
              strokeWidth={10}
              label="Quiz Score" 
            />
          </div>

          <div className="results-action-row">
            {wrongAnswers.length > 0 ? (
              <button className="btn btn-primary" onClick={retestWrong}>
                <RotateCcw size={18} />
                Retest Wrong Answers ({wrongAnswers.length})
              </button>
            ) : (
              <span className="perfect-score-badge">
                🎉 Perfect! You mastered all questions.
              </span>
            )}
            <button className="btn btn-secondary" onClick={handleReturnHome}>
              <Home size={16} />
              Return Home
            </button>
          </div>
        </div>

        {/* Wrong Answers Review */}
        {wrongAnswers.length > 0 && (
          <div className="wrong-answers-section animate-slide-up">
            <h3 className="section-title text-gradient">Review Weak Areas</h3>
            <p className="section-subtitle">Examine the items you got incorrect to improve your understanding.</p>
            
            <div className="wrong-answers-list">
              {wrongAnswers.map((item, idx) => (
                <div key={idx} className="wrong-answer-card glass-panel">
                  <h4 className="wrong-question-title">{idx + 1}. {item.question}</h4>
                  
                  <div className="wrong-selections-box">
                    <div className="choice-indicator incorrect">
                      <span className="choice-label">Your Pick:</span>
                      <span className="choice-text">
                        {item.selectedIndex !== -1 ? item.options[item.selectedIndex] : 'No answer selected'}
                      </span>
                    </div>
                    
                    <div className="choice-indicator correct">
                      <span className="choice-label">Correct Answer:</span>
                      <span className="choice-text">
                        {item.options[item.correctAnswerIndex]}
                      </span>
                    </div>
                  </div>

                  <div className="wrong-explanation-box">
                    <span className="explanation-bullet"><HelpCircle size={14} /> Concept Explanation:</span>
                    <p className="explanation-paragraph">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 5. Active Test Screen
  return (
    <div className="quiz-page-container animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title text-gradient">Active recall Practice Test</h1>
          <p className="page-subtitle">Test your retention of the generated topic materials.</p>
        </div>
        <div className="header-score-indicator">
          <span>Completed: <strong>{progressPercentage}%</strong></span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="quiz-progress-wrapper glass-panel">
        <ProgressBar 
          value={progressPercentage} 
          type="linear" 
          label="Assessment completion rate" 
        />
      </div>

      {/* Active Question Card */}
      <div className="active-quiz-card-viewport">
        <QuizCard
          question={currentQuestion}
          selectedIndex={userAnswers[currentIndex]}
          onSelectOption={selectOption}
          isSubmitted={false}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
        />
      </div>

      {/* Navigation Controller Bar */}
      <div className="quiz-navigation-bar glass-panel">
        <div className="nav-group-left">
          <button 
            className="btn btn-secondary flex-center gap-1"
            onClick={prevQuestion}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={16} />
            Previous
          </button>
        </div>

        {/* Quick Navigate Dots */}
        <div className="nav-dots-container">
          {questions.map((_, idx) => {
            const isCurrent = currentIndex === idx;
            const isAnswered = userAnswers[idx] !== undefined;
            return (
              <button
                key={idx}
                className={`nav-dot ${isCurrent ? 'dot-active' : ''} ${isAnswered ? 'dot-answered' : ''}`}
                onClick={() => setCurrentQuizIndex(idx)}
                aria-label={`Go to question ${idx + 1}`}
              />
            );
          })}
        </div>

        <div className="nav-group-right">
          {currentIndex === totalQuestions - 1 ? (
            <button 
              className={`btn ${allAnswered ? 'btn-primary' : 'btn-secondary'} btn-submit-quiz`}
              onClick={submit}
            >
              Submit Quiz
            </button>
          ) : (
            <button 
              className="btn btn-secondary flex-center gap-1"
              onClick={nextQuestion}
            >
              Next
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
