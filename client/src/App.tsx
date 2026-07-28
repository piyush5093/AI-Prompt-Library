import { ThemeProvider } from './context/ThemeContext';
import { PromptProvider } from './context/PromptContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <PromptProvider>
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col font-sans transition-colors duration-200">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <Dashboard />
          </div>
        </div>
      </PromptProvider>
    </ThemeProvider>
  );
}

export default App;
