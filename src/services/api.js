import { safeJsonParse } from '../utils/parser';
import { validateFlashcards, validateQuiz } from '../utils/validator';

// Standard mock data for different subjects to simulate real AI outputs
const MOCK_DATA_POOL = {
  science: {
    flashcards: [
      { front: "What is the mitochondria?", back: "The powerhouse of the cell, responsible for producing ATP.", difficulty: "easy" },
      { front: "Define photosynthesis.", back: "The process by which green plants use sunlight to synthesize nutrients from CO2 and water.", difficulty: "medium" },
      { front: "What is CRISPR-Cas9?", back: "A unique technology that enables geneticists and medical researchers to edit parts of the genome.", difficulty: "hard" },
      { front: "What is entropy?", back: "A thermodynamic quantity representing the unavailability of a system's thermal energy for conversion into mechanical work.", difficulty: "hard" },
      { front: "What is DNA replication?", back: "The biological process of producing two identical replicas of DNA from one original DNA molecule.", difficulty: "medium" },
      { front: "What is the speed of light?", back: "Approximately 299,792 kilometers per second (186,282 miles per second).", difficulty: "easy" }
    ],
    quiz: [
      {
        question: "Which organelle is primary responsible for cellular respiration?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
        correctAnswerIndex: 2,
        explanation: "Mitochondria are known as the powerhouses of the cell. They generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
      },
      {
        question: "What is the main byproduct of photosynthesis released into the atmosphere?",
        options: ["Carbon Dioxide", "Oxygen", "Glucose", "Nitrogen"],
        correctAnswerIndex: 1,
        explanation: "Plants absorb carbon dioxide and water, and convert them into glucose and oxygen using light energy. Oxygen is released as a byproduct."
      },
      {
        question: "Which of the following describes a covalent bond?",
        options: ["Transfer of electrons", "Sharing of electron pairs", "Electrostatic attraction between ions", "Hydrogen bonding"],
        correctAnswerIndex: 1,
        explanation: "A covalent bond involves the sharing of electron pairs between atoms, enabling them to gain stability in their outer shells."
      }
    ]
  },
  history: {
    flashcards: [
      { front: "When did World War I start?", back: "July 28, 1914, following the assassination of Archduke Franz Ferdinand.", difficulty: "easy" },
      { front: "Who was the first Emperor of Rome?", back: "Augustus Caesar, who ruled from 27 BC until his death in AD 14.", difficulty: "medium" },
      { front: "What was the Magna Carta?", back: "A charter of rights agreed to by King John of England in 1215, establishing that everyone is subject to the law.", difficulty: "hard" },
      { front: "When did the French Revolution begin?", back: "1789, with the storming of the Bastille on July 14.", difficulty: "medium" },
      { front: "Who was the main author of the US Declaration of Independence?", back: "Thomas Jefferson, drafted in 1776.", difficulty: "easy" }
    ],
    quiz: [
      {
        question: "In what year did the Berlin Wall fall, symbolizing the impending collapse of the Iron Curtain?",
        options: ["1985", "1989", "1991", "1993"],
        correctAnswerIndex: 1,
        explanation: "The Berlin Wall was opened on November 9, 1989, leading to the reunification of Germany and the collapse of communist regimes in Eastern Europe."
      },
      {
        question: "Who was the ancient Egyptian queen who aligned with Julius Caesar and Mark Antony?",
        options: ["Nefertiti", "Hatshepsut", "Cleopatra VII", "Sobekneferu"],
        correctAnswerIndex: 2,
        explanation: "Cleopatra VII Philopator actively influenced Roman politics and was the last active ruler of the Ptolemaic Kingdom of Egypt."
      }
    ]
  },
  programming: {
    flashcards: [
      { front: "What is a Closure in JavaScript?", back: "A function that has access to its outer function scope even after the outer function has returned.", difficulty: "hard" },
      { front: "What is the difference between let and var?", back: "var is function-scoped while let is block-scoped.", difficulty: "easy" },
      { front: "What is Big O Notation?", back: "A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity.", difficulty: "medium" },
      { front: "Define REST API.", back: "Representational State Transfer; an architectural style for designing networked applications using HTTP requests.", difficulty: "medium" },
      { front: "What is a React Hook?", back: "A special function that lets you use state and other React features without writing a class.", difficulty: "easy" }
    ],
    quiz: [
      {
        question: "Which of the following is a non-linear data structure?",
        options: ["Stack", "Queue", "Linked List", "Binary Tree"],
        correctAnswerIndex: 3,
        explanation: "Binary Trees are non-linear data structures because elements are not arranged sequentially; instead, they have a hierarchical relationship."
      },
      {
        question: "What does HTML stand for?",
        options: ["HighText Machine Language", "HyperText Markup Language", "HyperTabular Markup Language", "Hyperlink Text Management Language"],
        correctAnswerIndex: 1,
        explanation: "HTML stands for HyperText Markup Language, the standard markup language for creating web pages."
      },
      {
        question: "In React, what hook is used to perform side effects in functional components?",
        options: ["useState", "useContext", "useEffect", "useMemo"],
        correctAnswerIndex: 2,
        explanation: "The useEffect hook lets you perform side effects (such as fetching data, subscription, or manual DOM changes) in function components."
      }
    ]
  },
  literature: {
    flashcards: [
      { front: "Who wrote 'To Kill a Mockingbird'?", back: "Harper Lee, published in 1960.", difficulty: "easy" },
      { front: "What is an Onomatopoeia?", back: "A word that phonetically mimics or resembles the sound it describes (e.g. 'buzz', 'hiss').", difficulty: "medium" },
      { front: "Describe the theme of '1984' by George Orwell.", back: "Totalitarianism, mass surveillance, and repressive regimentation of persons and behaviors within society.", difficulty: "hard" },
      { front: "Who is the protagonist of Homer's Odyssey?", back: "Odysseus, the king of Ithaca, who travels home after the Trojan War.", difficulty: "medium" }
    ],
    quiz: [
      {
        question: "Which Shakespearean play features the line 'To be, or not to be'?",
        options: ["Macbeth", "Othello", "Hamlet", "King Lear"],
        correctAnswerIndex: 2,
        explanation: "This famous soliloquy is spoken by Prince Hamlet in Act 3, Scene 1 of Shakespeare's tragedy Hamlet."
      },
      {
        question: "What is the name of the whale in Herman Melville's classic novel?",
        options: ["Moby Dick", "Leviathan", "Shamu", "Monstro"],
        correctAnswerIndex: 0,
        explanation: "Moby Dick is the title character and the legendary white sperm whale pursued by Captain Ahab."
      }
    ]
  }
};

/**
 * Simulates a request to a backend AI API for generating study content.
 * 
 * Supports simulation parameters to trigger and test specific error states.
 * Connects to AbortController signals to simulate request cancellation.
 * 
 * @param {Object} params
 * @param {string} params.notes - Raw input notes
 * @param {string} params.subject - The selected subject (e.g., science, history)
 * @param {string} params.difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} params.count - Number of items to generate
 * @param {string} params.simulateMode - 'success' | 'network_error' | 'timeout' | 'invalid_json' | 'wrong_structure' | 'empty_response'
 * @param {AbortSignal} [params.signal] - AbortController signal for cancellation
 * 
 * @returns {Promise<{flashcards: Array, quiz: Array}>}
 */
export function simulateGenerateStudyContent({
  notes,
  subject = 'science',
  difficulty = 'medium',
  count = 5,
  simulateMode = 'success',
  signal
}) {
  return new Promise((resolve, reject) => {
    const delay = simulateMode === 'timeout' ? 6000 : 1500; // Timeouts trigger after 5 seconds in our settings

    const timeoutId = setTimeout(() => {
      // 1. Check if already aborted
      if (signal?.aborted) {
        return;
      }

      // 2. Handle Simulation Modes
      if (simulateMode === 'network_error') {
        reject(new Error("Network Error: Failed to connect to the AI service. Please check your internet connection."));
        return;
      }

      if (simulateMode === 'timeout') {
        reject(new Error("Timeout Error: The AI service took too long to respond. Request timed out after 5.0 seconds."));
        return;
      }

      if (simulateMode === 'invalid_json') {
        // Return a response that is clearly broken and not valid JSON
        reject(new Error("SyntaxError: Unexpected token < in JSON at position 0. Raw text returned: '<gateway-error>Service Unavailable</gateway-error>'"));
        return;
      }

      if (simulateMode === 'wrong_structure') {
        // Return JSON with wrong format (e.g., object instead of array or missing fields)
        reject(new Error("ValidationError: The AI response was parsed successfully, but did not match the expected study cards schema (missing 'front' or 'back' fields)."));
        return;
      }

      if (simulateMode === 'empty_response') {
        resolve({ flashcards: [], quiz: [] });
        return;
      }

      // 3. Success Mode - Select from mock pools or generate from notes
      const subjectPool = MOCK_DATA_POOL[subject] || MOCK_DATA_POOL.science;
      
      // Shuffle & Slice Flashcards
      let selectedFlashcards = [...subjectPool.flashcards]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

      // Adjust difficulty field of mock cards based on selection if user forced it
      selectedFlashcards = selectedFlashcards.map(card => ({
        ...card,
        difficulty
      }));

      // Shuffle & Slice Quizzes
      const selectedQuiz = [...subjectPool.quiz]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(count, subjectPool.quiz.length));

      // If user pasted custom notes, let's inject a custom card based on the notes to make it look active!
      if (notes && notes.trim().length > 10) {
        const truncatedNotes = notes.length > 40 ? notes.substring(0, 40) + '...' : notes;
        selectedFlashcards.unshift({
          front: `Custom Flashcard based on: "${truncatedNotes}"`,
          back: `Summary: ${notes.substring(0, 150)}${notes.length > 150 ? '...' : ''}`,
          difficulty: difficulty
        });
        if (selectedFlashcards.length > count) {
          selectedFlashcards.pop();
        }

        selectedQuiz.unshift({
          question: `Regarding the provided notes: "${truncatedNotes}", which of the following is correct?`,
          options: ["The notes contain valid study details", "The notes are completely irrelevant", "The notes are empty", "None of the above"],
          correctAnswerIndex: 0,
          explanation: `This question was automatically generated from your custom notes: "${truncatedNotes}"`
        });
      }

      // Return standard structure
      resolve({
        flashcards: selectedFlashcards,
        quiz: selectedQuiz
      });
    }, delay);

    // If the signal aborts, clear the timeout and reject the promise
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException("The operation was aborted.", "AbortError"));
      });
    }
  });
}
export async function generateStudyContent({
  notes,
  subject,
  difficulty,
  count,
  signal,
}) {
  const response = await fetch(
    "https://ai-study-buddy-b3ol.onrender.com/api/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
      body: JSON.stringify({
        notes,
        subject,
        difficulty,
        flashcardCount: count,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || JSON.stringify(result));
  }

  return result.data;
}