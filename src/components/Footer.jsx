import React, { useContext } from 'react';
import { Flame } from 'lucide-react';
import { StudyContext } from '../context/StudyContext';
import '../styles/layout.css';

export function Footer() {
  const { streak } = useContext(StudyContext);

  return (
    <footer className="app-footer glass-panel">
      <div className="footer-container">
        <div className="footer-meta">
          <span className="footer-logo">StudyBuddy</span>
          <span className="footer-copyright">
            © {new Date().getFullYear()} AI Study Platform. Built with React.
          </span>
        </div>

        <div className="footer-streak-indicator">
          <Flame className="streak-flame-icon animate-pulse" size={16} />
          <span>Active Streak: <strong>{streak} Days</strong></span>
        </div>

        <div className="footer-links">
          <a href="#about" className="footer-link">About</a>
          <a href="#privacy" className="footer-link">Privacy</a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-github-link"
            aria-label="GitHub Repository"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="18" 
              height="18" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide-github-svg"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
