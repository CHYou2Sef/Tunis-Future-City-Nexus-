
import React, { useState } from 'react';
import { Menu, Bell, Search, Settings, Wifi, WifiOff, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ViewState } from '../App';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
  onNavigate: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ title, toggleSidebar, onNavigate }) => {
  const { t, isBackendOnline } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 mr-4 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize transition-all">{title}</h1>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Backend Status Indicator - Hide text on smaller screens to prevent overlap */}
        <div className={`hidden md:flex items-center px-3 py-1 rounded-full text-xs font-bold border ${isBackendOnline ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'} whitespace-nowrap transition-colors`}>
          {isBackendOnline ? <Wifi className="w-3 h-3 mr-1.5" /> : <WifiOff className="w-3 h-3 mr-1.5" />}
          <span className="hidden lg:inline">{isBackendOnline ? t.backend_online : t.backend_offline}</span>
          <span className="lg:hidden">{isBackendOnline ? "Online" : "Offline"}</span>
        </div>

        <div className="hidden md:flex relative group">
          <input 
            type="text" 
            placeholder={t.search_placeholder}
            className="pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48 lg:w-64 text-slate-700 dark:text-slate-200 placeholder-slate-400 transition-all focus:w-72"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                 <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                   No new notifications
                 </div>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => onNavigate(ViewState.SETTINGS)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
