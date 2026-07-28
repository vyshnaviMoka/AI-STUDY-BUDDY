import { useContext } from 'react';
import { StudyContext } from '../context/StudyContext';

export function useFlashcards() {
  const context = useContext(StudyContext);
  
  if (!context) {
    throw new Error('useFlashcards must be used within a StudyProvider');
  }

  const {
    flashcards,
    currentCardIndex,
    setCurrentCardIndex,
    isFlipped,
    setIsFlipped,
    shuffleFlashcards,
    markCardAsKnown,
    markCardAsDifficult
  } = context;

  const currentCard = flashcards[currentCardIndex] || null;

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const markKnown = () => {
    if (currentCard) {
      markCardAsKnown(currentCard.id);
      // Automatically advance to the next card if possible
      if (currentCardIndex < flashcards.length - 1) {
        setTimeout(nextCard, 300); // Small delay to let animations complete
      }
    }
  };

  const markDifficult = () => {
    if (currentCard) {
      markCardAsDifficult(currentCard.id);
      // Automatically advance to the next card if possible
      if (currentCardIndex < flashcards.length - 1) {
        setTimeout(nextCard, 300);
      }
    }
  };

  // Percent of the cards in the active generation that have been reviewed (marked known or difficult)
  const reviewedCount = flashcards.filter(c => c.known || c.flagged).length;
  const progressPercentage = flashcards.length > 0 
    ? Math.round((reviewedCount / flashcards.length) * 100) 
    : 0;

  return {
    cards: flashcards,
    currentCard,
    currentIndex: currentCardIndex,
    isFlipped,
    setIsFlipped,
    totalCards: flashcards.length,
    nextCard,
    prevCard,
    shuffle: shuffleFlashcards,
    markKnown,
    markDifficult,
    progressPercentage,
    reviewedCount
  };
}
