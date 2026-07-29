import React, { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePrompts } from '../context/PromptContext';
import { useToast } from '../context/ToastContext';
import { exportPrompts } from '../utils/exportPrompts';
import { importPrompts } from '../utils/importPrompts';
import { Download, Upload, Menu, Moon, Sun, Plus } from 'lucide-react';

interface NavbarProps {
  onNewClick: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewClick, onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { prompts, bulkAddPrompts } = usePrompts();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    if (prompts.length === 0) {
      showToast('No prompts to export', 'error');
      return;
    }
    exportPrompts(prompts);
    showToast('Export successful', 'success');
  };

  const handleImportClick = () => {
    if (isImporting) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input so same file can be selected again
      fileInputRef.current.focus(); // Wait, let's make sure it just resets
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const validPrompts = await importPrompts(file);
      await bulkAddPrompts(validPrompts);
      showToast(`Imported ${validPrompts.length} prompts successfully`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Import failed', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#131313] py-4 px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 -ml-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 md:hidden transition-colors"
          aria-label="Toggle sidebar filters"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 group select-none">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded bg-amber-500 text-zinc-950 font-black text-sm sm:text-base shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_16px_rgba(245,158,11,0.5)] transition-all duration-300">
            AI
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 transition-colors">
            Prompt<span className="text-amber-500">Library</span>
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 p-2 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 transition-colors duration-150 text-sm font-medium"
          title="Export prompts to JSON"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className="flex items-center gap-2 p-2 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 transition-colors duration-150 text-sm font-medium disabled:opacity-50"
          title="Import prompts from JSON"
          aria-label={isImporting ? "Importing prompts..." : "Import prompts from JSON"}
        >
          {isImporting ? (
            <span className="w-4 h-4 border-2 border-zinc-700 dark:border-zinc-300 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isImporting ? 'Importing...' : 'Import'}</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          className="hidden" 
        />

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800/80 mx-1"></div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 transition-colors duration-150 text-sm font-medium flex items-center justify-center"
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <button 
          onClick={onNewClick}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-3 sm:px-4 rounded text-sm transition-colors duration-150 ml-1 sm:ml-2 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">New Prompt</span>
        </button>
      </div>
    </header>
  );
};
