
/**
 * Spring Boot Microservices Configuration
 * Adjust these ports to match your Spring Boot application properties.
 */
const GATEWAY_URL = 'http://localhost:8080';

export const SERVICE_URLS = {
  // Option A: Single API Gateway (Recommended)
  GATEWAY: GATEWAY_URL,
  
  // Option B: Individual Microservices
  MOBILITY: `${GATEWAY_URL}/api/mobility`,
  ENVIRONMENT: `${GATEWAY_URL}/api/environment`,
  EMERGENCY: `${GATEWAY_URL}/api/emergency`,
  RESOURCES: `${GATEWAY_URL}/api/resources`,
  CITY_DATA: `${GATEWAY_URL}/graphql`, // GraphQL usually at root or /graphql
  ORCHESTRATOR: `${GATEWAY_URL}/api/orchestrator`,
};

// Toggle to 'true' when Spring Boot services are live to bypass local mock delays
export const IS_PRODUCTION_BACKEND = false;
