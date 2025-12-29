
import React, { useEffect, useState } from 'react';
import { MobilityService } from '../services/mockBackend';
import { TransportLine } from '../types';
import { Bus, Train, Clock, Users, AlertTriangle, TramFront, WifiOff, MapPin, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const MobilityView: React.FC = () => {
  const [lines, setLines] = useState<TransportLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<string>('');
  const { t, isBackendOnline } = useApp();

  useEffect(() => {
    MobilityService.getAllLines().then(data => {
      setLines(data);
      setLoading(false);
      setLastFetchTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ON_TIME': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'DELAYED': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'DISRUPTED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'METRO': return <TramFront className="w-5 h-5" />;
      case 'TGM': 
      case 'TRAIN': return <Train className="w-5 h-5" />;
      default: return <Bus className="w-5 h-5" />;
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">{t.loading}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.mobility_title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t.mobility_subtitle}</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          {t.refresh}
        </button>
      </div>

      {/* Offline Indicator Banner */}
      {!isBackendOnline && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-center shadow-sm animate-fade-in-up">
            <WifiOff className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-amber-800 dark:text-amber-100 text-sm uppercase tracking-wide">Offline Mode</h3>
                <p className="text-amber-700 dark:text-amber-200 text-sm mt-0.5">
                    Backend unreachable. Displaying cached schedule data. Live tracking is paused.
                </p>
            </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lines.map((line) => (
          <div key={line.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col transition-transform hover:-translate-y-1 ${!isBackendOnline ? 'opacity-90 grayscale-[20%]' : ''}`}>
            
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${['METRO', 'TGM', 'TRAIN'].includes(line.type) ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                  {getIcon(line.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{line.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wider">{line.type}</span>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(line.status)}`}>
                {line.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex-1 space-y-5">
              
              {/* Main Info */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                       <Clock className="w-3.5 h-3.5 mr-1.5" /> Next Arrival
                    </div>
                    <span className="text-lg font-bold text-slate-800 dark:text-white">
                        {isBackendOnline ? line.nextArrival : `~${line.nextArrival}`}
                    </span>
                 </div>
                 
                 <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                       <Users className="w-3.5 h-3.5 mr-1.5" /> Crowding
                    </div>
                    <div className="flex items-center mt-1">
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mr-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${line.crowding > 80 ? 'bg-red-500' : line.crowding > 50 ? 'bg-amber-400' : 'bg-green-500'}`} 
                              style={{ width: `${line.crowding}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{line.crowding}%</span>
                    </div>
                 </div>
              </div>

              {/* Specific Line Alerts */}
              {line.lineAlerts && line.lineAlerts.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-3">
                   <h4 className="flex items-center text-xs font-bold text-red-700 dark:text-red-400 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Service Alert
                   </h4>
                   <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-300 space-y-0.5">
                      {line.lineAlerts.map((alert, idx) => (
                        <li key={idx}>{alert}</li>
                      ))}
                   </ul>
                </div>
              )}

              {/* Upcoming Departures */}
              {line.nextDepartures && line.nextDepartures.length > 0 && (
                  <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Upcoming Departures (30m)</p>
                      <div className="flex flex-wrap gap-2">
                          {line.nextDepartures.map((time, idx) => (
                              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-mono font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {time}
                              </span>
                          ))}
                      </div>
                  </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
               <button 
                  disabled={!line.hasLiveTracking}
                  className={`flex items-center text-sm font-semibold transition-colors ${line.hasLiveTracking ? 'text-blue-600 dark:text-blue-400 hover:text-blue-800' : 'text-slate-400 cursor-not-allowed'}`}
                >
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {line.hasLiveTracking ? 'View on Map' : 'No GPS Signal'}
               </button>

               <button className="flex items-center text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-colors">
                  Details <ChevronRight className="w-3 h-3 ml-1" />
               </button>
            </div>
            
            {!isBackendOnline && (
               <div className="mt-2 text-[10px] text-right text-slate-400 italic">
                   Updated: {lastFetchTime}
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
