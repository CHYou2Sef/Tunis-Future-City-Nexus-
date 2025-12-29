
import React, { useEffect, useState } from 'react';
import { EmergencyService } from '../services/mockBackend';
import { EmergencyAlert } from '../types';
import { ShieldAlert, Flame, Ambulance, Siren, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const EmergencyView: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const { t } = useApp();
  
  useEffect(() => {
    const fetch = async () => {
      const data = await EmergencyService.getActiveAlerts();
      setAlerts(data);
    };
    
    fetch();
    const interval = setInterval(fetch, 5000); 
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'FIRE': return <Flame className="w-6 h-6 text-orange-500" />;
      case 'MEDICAL': return <Ambulance className="w-6 h-6 text-red-500" />;
      case 'POLICE': return <Siren className="w-6 h-6 text-blue-500" />;
      default: return <ShieldAlert className="w-6 h-6 text-slate-500" />;
    }
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'CRITICAL': return 'bg-red-500 shadow-red-200 dark:shadow-none';
      case 'HIGH': return 'bg-orange-500 shadow-orange-200 dark:shadow-none';
      case 'MEDIUM': return 'bg-yellow-500 shadow-yellow-200 dark:shadow-none';
      default: return 'bg-blue-500 shadow-blue-200 dark:shadow-none';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.emergency_title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t.emergency_subtitle}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Live Connection Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.active_incidents}</h3>
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start group hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <div className={`p-3 rounded-full bg-slate-50 dark:bg-slate-700 mr-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors`}>
                {getIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">{alert.type} Alert</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center mt-1">
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 mr-2">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      {alert.location}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-sm">
                  {alert.description}
                </p>
                <div className="mt-4 flex space-x-3">
                    <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 uppercase tracking-wide">{t.dispatch_units}</button>
                    <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 uppercase tracking-wide">{t.view_camera}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-slate-900 dark:bg-black text-white p-6 rounded-xl shadow-lg border border-slate-800">
            <h3 className="font-bold text-lg mb-4">{t.quick_actions}</h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 mr-2" /> {t.report_incident}
              </button>
              <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors flex items-center justify-center">
                <Siren className="w-5 h-5 mr-2" /> {t.broadcast_warning}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700">
               <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">{t.system_status}</h4>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span>gRPC Server</span>
                   <span className="flex items-center text-green-400"><CheckCircle2 className="w-3 h-3 mr-1"/> Online</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span>Dispatch AI</span>
                   <span className="flex items-center text-green-400"><CheckCircle2 className="w-3 h-3 mr-1"/> Ready</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span>Camera Network</span>
                   <span className="flex items-center text-yellow-400"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-2"/> 98% Up</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
