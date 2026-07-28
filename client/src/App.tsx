import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PromptProvider } from './context/PromptContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ToastContainer } from './components/Toast';
import { PromptFormModal } from './components/PromptFormModal';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  return (
    <ThemeProvider>
      <ToastProvider>
        <PromptProvider>
          <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col font-sans transition-colors duration-200">
            <ToastContainer />
            <PromptFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialData={null} />
            <Navbar onNewClick={() => setIsFormOpen(true)} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                activeCategory={categoryFilter}
                onCategoryChange={setCategoryFilter}
                favoritesOnly={favoritesOnly}
                onFavoritesChange={setFavoritesOnly}
              />
              <Dashboard 
                categoryFilter={categoryFilter}
                favoritesOnly={favoritesOnly}
                onClearFilters={() => {
                  setCategoryFilter(null);
                  setFavoritesOnly(false);
                }}
              />
            </div>
          </div>
        </PromptProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
