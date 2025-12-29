
import { TransportLine, AirQualityData, EmergencyAlert, TripPlan, PollutantLevel, CityEvent, ResourceMetric } from '../types';
import { SERVICE_URLS } from './apiConfig';

// --- FALLBACK MOCK DATA (High Fidelity Tunisia Context) ---

const MOCK_MOBILITY: TransportLine[] = [
  { id: "L1", name: "Metro 1: Place Barcelone ↔ Ben Arous", type: "METRO", status: "ON_TIME", nextArrival: "2 mins", crowding: 85, nextDepartures: ["10:02", "10:12", "10:22"], hasLiveTracking: true },
  { id: "L2", name: "Metro 2: Place République ↔ Ariana", type: "METRO", status: "DELAYED", nextArrival: "12 mins", crowding: 92, nextDepartures: ["10:12", "10:32", "10:52"], lineAlerts: ["Signal failure at Cité Sportive. Expect delays."], hasLiveTracking: true },
  { id: "L4", name: "Metro 4: Place Barcelone ↔ Manouba", type: "METRO", status: "ON_TIME", nextArrival: "4 mins", crowding: 45, nextDepartures: ["10:04", "10:14", "10:24"], hasLiveTracking: true },
  { id: "TGM", name: "TGM: Tunis Marine ↔ La Marsa", type: "TGM", status: "ON_TIME", nextArrival: "15 mins", crowding: 30, nextDepartures: ["10:15", "10:35", "10:55"], hasLiveTracking: false },
  { id: "RFR", name: "RFR ELine: Place Barcelone ↔ Bougatfa", type: "TRAIN", status: "DISRUPTED", nextArrival: "--", crowding: 0, lineAlerts: ["Service suspended due to technical maintenance."], nextDepartures: [], hasLiveTracking: false },
];

const MOCK_EVENTS: CityEvent[] = [
  { id: "e1", title: "Festival International de Carthage", description: "Concert Amphithéâtre Romain.", date: new Date().toISOString(), category: "CULTURAL", location: "Carthage" },
  { id: "e2", title: "Tunisia Investment Forum", description: "Rencontre économique majeure.", date: new Date().toISOString(), category: "BUSINESS", location: "Hotel Laico, Tunis" },
  { id: "e3", title: "Dream City", description: "Art contemporain dans la Médina.", date: new Date().toISOString(), category: "ART", location: "Médina de Tunis" },
];

const MOCK_ALERTS: EmergencyAlert[] = [
  { id: "a1", type: "FIRE", severity: "HIGH", location: "Jebel Boukornine", timestamp: new Date().toISOString(), description: "Incendie de forêt signalé. Unités ONPC dépêchées.", status: "ACTIVE" },
  { id: "a2", type: "ACCIDENT", severity: "MEDIUM", location: "Autoroute A1 (Sortie Hammamet)", timestamp: new Date().toISOString(), description: "Collision multiple, ralentissement majeur.", status: "RESOLVED" },
  { id: "a3", type: "MEDICAL", severity: "CRITICAL", location: "Stade Rades", timestamp: new Date().toISOString(), description: "Malaise cardiaque spectateur.", status: "RESOLVED" },
];

const MOCK_RESOURCES: ResourceMetric[] = [
  { id: "w1", name: "Barrage Sidi Salem", type: "WATER", value: 32, unit: "% Capacité", status: "CRITICAL", trend: "DOWN", location: "Béja (Source Tunis)" },
  { id: "w2", name: "Station Traitement Ghdir El Golla", type: "WATER", value: 4500, unit: "m³/h", status: "OPTIMAL", trend: "STABLE", location: "Tunis Ouest" },
  { id: "e1", name: "Centrale Radès (Cycle Combiné)", type: "ENERGY", value: 85, unit: "% Charge", status: "WARNING", trend: "UP", location: "Radès" },
  { id: "e2", name: "Parc Éolien Sidi Daoud", type: "ENERGY", value: 45, unit: "MW", status: "OPTIMAL", trend: "UP", location: "Cap Bon Grid" },
];

const MOCK_AIR_QUALITY: AirQualityData = {
  district: "Tunis Centre", aqi: 92, lastUpdated: "Juste maintenant", message: "Pollution modérée due au trafic Avenue Bourguiba.",
  pollutants: [
    { name: "PM2.5", value: 35, unit: "µg/m³", status: "MODERATE" },
    { name: "NO2", value: 55, unit: "ppb", status: "MODERATE" },
    { name: "O3", value: 10, unit: "ppb", status: "GOOD" }
  ]
};

async function fetchWithFallback<T>(url: string, options: RequestInit = {}, fallback: T, name: string): Promise<T> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);
    
    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });
    clearTimeout(id);
    
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const data = await response.json();
    
    window.dispatchEvent(new CustomEvent('backend-status', { detail: { online: true } }));
    return data;
  } catch (error) {
    window.dispatchEvent(new CustomEvent('backend-status', { detail: { online: false } }));
    return fallback;
  }
}

export const MobilityService = {
  getAllLines: async (): Promise<TransportLine[]> => {
    return fetchWithFallback(SERVICE_URLS.MOBILITY, {}, MOCK_MOBILITY, "Mobility");
  }
};

export const AirQualityService = {
  getQualityByZone: async (zone: string): Promise<AirQualityData> => {
    let data = { ...MOCK_AIR_QUALITY };
    if (zone.includes("Industrial")) { data.aqi = 150; data.message = "Zone Industrielle Ben Arous: Qualité dégradée."; }
    if (zone.includes("Carthage")) { data.aqi = 40; data.message = "Air marin sain."; }
    return fetchWithFallback(`${SERVICE_URLS.ENVIRONMENT}/zone/${encodeURIComponent(zone)}`, {}, { ...data, district: zone }, "AirQuality");
  }
};

export const EmergencyService = {
  getActiveAlerts: async (): Promise<EmergencyAlert[]> => {
    return fetchWithFallback(SERVICE_URLS.EMERGENCY, {}, MOCK_ALERTS, "Emergency");
  }
};

export const CityDataService = {
  getEvents: async (): Promise<CityEvent[]> => {
    const query = `query { cityEvents { id title description date category location } }`;
    try {
      const response = await fetch(SERVICE_URLS.CITY_DATA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if(!response.ok) throw new Error("GQL Error");
      const json = await response.json();
      window.dispatchEvent(new CustomEvent('backend-status', { detail: { online: true } }));
      return json.data.cityEvents;
    } catch (e) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: { online: false } }));
      return MOCK_EVENTS;
    }
  }
};

export const ResourceService = {
  getMetrics: async (): Promise<ResourceMetric[]> => {
    return fetchWithFallback(SERVICE_URLS.RESOURCES, {}, MOCK_RESOURCES, "Resources");
  }
};

export const OrchestratorService = {
  planTrip: async (from: string, to: string): Promise<TripPlan> => {
    return fetchWithFallback(
      `${SERVICE_URLS.ORCHESTRATOR}/plan`, 
      { method: 'POST', body: JSON.stringify({from_loc: from, to_loc: to}) },
      {
        from, to,
        airQualityWarning: from.includes("Industrial"),
        recommendedRoute: MOCK_MOBILITY.slice(0, 2),
        estimatedDuration: 42,
        alternativeSuggestion: from.includes("Industrial") ? "Utiliser le TGM pour éviter les zones de smog." : undefined
      }, 
      "Orchestrator"
    );
  }
};
