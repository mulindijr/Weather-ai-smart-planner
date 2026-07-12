import React, { useEffect, useState, useRef } from "react";
import { 
  Globe, 
  Clock, 
  Navigation, 
  Search, 
  Compass, 
  MapPin, 
  Loader2, 
  X 
} from "lucide-react";
import Card from "../common/Card";
import { useWeatherSettings } from "../../context/WeatherSettingsContext";

export default function LocationCard({ weatherData }) {
  const { settings, setSettings, location, setLocation } = useWeatherSettings();
  const [time, setTime] = useState(new Date());
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // GPS/Geolocation state
  const [gpsLoading, setGpsLoading] = useState(false);
  
  // Map references
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);
  const searchRef = useRef(null);

  const lat = settings.lat || -1.2921;
  const lon = settings.lon || 36.8219;

  // Live Clock effect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Map Initialization & Update effect
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Check if map already initialized
    if (!mapInstanceRef.current) {
      // 1. Initialize Leaflet Map instance
      mapInstanceRef.current = window.L.map(mapContainerRef.current, {
        zoomControl: false, // Clean minimal interface
        attributionControl: false,
        scrollWheelZoom: true,
      }).setView([lat, lon], 12);

      // 2. Set dark tile layer (CartoDB Dark Matter)
      window.L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 18,
        }
      ).addTo(mapInstanceRef.current);

      // 3. Create a beautiful pulsing glowing custom radar marker
      const radarIcon = window.L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute h-7 w-7 bg-indigo-500/30 rounded-full animate-ping border border-indigo-400/40"></div>
            <div class="relative h-4.5 w-4.5 bg-indigo-500 border border-white rounded-full shadow-lg shadow-indigo-650/40"></div>
          </div>
        `,
        className: "custom-leaflet-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      // 4. Create and add marker
      markerInstanceRef.current = window.L.marker([lat, lon], { icon: radarIcon }).addTo(
        mapInstanceRef.current
      );
    } else {
      // Update existing map view & marker coordinates
      mapInstanceRef.current.setView([lat, lon], 12);
      markerInstanceRef.current.setLatLng([lat, lon]);
    }
  }, [lat, lon]);

  // Click outside to close search list
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search logic for search bar inside the card
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchQuery
          )}&count=5&language=en&format=json`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error("Geocoding fetch error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle manual city selection
  const handleSelectCity = (city) => {
    const cityLat = Number(city.latitude);
    const cityLon = Number(city.longitude);

    setSettings((prev) => ({
      ...prev,
      lat: cityLat,
      lon: cityLon,
    }));

    setLocation({
      city: city.name,
      region: city.admin1 || "",
      country: city.country_code || city.country || "",
    });

    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
  };

  // Handle GPS location click
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const gpsLat = position.coords.latitude;
        const gpsLon = position.coords.longitude;

        setSettings((prev) => ({
          ...prev,
          lat: gpsLat,
          lon: gpsLon,
        }));

        try {
          // Reverse geocode via free OSM Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsLat}&lon=${gpsLon}&accept-language=en`
          );
          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            const resolvedCity =
              address.city ||
              address.town ||
              address.village ||
              address.suburb ||
              address.municipality ||
              "Current Position";
            const resolvedRegion = address.state || address.region || address.county || "";
            const resolvedCountry = address.country_code
              ? address.country_code.toUpperCase()
              : address.country || "";

            setLocation({
              city: resolvedCity,
              region: resolvedRegion,
              country: resolvedCountry,
            });
          } else {
            // Fallback if Nomimatim fails
            setLocation({
              city: "My Location",
              region: "Auto-detected",
              country: "GPS",
            });
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setLocation({
            city: "My Location",
            region: "Auto-detected",
            country: "GPS",
          });
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        console.error("GPS error code:", error.code, error.message);
        alert(`Geolocation failed: ${error.message}`);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const formatClock = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getFlagUrl = (countryCode) => {
    if (!countryCode || countryCode === "GPS") return null;
    return `https://flagcdn.com/20x15/${countryCode.toLowerCase()}.png`;
  };

  const hasCountryFlag = location.country && location.country.length <= 3;

  return (
    <Card
      title="Station Diagnostics"
      subtitle="Spatial mapping, coordinate analytics, and telemetry nodes"
      headerAction={
        <div className="flex gap-2">
          {/* Toggle Search Input */}
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={`h-7 w-7 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
              showSearch 
                ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="Search Location"
          >
            {showSearch ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
          </button>

          {/* GPS Target locator button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            className="h-7 w-7 rounded-md border border-slate-800 bg-slate-900/50 flex items-center justify-center text-slate-400 hover:text-slate-200 disabled:opacity-50 transition-all cursor-pointer"
            title="Use My Current Location"
          >
            {gpsLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
            ) : (
              <Navigation className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      }
      className="col-span-12 md:col-span-6 lg:col-span-4"
    >
      <div className="space-y-4">
        
        {/* Inline Search Autocomplete Menu inside the Card */}
        {showSearch && (
          <div ref={searchRef} className="relative z-20">
            <div className="relative">
              <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-500">
                {searchLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city code (e.g. Berlin, Tokyo...)"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/70 transition-colors"
              />
            </div>

            {/* Suggestions Overlay list */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl overflow-hidden divide-y divide-slate-850 z-30 max-h-40 overflow-y-auto">
                {searchResults.map((city, idx) => (
                  <button
                    key={`${city.id || idx}-${city.name}`}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    <div className="truncate flex-1">
                      <span className="font-semibold text-slate-200">{city.name}</span>
                      {city.admin1 && <span className="text-[10px] text-slate-500 ml-1">({city.admin1})</span>}
                    </div>
                    {city.country_code && (
                      <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1 py-0.2 rounded uppercase border border-indigo-500/10">
                        {city.country_code}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Leaflet Map Container */}
        <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950/40 relative shadow-inner z-10 group">
          <div ref={mapContainerRef} className="h-full w-full" />
          
          {/* Custom Overlay overlay coordinates readout */}
          <div className="absolute bottom-2 left-2 z-20 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 pointer-events-none flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "10s" }} />
            <span>
              {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
            </span>
          </div>
        </div>

        {/* Location Diagnostics metadata list */}
        <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-850/40">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3 text-indigo-400" />
              <span>Local Station Time</span>
            </span>
            <span className="text-sm font-bold text-slate-200 block font-mono">
              {formatClock(time)}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Globe className="h-3 w-3 text-sky-400" />
              <span>Timezone Node</span>
            </span>
            <span className="text-xs font-bold text-slate-200 block truncate">
              {weatherData?.timezone || "UTC"}
            </span>
          </div>
        </div>

        {/* Detailed Address Location Panel with country Flag */}
        <div className="space-y-2.5 pt-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Station Location</span>
            <div className="flex items-center gap-1.5">
              {hasCountryFlag && (
                <img 
                  src={getFlagUrl(location.country)} 
                  alt={location.country}
                  className="h-3 w-4 rounded-sm border border-slate-800 shadow-sm shrink-0"
                  onError={(e) => { e.target.style.display = "none"; }} 
                />
              )}
              <span className="font-semibold text-slate-200">
                {location.city || "Unknown Location"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Administrative District</span>
            <span className="font-semibold text-slate-300 truncate max-w-[180px]">
              {location.region || "Auto-detected"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Country Telemetry</span>
            <span className="font-semibold text-slate-300 flex items-center gap-1 uppercase">
              <span>{location.country || "GPS"}</span>
            </span>
          </div>
        </div>

      </div>
    </Card>
  );
}
