import React, { createContext, useState, useEffect, useRef } from 'react';
import {
  simulateGenerateStudyContent,
  generateStudyContent
} from '../services/api';
import { normalizeFlashcards, normalizeQuiz } from '../utils/validator';

export const StudyContext = createContext(null);

const MOTIVATIONAL_QUOTES = [
  "Learning is not spectator sport. Get active, test yourself!",
  "Small daily improvements over time lead to stunning results.",
  "Mistakes are proof that you are trying. Analyze wrong answers and grow.",
  "Consistency is the code of mastery. Keep your streak alive!",
  "The beautiful thing about learning is that no one can take it away from you."
];

export const StudyProvider = ({ children }) => {
  // --- Navigation & Theme State ---
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // --- Study Config Form State ---
  const [notes, setNotes] = useState('');
  const [subject, setSubject] = useState('science');
  const [difficulty, setDifficulty] = useState('medium');
  const [cardCount, setCardCount] = useState(5);
  const [simulateMode, setSimulateMode] = useState('success');

  // --- API / Loading / Error State ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // { type, message }
  const [lastRequestParams, setLastRequestParams] = useState(null);
  const abortControllerRef = useRef(null);

  // --- Flashcard State ---
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- Quiz State ---
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: optionIndex }
  const [quizScore, setQuizScore] = useState(null); // Final score object: { correct, total, percentage }
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]); // List of questions wrong: { question, options, correctIndex, selectedIndex, explanation }

  // --- Dashboard Persistent State ---
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved, 10) : 3; // Default 3 day streak for premium vibe
  });
  const [totalStudiedCount, setTotalStudiedCount] = useState(() => {
    const saved = localStorage.getItem('totalStudied');
    return saved ? parseInt(saved, 10) : 18;
  });
  
  // Custom collections for tracking across runs
  const [masteredIds, setMasteredIds] = useState(() => {
    const saved = localStorage.getItem('masteredIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [difficultIds, setDifficultIds] = useState(() => {
    const saved = localStorage.getItem('difficultIds');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeQuote, setActiveQuote] = useState('');

  // Sync theme to document body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync stats to localStorage
  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('totalStudied', totalStudiedCount.toString());
  }, [totalStudiedCount]);

  useEffect(() => {
    localStorage.setItem('masteredIds', JSON.stringify(masteredIds));
  }, [masteredIds]);

  useEffect(() => {
    localStorage.setItem('difficultIds', JSON.stringify(difficultIds));
  }, [difficultIds]);

  // Load random quote on mount
  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setActiveQuote(MOTIVATIONAL_QUOTES[randomIdx]);
  }, [flashcards]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // --- Generate Study Content API handler ---
  const generateDeck = async (retryParams = null) => {
    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Set up new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const params = retryParams || {
      notes,
      subject,
      difficulty,
      count: cardCount,
      simulateMode
    };

    setLastRequestParams(params);
    setIsLoading(true);
    setError(null);
    setFlashcards([]);
    setQuizQuestions([]);
    setIsQuizSubmitted(false);
    setQuizScore(null);
    setWrongAnswers([]);
    setCurrentCardIndex(0);
    setCurrentQuizIndex(0);
    setUserAnswers({});
    setIsFlipped(false);

    try {
      let response;

if (params.simulateMode === "success") {
  response = await generateStudyContent({
    notes: params.notes,
    subject: params.subject,
    difficulty: params.difficulty,
    count: params.count,
    signal: controller.signal,
  });
} else {
  response = await simulateGenerateStudyContent({
    notes: params.notes,
    subject: params.subject,
    difficulty: params.difficulty,
    count: params.count,
    simulateMode: params.simulateMode,
    signal: controller.signal,
  });
}

      // Abort check - ignore resolving state if controller says aborted
      if (controller.signal.aborted) {
        return;
      }

      // Check structure error simulation
      if (params.simulateMode === 'wrong_structure') {
        throw new Error("ValidationError: The AI response schema is missing mandatory properties: 'front' and 'back'.");
      }

      const cleanFlashcards = normalizeFlashcards(response.flashcards);
      const cleanQuiz = normalizeQuiz(response.quiz);

      setFlashcards(cleanFlashcards);
      setQuizQuestions(cleanQuiz);

      // Successfully generated: Increase streak & total count slightly
      if (cleanFlashcards.length > 0) {
        setStreak(prev => {
          // Increment streak if not generated today (mock simulation)
          return prev + 1;
        });
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request aborted successfully.');
        return; // Ignore state updates for aborted requests
      }
      console.error('API call failed: ', err);
      
      // Categorize errors for rich UI responses
      let errorType = 'general';
      if (err.message.includes('Network Error')) {
        errorType = 'network';
      } else if (err.message.includes('Timeout')) {
        errorType = 'timeout';
      } else if (err.message.includes('SyntaxError')) {
        errorType = 'json_parse';
      } else if (err.message.includes('ValidationError')) {
        errorType = 'json_validation';
      }

      setError({
        type: errorType,
        message: err.message
      });
    } finally {
      setIsLoading(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleRetry = () => {
    if (lastRequestParams) {
      generateDeck(lastRequestParams);
    }
  };

  // --- Flashcard Operations ---
  const markCardAsKnown = (cardId) => {
    setFlashcards(prev => prev.map(card => {
      if (card.id === cardId) {
        return { ...card, known: true, flagged: false };
      }
      return card;
    }));

    // Update global persistent collections
    if (!masteredIds.includes(cardId)) {
      setMasteredIds(prev => [...prev, cardId]);
    }
    setDifficultIds(prev => prev.filter(id => id !== cardId));
    setTotalStudiedCount(prev => prev + 1);
  };

  const markCardAsDifficult = (cardId) => {
    setFlashcards(prev => prev.map(card => {
      if (card.id === cardId) {
        return { ...card, flagged: true, known: false };
      }
      return card;
    }));

    // Update global persistent collections
    if (!difficultIds.includes(cardId)) {
      setDifficultIds(prev => [...prev, cardId]);
    }
    setMasteredIds(prev => prev.filter(id => id !== cardId));
    setTotalStudiedCount(prev => prev + 1);
  };

  const shuffleFlashcards = () => {
    setFlashcards(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // --- Quiz Operations ---
  const setAnswer = (questionIdx, optionIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIdx]: optionIdx
    }));
  };

  const submitQuiz = () => {
    if (quizQuestions.length === 0) return;

    let correct = 0;
    const wrong = [];

    quizQuestions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected === q.correctAnswerIndex) {
        correct++;
      } else {
        wrong.push({
          question: q.question,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          selectedIndex: selected !== undefined ? selected : -1,
          explanation: q.explanation
        });
      }
    });

    setQuizScore({
      correct,
      total: quizQuestions.length,
      percentage: Math.round((correct / quizQuestions.length) * 100)
    });
    setWrongAnswers(wrong);
    setIsQuizSubmitted(true);
  };

  const retestWrongAnswers = () => {
    if (wrongAnswers.length === 0) return;

    // Convert wrong answers structure back to standard quiz questions
    const retestQuestions = wrongAnswers.map((item, idx) => ({
      id: `retest-${Date.now()}-${idx}`,
      question: item.question,
      options: item.options,
      correctAnswerIndex: item.correctAnswerIndex,
      explanation: item.explanation
    }));

    setQuizQuestions(retestQuestions);
    setCurrentQuizIndex(0);
    setUserAnswers({});
    setQuizScore(null);
    setIsQuizSubmitted(false);
    setWrongAnswers([]);
  };

  const resetProgress = () => {
    setStreak(3);
    setTotalStudiedCount(18);
    setMasteredIds([]);
    setDifficultIds([]);
    localStorage.clear();
  };

  return (
    <StudyContext.Provider
      value={{
        theme,
        toggleTheme,
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
        error,
        flashcards,
        currentCardIndex,
        setCurrentCardIndex,
        isFlipped,
        setIsFlipped,
        shuffleFlashcards,
        markCardAsKnown,
        markCardAsDifficult,
        quizQuestions,
        currentQuizIndex,
        setCurrentQuizIndex,
        userAnswers,
        setUserAnswers,
        setAnswer,
        quizScore,
        isQuizSubmitted,
        wrongAnswers,
        submitQuiz,
        retestWrongAnswers,
        generateDeck,
        handleRetry,
        streak,
        totalStudiedCount,
        masteredCount: masteredIds.length,
        difficultCount: difficultIds.length,
        activeQuote,
        resetProgress
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};
