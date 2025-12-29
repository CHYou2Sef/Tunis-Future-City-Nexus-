

// Mobility Types (REST)
export interface TransportLine {
  id: string;
  name: string;
  type: 'BUS' | 'METRO' | 'TRAM' | 'TGM' | 'TRAIN';
  status: 'ON_TIME' | 'DELAYED' | 'DISRUPTED';
  nextArrival: string; // ISO time or relative string
  crowding: number; // 0-100 percentage
  nextDepartures?: string[];
  lineAlerts?: string[];
  hasLiveTracking?: boolean;
}

// Air Quality Types (SOAP)
export interface PollutantLevel {
  name: string; // NO2, CO2, O3, PM2.5
  value: number;
  unit: string;
  status: 'GOOD' | 'MODERATE' | 'UNHEALTHY' | 'HAZARDOUS';
}

export interface AirQualityData {
  district: string;
  aqi: number;
  lastUpdated: string;
  pollutants: PollutantLevel[];
  message: string;
}

// Emergency Types (gRPC)
export interface EmergencyAlert {
  id: string;
  type: 'ACCIDENT' | 'FIRE' | 'MEDICAL' | 'POLICE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  timestamp: string;
  description: string;
  status: 'ACTIVE' | 'RESOLVED';
}

// GraphQL Types
export interface CityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  location: string;
}

// Orchestrator Types
export interface TripPlan {
  from: string;
  to: string;
  airQualityWarning: boolean;
  recommendedRoute: TransportLine[];
  estimatedDuration: number; // minutes
  alternativeSuggestion?: string;
}

// IoT Telemetry Types (New Service)
export interface ResourceMetric {
  id: string;
  name: string;
  type: 'WATER' | 'ENERGY';
  value: number;
  unit: string;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  trend: 'UP' | 'DOWN' | 'STABLE';
  location: string;
}