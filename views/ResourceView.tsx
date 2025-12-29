
import React, { useEffect, useState } from 'react';
import { ResourceService } from '../services/mockBackend';
import { ResourceMetric } from '../types';
import { Droplets, Zap, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../contexts/AppContext';

export const ResourceView: React.FC = () => {
  const [metrics, setMetrics] = useState<ResourceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useApp();

  useEffect(() => {
    ResourceService.getMetrics().then(data => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPTIMAL': return 'text-green-500 bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800';
      case 'WARNING': return 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800';
      case 'CRITICAL': return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800';
      default: return 'text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'UP': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'DOWN': return <TrendingDown className="w-4 h-4 text-rose-500" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const waterMetrics = metrics.filter(m => m.type === 'WATER');
  const energyMetrics = metrics.filter(m => m.type === 'ENERGY');

  if (loading) return <div className="p-10 text-center text-slate-500">{t.loading}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.resources_title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t.resources_subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
           <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
           <span>IoT Gateway Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
           <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center">
             <Droplets className="w-5 h-5 mr-2 text-blue-500" /> {t.water_mgmt}
           </h3>
           <div className="grid gap-4">
             {waterMetrics.map((metric) => (
               <div key={metric.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{metric.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{metric.location}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(metric.status)}`}>
                        {metric.status}
                    </div>
                 </div>
                 <div className="flex items-end justify-between">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
                        <span className="ml-1 text-slate-500 dark:text-slate-400 font-medium">{metric.unit}</span>
                    </div>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                        {getTrendIcon(metric.trend)}
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">{metric.trend}</span>
                    </div>
                 </div>
                 <div className="absolute bottom-0 left-0 h-1.5 bg-blue-100 dark:bg-blue-900 w-full">
                    <div className="h-full bg-blue-500" style={{width: `${Math.min(metric.value, 100)}%`}}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center">
             <Zap className="w-5 h-5 mr-2 text-yellow-500" /> {t.energy_mgmt}
           </h3>
           <div className="grid gap-4">
             {energyMetrics.map((metric) => (
               <div key={metric.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{metric.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{metric.location}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(metric.status)}`}>
                        {metric.status}
                    </div>
                 </div>
                 <div className="flex items-end justify-between">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
                        <span className="ml-1 text-slate-500 dark:text-slate-400 font-medium">{metric.unit}</span>
                    </div>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                        {getTrendIcon(metric.trend)}
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">{metric.trend}</span>
                    </div>
                 </div>
                 <div className="absolute bottom-0 left-0 h-1.5 bg-yellow-100 dark:bg-yellow-900 w-full">
                    <div className="h-full bg-yellow-500" style={{width: `${Math.min(metric.value * 10, 100)}%`}}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mt-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">{t.efficiency_chart}</h3>
          <div className="w-full h-80 min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {metrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.type === 'WATER' ? '#3b82f6' : '#eab308'} />
                        ))}
                      </Bar>
                  </BarChart>
              </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};
