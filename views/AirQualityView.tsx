
import React, { useState } from 'react';
import { AirQualityService } from '../services/mockBackend';
import { AirQualityData } from '../types';
import { CloudRain, Wind, Droplets, MapPin, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../contexts/AppContext';

export const AirQualityView: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Tunis Centre');
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useApp();

  const zones = ['Tunis Centre', 'Carthage (Coastal)', 'Ben Arous (Industrial)'];

  const fetchData = async (zone: string) => {
    setLoading(true);
    setSelectedZone(zone);
    const result = await AirQualityService.getQualityByZone(zone);
    setData(result);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData('Tunis Centre');
  }, []);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-500';
    if (aqi <= 100) return 'text-yellow-500';
    if (aqi <= 150) return 'text-orange-500';
    return 'text-red-500';
  };

  const getAqiBg = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.env_title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t.env_subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          {zones.map(zone => (
            <button
              key={zone}
              onClick={() => fetchData(zone)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedZone === zone ? 'bg-slate-900 text-white dark:bg-slate-700' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              {zone.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="h-64 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center">
            <div className="flex items-center text-slate-500 dark:text-slate-400 mb-6">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-semibold text-lg">{data.district}</span>
            </div>
            
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full opacity-10 ${getAqiBg(data.aqi)}`}></div>
              <div className="text-center">
                <span className={`block text-6xl font-bold ${getAqiColor(data.aqi)}`}>{data.aqi}</span>
                <span className="text-slate-400 font-medium uppercase tracking-wide text-sm">Tunis AQI</span>
              </div>
            </div>

            <div className="mt-6">
               <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-opacity-10 ${getAqiBg(data.aqi).replace('bg-', 'bg-').replace('500', '100')} ${getAqiColor(data.aqi)}`}>
                 {data.pollutants.find(p => p.name === 'PM2.5')?.status || 'Moderate'}
               </span>
               <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{data.message}</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
              <Wind className="w-5 h-5 mr-2 text-slate-400" />
              {t.pollutants}
            </h3>
            
            <div className="w-full h-80 min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.pollutants} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.3} />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#64748b" width={60} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
                    cursor={{fill: '#f8fafc20'}}
                  />
                  <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                    {data.pollutants.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.status === 'GOOD' ? '#22c55e' : 
                        entry.status === 'MODERATE' ? '#eab308' : 
                        '#ef4444'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <div className="text-center">
                <span className="block text-slate-400 text-xs uppercase mb-1">{t.temp}</span>
                <div className="flex items-center justify-center font-semibold text-slate-700 dark:text-slate-200">
                  <CloudRain className="w-4 h-4 mr-1.5" /> 22°C
                </div>
              </div>
              <div className="text-center border-l border-slate-100 dark:border-slate-700">
                <span className="block text-slate-400 text-xs uppercase mb-1">{t.humidity}</span>
                <div className="flex items-center justify-center font-semibold text-slate-700 dark:text-slate-200">
                  <Droplets className="w-4 h-4 mr-1.5" /> 62%
                </div>
              </div>
              <div className="text-center border-l border-slate-100 dark:border-slate-700">
                <span className="block text-slate-400 text-xs uppercase mb-1">{t.wind}</span>
                <div className="flex items-center justify-center font-semibold text-slate-700 dark:text-slate-200">
                  <Wind className="w-4 h-4 mr-1.5" /> 18 km/h
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
