import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePrompts } from '../context/PromptContext';
import { useToast } from '../context/ToastContext';
import { exportPrompts } from '../utils/exportPrompts';
import { importPrompts } from '../utils/importPrompts';
import { Download, Upload, Menu } from 'lucide-react';

interface NavbarProps {
  onNewClick: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewClick, onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { prompts, bulkAddPrompts } = usePrompts();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (prompts.length === 0) {
      showToast('No prompts to export', 'error');
      return;
    }
    exportPrompts(prompts);
    showToast('Export successful', 'success');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input so same file can be selected again
      fileInputRef.current.focus(); // Wait, let's make sure it just resets
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const validPrompts = await importPrompts(file);
      await bulkAddPrompts(validPrompts);
      showToast(`Imported ${validPrompts.length} prompts successfully`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Import failed', 'error');
    }
  };

  return (
    <header className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0f0f0f] py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 -ml-1 text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 md:hidden"
          aria-label="Toggle sidebar filters"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          AI Prompt Library
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 p-2 rounded border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 transition-colors text-sm font-medium"
          title="Export prompts to JSON"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 p-2 rounded border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 transition-colors text-sm font-medium"
          title="Import prompts from JSON"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Import</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          className="hidden" 
        />

        <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 mx-1"></div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 transition-colors text-sm font-medium"
        >
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <button 
          onClick={onNewClick}
          className="bg-slate-700 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors ml-2"
        >
          New Prompt
        </button>
      </div>
    </header>
  );
};
