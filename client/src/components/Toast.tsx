import React from 'react';
import { useToast } from '../context/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col gap-2" 
      role="status" 
      aria-live="polite"
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-slate-800 text-slate-100 dark:bg-zinc-800 dark:text-zinc-100 px-4 py-3 rounded shadow-sm border border-slate-700 dark:border-zinc-700 text-sm font-medium transition-all duration-300 ease-in-out flex items-center justify-between min-w-[250px]"
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
