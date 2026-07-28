import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Flashcards } from './pages/Flashcards';
import { Quiz } from './pages/Quiz';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <StudyProvider>
      <Router>
        <div className="app-container">
          {/* Global Glassmorphic Navigation */}
          <Navbar />
          
          {/* Main Router Content Wrapper */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          {/* Persistent Footer */}
          <Footer />
        </div>
      </Router>
    </StudyProvider>
  );
}
