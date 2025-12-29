import React, { useEffect, useState } from 'react';
import { CityDataService } from '../services/mockBackend';
import { CityEvent } from '../types';
import { Calendar, MapPin, Database, Server } from 'lucide-react';

export const CityDataView: React.FC = () => {
  const [events, setEvents] = useState<CityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CityDataService.getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-500">Fetching Municipal Data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tunis City Events</h2>
          <p className="text-slate-500 flex items-center">
            <Database className="w-4 h-4 mr-1"/> Municipal Data Graph (GraphQL)
          </p>
        </div>
        <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold border border-pink-200 flex items-center">
           <Server className="w-3 h-3 mr-1"/> GraphQL Active
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 w-full ${
                event.category === 'CULTURAL' ? 'bg-purple-500' : 
                event.category === 'SPORTS' ? 'bg-orange-500' : 
                'bg-blue-500'
            }`}></div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{event.category}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono">ID: {event.id}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{event.description}</p>
                
                <div className="space-y-2 pt-4 border-t border-slate-50">
                    <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                        {event.location}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Code Snippet Display for educational purposes */}
      <div className="mt-8 bg-slate-900 rounded-lg p-6 text-slate-300 font-mono text-xs overflow-x-auto">
        <p className="text-slate-500 mb-2 uppercase font-bold tracking-wider">Executed GraphQL Query</p>
        <pre>{`query {
  cityEvents(city: "Tunis") {
    id
    title
    description
    date
    location
  }
}`}</pre>
      </div>
    </div>
  );
};
