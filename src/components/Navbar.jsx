import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Menu, X, Sun, Moon, LayoutDashboard, Layers, GraduationCap, Home } from 'lucide-react';
import { StudyContext } from '../context/StudyContext';
import '../styles/layout.css';

export function Navbar() {
  const { theme, toggleTheme } = useContext(StudyContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header glass-panel">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-icon-glow">
            <Sparkles className="logo-icon" size={20} />
          </div>
          <span className="logo-text">
            Study<span className="text-gradient">Buddy</span>
          </span>
          <span className="logo-badge">AI</span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} end>
            <Home size={16} /> Home
          </NavLink>
          <NavLink to="/flashcards" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
            <Layers size={16} /> Flashcards
          </NavLink>
          <NavLink to="/quiz" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
            <GraduationCap size={16} /> Quiz
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
        </nav>

        {/* Controls (Theme Switcher, Mobile Toggle) */}
        <div className="navbar-controls">
          <button 
            className="btn-theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active-link' : ''}`}
            onClick={closeMobileMenu}
            end
          >
            <Home size={20} /> Home
          </NavLink>
          <NavLink 
            to="/flashcards" 
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active-link' : ''}`}
            onClick={closeMobileMenu}
          >
            <Layers size={20} /> Flashcards
          </NavLink>
          <NavLink 
            to="/quiz" 
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active-link' : ''}`}
            onClick={closeMobileMenu}
          >
            <GraduationCap size={20} /> Quiz
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active-link' : ''}`}
            onClick={closeMobileMenu}
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
