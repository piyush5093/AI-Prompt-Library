import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastItem: React.FC<{
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onRemove: (id: string) => void;
}> = ({ id, message, type, onRemove }) => {
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onRemove(id);
    }, 200); // Wait for slideOutRight animation to finish
  }, [id, onRemove]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      handleClose();
    }, 3000);
  }, [handleClose]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500/80" />,
    info: <Info className="w-5 h-5 text-blue-500/80" />,
  };

  return (
    <div
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      className={`bg-white text-zinc-900 dark:bg-[#131313] dark:text-zinc-50 px-4 py-3 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800/80 text-sm font-medium flex items-center gap-3 min-w-[250px] max-w-[350px] ${
        isClosing ? 'animate-[slideOutRight_0.2s_ease-in_forwards]' : 'animate-[slideIn_0.2s_ease-out_forwards]'
      }`}
      role="alert"
    >
      <div className="shrink-0">{icons[type]}</div>
      <div className="flex-1 leading-snug">{message}</div>
      <button 
        onClick={handleClose} 
        className="shrink-0 p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" 
      role="status" 
      aria-live="polite"
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onRemove={removeToast}
          />
        </div>
      ))}
    </div>
  );
};
