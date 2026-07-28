import { useContext } from 'react';
import { StudyContext } from '../context/StudyContext';

export function useQuiz() {
  const context = useContext(StudyContext);

  if (!context) {
    throw new Error('useQuiz must be used within a StudyProvider');
  }

  const {
    quizQuestions,
    currentQuizIndex,
    setCurrentQuizIndex,
    userAnswers,
    setAnswer,
    quizScore,
    isQuizSubmitted,
    wrongAnswers,
    submitQuiz,
    retestWrongAnswers
  } = context;

  const currentQuestion = quizQuestions[currentQuizIndex] || null;

  const nextQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
    }
  };

  const selectOption = (optionIndex) => {
    if (!isQuizSubmitted) {
      setAnswer(currentQuizIndex, optionIndex);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercentage = quizQuestions.length > 0
    ? Math.round((answeredCount / quizQuestions.length) * 100)
    : 0;

  const allAnswered = Object.keys(userAnswers).length === quizQuestions.length;

  return {
    questions: quizQuestions,
    currentQuestion,
    currentIndex: currentQuizIndex,
    totalQuestions: quizQuestions.length,
    userAnswers,
    selectOption,
    score: quizScore,
    isSubmitted: isQuizSubmitted,
    wrongAnswers,
    submit: submitQuiz,
    retestWrong: retestWrongAnswers,
    nextQuestion,
    prevQuestion,
    progressPercentage,
    allAnswered
  };
}
