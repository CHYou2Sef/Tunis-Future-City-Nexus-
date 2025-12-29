import React, { useState } from 'react';
import { OrchestratorService } from '../services/mockBackend';
import { TripPlan } from '../types';
import { Map, ArrowRight, AlertOctagon, Check, Bus, Timer } from 'lucide-react';

export const OrchestratorView: React.FC = () => {
  const [from, setFrom] = useState('Tunis Centre');
  const [to, setTo] = useState('La Marsa');
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    setLoading(true);
    const result = await OrchestratorService.planTrip(from, to);
    setPlan(result);
    setLoading(false);
  };

  const locations = ['Tunis Centre', 'La Marsa', 'Ben Arous (Industrial)', 'Carthage', 'Ariana'];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Smart Journey Planner</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Orchestrating <span className="font-semibold text-blue-600">Air Quality</span> data with <span className="font-semibold text-blue-600">Transport Schedules</span> to find the healthiest route across Greater Tunis.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Origin</label>
          <select 
            value={from} 
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
          >
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        
        <div className="hidden md:flex items-center justify-center pt-6 text-slate-300">
            <ArrowRight className="w-6 h-6" />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Destination</label>
          <select 
            value={to} 
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
          >
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="w-full md:w-auto pt-6">
          <button 
            onClick={handlePlan}
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Plan Route'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {plan && (
        <div className="animate-fade-in-up space-y-6">
            
          {/* Health Warning Card (Conditional) */}
          {plan.airQualityWarning && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
              <AlertOctagon className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800">Pollution Alert</h3>
                <p className="text-red-700 text-sm mt-1">High particulate matter detected in {from}. Walking is not recommended.</p>
                {plan.alternativeSuggestion && (
                    <div className="mt-3 text-xs font-semibold text-red-800 bg-white/50 inline-block px-3 py-1 rounded-full">
                        💡 Tip: {plan.alternativeSuggestion}
                    </div>
                )}
              </div>
            </div>
          )}

          {!plan.airQualityWarning && (
             <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start">
                <Check className="w-6 h-6 text-green-600 mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-green-800">Clear Air Route</h3>
                  <p className="text-green-700 text-sm mt-1">Air quality is optimal along this route. Good conditions for walking to the station.</p>
                </div>
             </div>
          )}

          {/* Route Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Suggested Itineraries</h3>
                <span className="text-sm font-medium text-slate-500 flex items-center">
                    <Timer className="w-4 h-4 mr-1"/> Est. {plan.estimatedDuration} mins
                </span>
            </div>
            
            <div className="divide-y divide-slate-100">
                {plan.recommendedRoute.map((route, idx) => (
                    <div key={idx} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-4">
                                {idx + 1}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{route.name}</h4>
                                <div className="flex items-center text-xs text-slate-500 mt-1 space-x-3">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{route.type}</span>
                                    <span>• Arriving in {route.nextArrival}</span>
                                    <span className={`${route.crowding > 50 ? 'text-orange-500' : 'text-green-500'}`}>• {route.crowding}% Full</span>
                                </div>
                            </div>
                        </div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Select
                        </button>
                    </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
