import React from 'react';
import { WifiOff, ShieldAlert, Timer, DatabaseZap, RefreshCw } from 'lucide-react';
import '../styles/components.css';

export function StatusMessage({ type, message, onRetry }) {
  const getErrorDetails = () => {
    switch (type) {
      case 'network':
        return {
          title: "Network Connection Failed",
          description: message || "Could not connect to the study server. Please check your internet connection and try again.",
          icon: <WifiOff className="status-icon text-danger" size={40} />,
          badgeColor: 'badge-danger'
        };
      case 'timeout':
        return {
          title: "Service Timeout",
          description: message || "The request timed out. Our AI models might be undergoing high traffic. Please retry.",
          icon: <Timer className="status-icon text-warning" size={40} />,
          badgeColor: 'badge-warning'
        };
      case 'json_parse':
        return {
          title: "Invalid response content",
          description: message || "The server returned data that could not be parsed as standard JSON. This is common when LLMs output Markdown wrapper symbols.",
          icon: <ShieldAlert className="status-icon text-purple" size={40} />,
          badgeColor: 'badge-purple'
        };
      case 'json_validation':
        return {
          title: "Data structure mismatch",
          description: message || "The response layout did not match our study card schema definition. (Missing mandatory 'front' or 'back' text blocks).",
          icon: <DatabaseZap className="status-icon text-pink" size={40} />,
          badgeColor: 'badge-pink'
        };
      default:
        return {
          title: "Unexpected Error Occurred",
          description: message || "An unexpected error occurred during processing. Please try again or check your inputs.",
          icon: <ShieldAlert className="status-icon text-danger" size={40} />,
          badgeColor: 'badge-danger'
        };
    }
  };

  const details = getErrorDetails();

  return (
    <div className="status-message-card glass-panel animate-slide-up">
      <div className="status-header">
        <div className={`status-badge-wrapper ${details.badgeColor}`}>
          {details.icon}
        </div>
        <div className="status-meta">
          <span className="status-system-label">System Diagnostics</span>
          <h3 className="status-title">{details.title}</h3>
        </div>
      </div>
      <p className="status-description">{details.description}</p>
      
      <div className="status-actions">
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            <RefreshCw size={18} className="spin-on-hover" />
            Retry Request
          </button>
        )}
      </div>
    </div>
  );
}
