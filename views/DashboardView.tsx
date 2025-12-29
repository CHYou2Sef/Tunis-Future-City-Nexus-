
import React from 'react';
import { ViewState } from '../App';
import { Activity, Users, ShieldCheck, Zap, Droplets, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../contexts/AppContext';

interface DashboardViewProps {
  onViewChange: (view: ViewState) => void;
}

const data = [
  { name: '06:00', load: 400, traffic: 240 },
  { name: '08:00', load: 3000, traffic: 1398 },
  { name: '10:00', load: 2000, traffic: 9800 },
  { name: '12:00', load: 2780, traffic: 3908 },
  { name: '14:00', load: 1890, traffic: 4800 },
  { name: '16:00', load: 2390, traffic: 3800 },
  { name: '18:00', load: 3490, traffic: 4300 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onViewChange }) => {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{t.welcome_title}</h2>
            <p className="text-slate-200 max-w-xl">
                {t.welcome_desc}
            </p>
            <div className="mt-6 flex space-x-3">
                <button 
                  onClick={() => onViewChange(ViewState.RESOURCES)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-red-900/50 flex items-center"
                >
                    <Droplets className="w-4 h-4 mr-2"/> {t.btn_water}
                </button>
                <button 
                    onClick={() => onViewChange(ViewState.EMERGENCY)}
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm"
                >
                    {t.btn_alerts}
                </button>
            </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-red-600/20 blur-3xl transform translate-x-1/2"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: t.kpi_pop, value: '2.7M', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: t.kpi_renewable, value: '45 MW', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            { label: t.kpi_air, value: 'Moderate', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
            { label: t.kpi_safety, value: '94%', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center transition-colors">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} mr-4`}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">{t.chart_title}</h3>
            {/* Fixed height container for Recharts */}
            <div className="w-full h-80 min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="traffic" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h4 className="font-semibold text-blue-100 text-sm uppercase tracking-wider">Tunis Weather</h4>
                        <div className="mt-2 flex items-baseline">
                             <span className="text-4xl font-bold">24°</span>
                             <span className="ml-1 text-blue-100">C</span>
                        </div>
                        <p className="text-blue-100 font-medium mt-1">Partly Cloudy</p>
                    </div>
                    <Sun className="w-12 h-12 text-yellow-300" />
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
                    <div className="flex items-center">
                        <Wind className="w-4 h-4 mr-2 text-blue-200" />
                        <span className="text-sm font-medium">14 km/h</span>
                    </div>
                    <div className="flex items-center">
                        <Droplets className="w-4 h-4 mr-2 text-blue-200" />
                        <span className="text-sm font-medium">45%</span>
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-4 text-white opacity-10">
                   <CloudRain className="w-32 h-32" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">{t.infra_status}</h3>
                <div className="space-y-4">
                    {[
                        { name: 'TRANSTU REST API', status: t.status_operational, latency: '45ms', color: 'bg-green-500' },
                        { name: 'ANPE Air Quality', status: t.status_operational, latency: '120ms', color: 'bg-green-500' },
                        { name: 'Civil Defense Link', status: t.status_active, latency: '12ms', color: 'bg-blue-500' },
                        { name: 'STEG Smart Grid', status: t.status_syncing, latency: '340ms', color: 'bg-yellow-500' },
                    ].map((proto, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-default">
                            <div className="flex items-center">
                                <div className={`w-2.5 h-2.5 rounded-full ${proto.color} mr-3`}></div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{proto.name}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{proto.status}</div>
                                <div className="text-xs text-slate-400">{proto.latency}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
