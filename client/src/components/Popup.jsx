import React from 'react';
import { X, AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import '../Dashboard.css';

const Popup = ({ 
  show, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  onConfirm, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  showConfirm = false 
}) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning': return <HelpCircle size={32} />;
      case 'error': return <AlertCircle size={32} />;
      case 'success': return <CheckCircle size={32} />;
      default: return <Info size={32} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card popup-confirm" onClick={e => e.stopPropagation()}>
        <X size={20} className="lucide-x" onClick={onClose} />
        
        <div className={`popup-icon ${type}`}>
          {getIcon()}
        </div>

        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>{message}</p>

        <div className="popup-actions">
          {showConfirm && (
            <button className="popup-btn popup-btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button 
            className={`popup-btn ${type === 'error' || type === 'warning' ? 'popup-btn-danger' : 'popup-btn-primary'}`} 
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
