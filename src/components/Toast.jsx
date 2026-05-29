import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// Helper to generate unique IDs (outside component)
let toastIdCounter = 0;
const generateToastId = () => ++toastIdCounter;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = generateToastId();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 400,
    }}>
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const bgColor = {
    success: 'rgba(43, 122, 104, 0.9)',
    error: 'rgba(231, 76, 60, 0.9)',
    info: 'rgba(52, 152, 219, 0.9)',
    warning: 'rgba(241, 196, 15, 0.9)',
  }[toast.type] || 'rgba(52, 152, 219, 0.9)';

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  }[toast.type] || Info;

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 16px',
      borderRadius: 8,
      background: bgColor,
      color: '#fff',
      fontSize: 13,
      fontFamily: "'Inter', sans-serif",
      animation: 'slideInFromRight 0.3s ease',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    }}>
      <Icon size={18} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
