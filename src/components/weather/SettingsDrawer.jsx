import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Globe, 
  Calendar, 
  Settings, 
  Check, 
  ChevronDown, 
  Thermometer, 
  HelpCircle 
} from "lucide-react";
import { useWeatherSettings } from "../../context/WeatherSettingsContext";
import Badge from "../common/Badge";
import toast from "react-hot-toast";

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
];

const forecastDaysOptions = [
  { value: 1, label: "1 Day", desc: "Current & Hourly" },
  { value: 3, label: "3 Days", desc: "Short-range outlook" },
  { value: 7, label: "7 Days", desc: "Standard forecast" },
  { value: 14, label: "14 Days", desc: "Extended telemetry", pro: true },
];

export default function SettingsDrawer({ isOpen, onClose }) {
  const { settings, setSettings } = useWeatherSettings();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef(null);

  // Close language dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleAI = () => {
    setSettings((prev) => ({ ...prev, ai: !prev.ai }));
  };

  const handleSelectUnits = (units) => {
    setSettings((prev) => ({ ...prev, units }));
  };

  const handleSelectDays = (days) => {
    if (days === 14) {
      toast.error(
        "14-Day Extended Telemetry is a PRO feature. Upgrade to a PRO plan to unlock.",
        {
          icon: "🔒",
          style: {
            background: "#090d16",
            color: "#f3f4f6",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
          },
        }
      );
      return;
    }
    setSettings((prev) => ({ ...prev, days }));
  };

  const handleSelectLang = (lang) => {
    setSettings((prev) => ({ ...prev, lang }));
    setLangDropdownOpen(false);
  };

  const currentLanguage = languages.find((l) => l.code === (settings.lang || "en")) || languages[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-md h-full bg-slate-950/95 border-l border-slate-800/80 shadow-2xl z-50 flex flex-col backdrop-blur-md overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-850 bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 glow-indigo">
                  <Settings className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 leading-none">
                    Telemetry Configuration
                  </h3>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1 block">
                    Customise Dashboard Experience
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors bg-slate-900/40 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 scrollbar-thin">
              
              {/* Option 1: AI Summary Toggle */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 space-y-3.5 hover:border-slate-700/40 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Cognitive Layer</span>
                    <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                      <span>AI Copilot Summaries</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                      Generate real-time synthetic breakdowns and scheduling recommendations.
                    </p>
                  </div>

                  {/* Beautiful Custom Toggle Switch */}
                  <div 
                    role="checkbox"
                    aria-checked={settings.ai}
                    tabIndex={0}
                    onClick={handleToggleAI}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        handleToggleAI();
                      }
                    }}
                    className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-indigo-500 border border-slate-700/50 ${
                      settings.ai ? "bg-indigo-600 glow-indigo" : "bg-slate-800"
                    }`}
                  >
                    <motion.div
                      className="absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-md flex items-center justify-center text-[10px]"
                      animate={{ x: settings.ai ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 30 }}
                    >
                      {settings.ai && <Check className="h-3 w-3 text-indigo-600 stroke-[3]" />}
                    </motion.div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800/40 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">Model Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${settings.ai ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                    <span className={settings.ai ? "text-emerald-400 font-semibold" : "text-slate-500 font-medium"}>
                      {settings.ai ? "AI Core Active" : "Cognitive Standby"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Option 2: Metric / Imperial Segmented Control */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Thermometer className="h-4 w-4 text-indigo-400" />
                    <span>Atmospheric Units</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Temperature & Wind</span>
                </div>

                {/* Sliding Segmented Tab Wrapper */}
                <div className="relative flex p-1 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                  {/* Sliding Background Indicator */}
                  <div className="absolute inset-y-1 left-1 right-1 pointer-events-none">
                    <div className="grid grid-cols-2 h-full w-full">
                      <div className="relative w-full h-full">
                        {settings.units !== "imperial" && (
                          <motion.div
                            layoutId="activeUnitBackground"
                            className="absolute inset-0 bg-indigo-650/20 border border-indigo-500/25 rounded-lg shadow-md"
                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                          />
                        )}
                      </div>
                      <div className="relative w-full h-full">
                        {settings.units === "imperial" && (
                          <motion.div
                            layoutId="activeUnitBackground"
                            className="absolute inset-0 bg-indigo-650/20 border border-indigo-500/25 rounded-lg shadow-md"
                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectUnits("metric")}
                    className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg z-10 transition-colors cursor-pointer relative ${
                      settings.units !== "imperial" ? "text-indigo-200" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Metric (°C, m/s)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectUnits("imperial")}
                    className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg z-10 transition-colors cursor-pointer relative ${
                      settings.units === "imperial" ? "text-indigo-200" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Imperial (°F, mph)
                  </button>
                </div>
              </div>

              {/* Option 3: Forecast Days Segmented Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    <span>Forecast Horizon</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Daily Range</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {forecastDaysOptions.map((opt) => {
                    const isSelected = (settings.days || 7) === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectDays(opt.value)}
                        className={`relative p-3.5 text-left rounded-xl border text-slate-200 flex flex-col justify-between h-20 transition-all duration-300 cursor-pointer overflow-hidden ${
                          isSelected
                            ? "bg-indigo-650/10 border-indigo-500/30 shadow-md shadow-indigo-600/5 animate-pulse-subtle"
                            : "bg-slate-900/30 border-slate-800 hover:border-slate-700/50 hover:bg-slate-900/50"
                        }`}
                      >
                        {/* Selected Indicator Glow */}
                        {isSelected && (
                          <motion.div
                            layoutId="activeDaysIndicator"
                            className="absolute -right-6 -bottom-6 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"
                          />
                        )}

                        <div className="flex items-center justify-between w-full">
                          <span className={`text-sm font-bold ${isSelected ? "text-indigo-400" : "text-slate-200"}`}>
                            {opt.label}
                          </span>
                          {opt.pro && (
                            <Badge variant="warning" className="text-[8px] font-bold px-1.5 py-0">
                              PRO
                            </Badge>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-500 leading-none block font-medium mt-1.5">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option 4: Custom Animated Language Dropdown */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-indigo-400" />
                    <span>Language Localization</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">AI Insights Translation</span>
                </div>

                <div ref={langRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className="w-full flex items-center justify-between bg-slate-900/60 hover:bg-slate-900/80 hover:border-slate-700 transition-colors border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none shrink-0">{currentLanguage.flag}</span>
                      <span className="font-semibold text-slate-200">{currentLanguage.name}</span>
                      <span className="text-xs text-slate-500 font-medium">({currentLanguage.nativeName})</span>
                    </div>
                    <motion.div
                      animate={{ rotate: langDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400 shrink-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {langDropdownOpen && (
                      <motion.div
                        className="absolute bottom-full left-0 right-0 mb-2 sm:bottom-auto sm:top-full sm:mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-800/50 max-h-56 overflow-y-auto"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        {languages.map((lang) => {
                          const isSelected = currentLanguage.code === lang.code;
                          return (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => handleSelectLang(lang.code)}
                              className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-slate-800/60 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg leading-none shrink-0 group-hover:scale-110 transition-transform">{lang.flag}</span>
                                <span className={`font-medium ${isSelected ? "text-indigo-400 font-bold" : "text-slate-350"}`}>
                                  {lang.name}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">({lang.nativeName})</span>
                              </div>
                              {isSelected && (
                                <Check className="h-4 w-4 text-indigo-400 stroke-[2.5] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-850 bg-slate-950/70 space-y-3.5">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-slate-400 text-[11px] leading-relaxed">
                <HelpCircle className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  Any configuration changes made are applied immediately, updating all data layers and caching structures dynamically.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-center text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Close Panel
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
