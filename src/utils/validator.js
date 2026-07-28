/**
 * Validates the structure of a flashcards array response.
 * Checks for array type and required fields: 'front' and 'back' on each item.
 * 
 * @param {*} data - The parsed response to validate.
 * @returns {boolean} True if data is valid.
 */
export function validateFlashcards(data) {
  if (!Array.isArray(data)) {
    return false;
  }
  
  if (data.length === 0) {
    return false;
  }

  return data.every(item => {
    return (
      item &&
      typeof item === 'object' &&
      // Check for common field configurations, supporting 'front'/'back' or 'question'/'answer'
      (
        (typeof item.front === 'string' && typeof item.back === 'string') ||
        (typeof item.question === 'string' && typeof item.answer === 'string')
      )
    );
  });
}

/**
 * Validates the structure of a quiz response.
 * Checks for array of questions containing 'question', 'options' (at least 2), 'correctAnswerIndex'.
 * 
 * @param {*} data - The parsed response to validate.
 * @returns {boolean} True if data is valid.
 */
export function validateQuiz(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  if (data.length === 0) {
    return false;
  }

  return data.every(item => {
    return (
      item &&
      typeof item === 'object' &&
      typeof item.question === 'string' &&
      Array.isArray(item.options) &&
      item.options.length >= 2 &&
      item.options.every(opt => typeof opt === 'string') &&
      (
        // Supporting index-based or text-based correct answers
        (typeof item.correctAnswerIndex === 'number' && item.correctAnswerIndex >= 0 && item.correctAnswerIndex < item.options.length) ||
        (typeof item.correctAnswer === 'string') ||
        (typeof item.correctAnswer === 'number' && item.correctAnswer >= 0 && item.correctAnswer < item.options.length)
      )
    );
  });
}

/**
 * Normalizes flashcard data into a consistent layout: { id, front, back, difficulty, known }
 */
export function normalizeFlashcards(data) {
  if (!Array.isArray(data)) return [];
  return data.map((item, index) => {
    const front = item.front || item.question || '';
    const back = item.back || item.answer || '';
    return {
      id: item.id || `card-${Date.now()}-${index}`,
      front: front.trim(),
      back: back.trim(),
      difficulty: item.difficulty || 'medium', // 'easy', 'medium', 'hard'
      known: false,
      flagged: false, // for difficult
    };
  });
}

/**
 * Normalizes quiz data into a consistent layout: { id, question, options, correctAnswerIndex, explanation }
 */
export function normalizeQuiz(data) {
  if (!Array.isArray(data)) return [];
  return data.map((item, index) => {
    let correctIdx = 0;
    if (typeof item.correctAnswerIndex === 'number') {
      correctIdx = item.correctAnswerIndex;
    } else if (typeof item.correctAnswer === 'number') {
      correctIdx = item.correctAnswer;
    } else if (typeof item.correctAnswer === 'string') {
      const foundIdx = item.options.indexOf(item.correctAnswer);
      if (foundIdx !== -1) {
        correctIdx = foundIdx;
      }
    }
    
    return {
      id: item.id || `q-${Date.now()}-${index}`,
      question: item.question.trim(),
      options: item.options.map(opt => opt.trim()),
      correctAnswerIndex: correctIdx,
      explanation: item.explanation || 'Study hard to understand why this is the right answer!',
    };
  });
}
