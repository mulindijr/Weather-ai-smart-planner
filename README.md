# Weather.AI: Smart Planner & Telemetry Dashboard

An advanced, premium React dashboard that translates raw atmospheric data and weather forecasts into real-time, actionable lifestyle and activity recommendations. Designed with state-of-the-art aesthetics, smooth micro-animations, and robust state synchronization.

<img width="1920" height="918" alt="wai1" src="https://github.com/user-attachments/assets/73dd4305-23d6-4fc1-b7c0-7085bc447070" />
---

## 🚀 Core Features

### 📡 1. Atmospheric Telemetry settings Panel
*   **Persistent Configuration**: Settings (`ai`, `units`, `lang`, `days`) are loaded from and synchronized to `localStorage` automatically.
*   **Cache Invalidation**: Adjusting any setting instantly updates React Query keys, triggering automatic background data refetching without full page reloads.
*   **Premium Controls**: Built with sliding segmented buttons (`layoutId` animated tabs) and smooth-sliding configurations.
*   **Pro Feature Locks**: Simulated paywalls that trigger custom, styling-matched toast warning overlays if locked configurations or menus are selected.

### 🧠 2. Weather Intelligence Rule Engine
*   **Actionable Insights**: Converts complex weather telemetry into user-friendly recommendations:
    *   *Daily Alerts*: Carry Umbrella, Rain Expected, High UV Exposure warnings, Strong Wind alarms.
    *   *Outdoor Activities*: Good Running Weather, Excellent Cycling Weather, Poor Farming Conditions.
    *   *Health & Lifestyle*: Stay Hydrated, Cold Morning Outlook, Hot Afternoon dress suggestions.
*   **Dynamic Conversion**: Automatically parses metric and imperial thresholds based on selected settings.
*   **Category Filters**: Beautiful sliding tabs to filter recommendations by category (Alerts, Activities, Lifestyle) using Framer Motion layout transitions.

### 🗺️ 3. Interactive GPS Radar & Mapping
*   **Dark-Themed Map**: Implemented an interactive Leaflet map featuring CartoDB Dark Matter tiles matching the dashboard's design.
*   **Pulsing Radar Marker**: Displays your location using a custom pulsing HTML/CSS divIcon radar marker.
*   **GPS Geolocator**: "Use My Current Location" button queries the browser geolocator and runs reverse-geocoding requests to OpenStreetMap's Nominatim API to resolve the city name, region, and country flag.
*   **On-Load Autolocation**: Detects exact GPS coordinates on mount, falling back gracefully to IP-based location parsing if permissions are denied.

---

## 🛠️ Technology Stack

*   **Framework & Bundler**: React 19, Vite
*   **Data Fetching & Cache Management**: TanStack React Query v5
*   **Animations & Micro-interactions**: Framer Motion v12
*   **Interactive Maps**: Leaflet API (CartoDB Dark Matter tiles)
*   **Icons & Tooltips**: Lucide React, HTML5 title indicators
*   **Notifications**: React Hot Toast
*   **Styling**: Tailwind CSS v4, custom glassmorphic variables

---

## 📂 Project Architecture

```
weather-ai-smart-planner/
├── public/                 # Static assets
├── src/
│   ├── api/                # Core API fetch requests (weather endpoints, location, usage limits)
│   ├── common/             # Startup initializers (InitializeWeather.jsx)
│   ├── components/         
│   │   ├── common/         # Reusable widgets (Cards, Badges, ProgressBars, Selects, Toggles)
│   │   └── weather/        # Diagnostic cards, Settings Drawer, Weather Intelligence & Map Card
│   ├── context/            # WeatherSettingsContext (persisted configurations & global location state)
│   ├── hooks/              # Query hooks (weather queries, ip locations, API usage meters)
│   ├── layouts/            # DashboardLayout (topbar search, sidebar menus & upgrade toaster locks)
│   ├── pages/              # Primary Dashboard Page Router
│   ├── utils/              # Rule checkers (weatherIntelligence.js, weatherHelpers.jsx)
│   ├── App.jsx             # Main router root
│   ├── index.css           # Glassmorphism utilities & scroll theme
│   └── main.jsx            # QueryClient wrapper
├── index.html              # Leaflet CDN libraries
└── package.json            # Tool versions
```

---

## ⚙️ Setup & Installation

Follow these steps to run the project locally on your machine.

### 1. Prerequisite
Ensure you have **Node.js** (v18.0 or higher) and **npm** installed.

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy `.env.example`) and populate the environment parameters:
```env
# Weather.AI API Gateway Credentials
VITE_WEATHER_AI_API_KEY=your_api_key_here
VITE_WEATHER_AI_BASE_URL=https://api.weather-ai.co/v1
```

### 3. Install dependencies
```bash
npm install
```

### 4. Spin up local development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

### 6. Run Linter
```bash
npm run lint
```

---

## 🔌 API Endpoints Reference

The client communicates with the weather API via the following endpoints:

*   **Core Endpoints (Active in UI)**:
    *   `GET /weather`: Fetch current weather, 24h hourly trends, and multi-day forecasts based on latitude and longitude coordinates.
    *   `GET /weather-geo`: Fallback geolocation resolver that fetches initial weather details and location headers based on the request's IP.
    *   `GET /ip-lookup`: Retrieve ISP info, client IP node address, and country coordinates.
    *   `GET /insights`: Access the Gemini-powered AI weather commentary and dynamic observations.
    *   `GET /usage`: Fetch API request counter statistics and plan rates.

*   **Granular / Extended Endpoints (Hooks available)**:
    *   `GET /forecast`: Returns structured day-by-day forecast coordinates.
    *   `GET /current`: Retrieve exact current-only real-time conditions.
    *   `GET /daily`: Fetch multi-day weather forecast lists.
    *   `GET /hourly`: Fetch detailed hourly forecasting metrics.
    *   `GET /forecast14`: Retrieve 14-day extended telemetry forecasts (PRO tier).


<img width="458" height="916" alt="wai5" src="https://github.com/user-attachments/assets/df48c13a-467e-465b-9d07-f102ae3a0ff1" />
