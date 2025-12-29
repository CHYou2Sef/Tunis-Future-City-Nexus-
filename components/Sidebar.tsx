
import React from 'react';
import { ViewState } from '../App';
import { useApp } from '../contexts/AppContext';
import { 
  LayoutDashboard, 
  TrainFront, 
  Wind, 
  Siren, 
  GitMerge, 
  Hexagon,
  Database,
  Droplets,
  Moon,
  Sun,
  Languages,
  Info
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen }) => {
  const { t, theme, toggleTheme, language, setLanguage, setShowAbout } = useApp();

  const menuItems = [
    { id: ViewState.DASHBOARD, label: t.dashboard, icon: LayoutDashboard },
    { id: ViewState.MOBILITY, label: t.mobility, icon: TrainFront },
    { id: ViewState.AIR_QUALITY, label: t.air_quality, icon: Wind },
    { id: ViewState.RESOURCES, label: t.resources, icon: Droplets },
    { id: ViewState.EMERGENCY, label: t.emergency, icon: Siren },
    { id: ViewState.CITY_DATA, label: t.city_data, icon: Database },
    { id: ViewState.ORCHESTRATOR, label: t.orchestrator, icon: GitMerge },
  ];

  return (
    <aside className={`bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col shadow-xl z-20`}>
      <div className="h-16 flex items-center justify-center border-b border-slate-800 dark:border-slate-800 flex-shrink-0">
        <Hexagon className="text-red-500 w-8 h-8" />
        {isOpen && <span className="ml-3 font-bold text-xl tracking-tight">Tunis<span className="text-red-500">Future</span></span>}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-6 h-6 min-w-[24px]" />
              {isOpen && <span className="ml-3 font-medium whitespace-nowrap overflow-hidden text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Controls Section */}
      <div className="p-4 border-t border-slate-800 space-y-3 flex-shrink-0">
        {/* About Button */}
        <button 
           type="button"
           onClick={() => setShowAbout(true)}
           className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
           title="About Project"
        >
          <Info className="w-5 h-5" />
          {isOpen && <span className="ml-2 text-xs font-medium">About Project</span>}
        </button>

        {/* Language Toggle */}
        <button 
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Toggle Language"
        >
          <Languages className="w-5 h-5" />
          {isOpen && <span className="ml-2 text-xs font-medium">{language === 'en' ? 'Français' : 'English'}</span>}
        </button>

        {/* Theme Toggle */}
        <button 
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          {isOpen && <span className="ml-2 text-xs font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </button>

        <div className={`flex items-center pt-2 ${isOpen ? 'justify-start' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-white flex items-center justify-center font-bold text-xs text-slate-900 border-2 border-slate-700">
            TS
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Tunisia Smart</p>
              <p className="text-xs text-slate-500">City Operator</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
