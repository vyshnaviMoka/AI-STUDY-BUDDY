import React from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import '../styles/components.css';

export function QuizCard({ 
  question, 
  selectedIndex, 
  onSelectOption, 
  isSubmitted,
  questionNumber,
  totalQuestions
}) {
  if (!question) return null;

  return (
    <div className="quiz-card-wrapper glass-panel animate-slide-up">
      <div className="quiz-card-header">
        <span className="quiz-question-number">Question {questionNumber} of {totalQuestions}</span>
        {isSubmitted && (
          <span className={`quiz-status-badge ${selectedIndex === question.correctAnswerIndex ? 'text-success bg-success-glow' : 'text-danger bg-danger-glow'}`}>
            {selectedIndex === question.correctAnswerIndex ? 'Correct' : 'Incorrect'}
          </span>
        )}
      </div>

      <h3 className="quiz-question-title">{question.question}</h3>

      <div className="quiz-options-list">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = question.correctAnswerIndex === idx;
          
          let optionClass = "quiz-option-btn";
          let optionIcon = null;

          if (isSubmitted) {
            if (isCorrect) {
              optionClass += " correct-choice";
              optionIcon = <Check size={18} className="text-success" />;
            } else if (isSelected) {
              optionClass += " incorrect-choice";
              optionIcon = <X size={18} className="text-danger" />;
            } else {
              optionClass += " disabled-choice";
            }
          } else if (isSelected) {
            optionClass += " selected-choice";
          }

          return (
            <button
              key={idx}
              className={optionClass}
              onClick={() => !isSubmitted && onSelectOption(idx)}
              disabled={isSubmitted}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
              <span className="option-text">{option}</span>
              {optionIcon && <span className="option-status-icon">{optionIcon}</span>}
            </button>
          );
        })}
      </div>

      {isSubmitted && question.explanation && (
        <div className="quiz-explanation-block glass-panel">
          <h4 className="explanation-title flex-center gap-1">
            <HelpCircle size={16} /> Explanation
          </h4>
          <p className="explanation-text">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
