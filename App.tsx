
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { MobilityView } from './views/MobilityView';
import { AirQualityView } from './views/AirQualityView';
import { EmergencyView } from './views/EmergencyView';
import { OrchestratorView } from './views/OrchestratorView';
import { CityDataView } from './views/CityDataView';
import { ResourceView } from './views/ResourceView';
import { SettingsView } from './views/SettingsView';
import { AppProvider, useApp } from './contexts/AppContext';
import { X, Hexagon } from 'lucide-react';

// Enum for navigation
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MOBILITY = 'MOBILITY',
  AIR_QUALITY = 'AIR_QUALITY',
  EMERGENCY = 'EMERGENCY',
  ORCHESTRATOR = 'ORCHESTRATOR',
  CITY_DATA = 'CITY_DATA',
  RESOURCES = 'RESOURCES',
  SETTINGS = 'SETTINGS',
}

const AboutModal = () => {
  const { showAbout, setShowAbout } = useApp();
  if (!showAbout) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-fade-in-up border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-red-600 to-slate-900 p-6 text-white flex justify-between items-start">
          <div className="flex items-center">
             <Hexagon className="w-8 h-8 mr-3 text-red-400" />
             <div>
                <h2 className="text-xl font-bold">Tunis Future City Nexus</h2>
                <p className="text-xs text-red-200 uppercase tracking-widest font-semibold">Smart Tunisia 2030</p>
             </div>
          </div>
          <button onClick={() => setShowAbout(false)} className="text-white/80 hover:text-white"><X /></button>
        </div>
        <div className="p-6 text-slate-700 dark:text-slate-300 space-y-4">
          <p>
            This project represents a prototype for the <strong>Tunisian Smart City Infrastructure</strong>. 
            It integrates heterogeneous services (REST, SOAP, GraphQL, gRPC) into a unified dashboard.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-sm space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">Connected National Grids:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-green-600 dark:text-green-400">TRANSTU:</strong> Mobility & Transport data.</li>
              <li><strong className="text-blue-600 dark:text-blue-400">SONEDE:</strong> Water distribution telemetry.</li>
              <li><strong className="text-yellow-600 dark:text-yellow-400">STEG:</strong> Renewable energy grid monitoring.</li>
              <li><strong className="text-orange-600 dark:text-orange-400">ANPE:</strong> Environmental & Air quality sensors.</li>
            </ul>
          </div>
          <p className="text-xs text-slate-500 text-center pt-4">
            Developed for the Future City Development Plans improvement project.
          </p>
        </div>
      </div>
    </div>
  );
};

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setBackendOnline } = useApp();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Listen for backend status events from the service layer
  useEffect(() => {
    const handler = (e: CustomEvent) => setBackendOnline(e.detail.online);
    window.addEventListener('backend-status', handler as EventListener);
    return () => window.removeEventListener('backend-status', handler as EventListener);
  }, [setBackendOnline]);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <DashboardView onViewChange={setCurrentView} />;
      case ViewState.MOBILITY: return <MobilityView />;
      case ViewState.AIR_QUALITY: return <AirQualityView />;
      case ViewState.EMERGENCY: return <EmergencyView />;
      case ViewState.ORCHESTRATOR: return <OrchestratorView />;
      case ViewState.CITY_DATA: return <CityDataView />;
      case ViewState.RESOURCES: return <ResourceView />;
      case ViewState.SETTINGS: return <SettingsView />;
      default: return <DashboardView onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header 
          title={currentView === ViewState.SETTINGS ? 'System Settings' : currentView.replace('_', ' ')} 
          toggleSidebar={toggleSidebar} 
          onNavigate={(view) => setCurrentView(view)} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
        <AboutModal />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
