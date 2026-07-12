import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, MapPin } from "lucide-react";
import { useWeatherSettings } from "../../context/WeatherSettingsContext";

export default function SearchInput({
  placeholder = "Search cities globally...",
  className = "",
  onSelectCity, // Optional callback
  ...props
}) {
  const { setSettings, setLocation } = useWeatherSettings();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  // Debounced API calling
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query
          )}&count=6&language=en&format=json`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setOpen(true);
          setActiveIndex(-1);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce delay

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    const lat = Number(city.latitude);
    const lon = Number(city.longitude);

    setSettings((prev) => ({
      ...prev,
      lat,
      lon,
    }));

    const loc = {
      city: city.name,
      region: city.admin1 || "",
      country: city.country_code || city.country || "",
    };

    setLocation(loc);

    setQuery("");
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);

    if (onSelectCity) {
      onSelectCity(city);
    }
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full max-w-md ${className}`}>
      {/* Search Input Box */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          {loading ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin text-indigo-400" />
          ) : (
            <Search className="h-4.5 w-4.5" />
          )}
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/80 rounded-lg pl-10 pr-10 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          {...props}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 backdrop-blur-lg border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
          {results.map((city, idx) => (
            <button
              key={`${city.id || idx}-${city.name}`}
              type="button"
              onClick={() => handleSelect(city)}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                idx === activeIndex
                  ? "bg-indigo-600/35 text-white"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-100">{city.name}</span>
                {city.admin1 && (
                  <span className="text-xs text-slate-400 ml-1.5">
                    {city.admin1}
                  </span>
                )}
                {city.country && (
                  <span className="text-xs text-indigo-300/85 font-medium ml-2 uppercase px-1 py-0.2 bg-indigo-500/10 rounded border border-indigo-500/15">
                    {city.country_code || city.country.substring(0, 2)}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
