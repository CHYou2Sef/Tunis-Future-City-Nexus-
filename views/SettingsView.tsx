
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Moon, Sun, Monitor, Languages, Database, Trash2, Info, ChevronRight, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, setShowAbout, t } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="grid gap-8">
        
        {/* Appearance & Language */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
              <Monitor className="w-5 h-5 mr-3 text-blue-500" />
              {t.settings_general}
            </h3>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-white mb-1">{t.settings_theme}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between Light and Dark mode interface.</p>
              </div>
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`p-2 rounded-md flex items-center transition-colors ${theme === 'light' ? 'bg-white shadow-sm text-yellow-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Sun className="w-5 h-5" />
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Light</span>
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`p-2 rounded-md flex items-center transition-colors ${theme === 'dark' ? 'bg-slate-700 shadow-sm text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Dark</span>
                </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-800 dark:text-white mb-1">{t.settings_lang}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Select your preferred system language.</p>
              </div>
              <div className="flex space-x-2">
                 <button 
                   onClick={() => setLanguage('en')}
                   className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${language === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                 >
                   English
                 </button>
                 <button 
                   onClick={() => setLanguage('fr')}
                   className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${language === 'fr' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                 >
                   Français
                 </button>
              </div>
            </div>

          </div>
        </section>

        {/* Data & System */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
              <Database className="w-5 h-5 mr-3 text-purple-500" />
              {t.settings_data}
            </h3>
          </div>
          <div className="p-6 space-y-4">
             <div className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 p-3 -mx-3 rounded-lg transition-colors cursor-pointer group" onClick={() => setShowAbout(true)}>
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg mr-4">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-800 dark:text-white">System Information</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Version 2.4.0-alpha • Build 20241014</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
             </div>

             <div className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 p-3 -mx-3 rounded-lg transition-colors cursor-pointer group">
                <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg mr-4">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-800 dark:text-white">Security & Permissions</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage API keys and access tokens</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
             </div>

             <div className="flex items-center justify-between p-3 -mx-3">
                 <div className="flex items-center">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg mr-4">
                        <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-800 dark:text-white">Clear Local Cache</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Remove stored preferences and temporary data.</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => alert("Cache cleared successfully.")}
                   className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
                 >
                    Clear Data
                 </button>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};
