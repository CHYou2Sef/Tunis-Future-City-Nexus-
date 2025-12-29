
# Tunis Future City Nexus 🇹🇳

An Integrated Smart Urban Command Center prototype for Tunisia, visualizing real-time data from Mobility (TransTu), Environment (ANPE), Energy (STEG), and Emergency (ONPC) services.

## Project Structure

- **root/**: Frontend React Application (Vite/TypeScript)
  - `components/`: Reusable UI components (Sidebar, Header)
  - `views/`: Specific dashboard pages (Mobility, Resources, etc.)
  - `services/`: API integration logic
  - `contexts/`: Global state (Theme, Language, Backend Status)
  - `utils/`: Translations and helpers
- **backend/**: Python Backend Application (FastAPI)
  - `main.py`: REST and GraphQL server implementation
  - `requirements.txt`: Python dependencies

## Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)

### 2. Setup Backend (Python)
The backend serves as the data provider. If the backend is not running, the frontend will automatically fallback to "Offline Mode" using cached mock data.

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`.

### 3. Setup Frontend (React)
1. Navigate to the project root (open a new terminal):
   ```bash
   # Make sure you are in the root directory
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173` (or the port shown in your terminal).

## Features

- **Live & Offline Modes**: Automatically detects if the Python backend is running.
- **Internationalization**: English and French support.
- **Dark Mode**: Fully responsive dark theme.
- **Services Integrated**:
  - **Mobility**: REST API for Metro/Bus schedules.
  - **Environment**: Simulated SOAP data for Air Quality.
  - **City Data**: GraphQL endpoint for Events.
  - **Resources**: Telemetry for Water & Energy.

## Troubleshooting

- **"Backend Offline"**: Ensure the Python server is running on port 8000. Check console logs for connection errors.
- **CORS Errors**: The backend is configured to accept all origins (`*`) for development purposes.
