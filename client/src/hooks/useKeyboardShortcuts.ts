import { useEffect } from 'react';

interface KeyboardShortcutProps {
  onNewPrompt?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = ({ onNewPrompt, onEscape }: KeyboardShortcutProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput = active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.tagName === 'SELECT' ||
        active.getAttribute('contenteditable') === 'true'
      );

      // Escape should close open dialogs/modals regardless of input focus
      if (e.key === 'Escape') {
        if (onEscape) {
          onEscape();
        }
        return;
      }

      // Ignore other shortcuts when user is actively typing in a text field
      if (isInput) return;

      // Alt + N
      if (e.altKey && e.key.toLowerCase() === 'n') {
        if (onNewPrompt) {
          e.preventDefault();
          onNewPrompt();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewPrompt, onEscape]);
};
