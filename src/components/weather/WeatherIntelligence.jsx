import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Umbrella, 
  CloudRain, 
  Sun, 
  Wind, 
  Activity, 
  Bike, 
  Sprout, 
  Droplet, 
  Thermometer, 
  Brain, 
  Sparkles,
  Info 
} from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import { useWeatherSettings } from "../../context/WeatherSettingsContext";
import { getWeatherRecommendations } from "../../utils/weatherIntelligence";

const iconComponents = {
  Umbrella: Umbrella,
  CloudRain: CloudRain,
  Sun: Sun,
  Wind: Wind,
  Activity: Activity,
  Bike: Bike,
  Sprout: Sprout,
  Droplet: Droplet,
  Thermometer: Thermometer
};

const tabs = [
  { id: "all", label: "All Insights" },
  { id: "alert", label: "Alerts" },
  { id: "activity", label: "Activities" },
  { id: "lifestyle", label: "Lifestyle" },
];

export default function WeatherIntelligence({ weatherData }) {
  const { settings } = useWeatherSettings();
  const [activeTab, setActiveTab] = useState("all");

  if (!weatherData) return null;

  const allRecommendations = getWeatherRecommendations(weatherData, settings);

  // Filter recommendations based on activeTab
  const filteredRecommendations = allRecommendations.filter(
    (rec) => activeTab === "all" || rec.type === activeTab
  );

  // Styling helper for card severity colors
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "danger":
        return {
          card: "border-rose-500/20 bg-rose-950/10 hover:border-rose-500/40 hover:shadow-rose-950/20",
          iconContainer: "bg-rose-500/15 text-rose-400 border-rose-500/20",
          badge: "warning" // Reuses warning styled Badge or custom colors
        };
      case "warning":
        return {
          card: "border-amber-500/20 bg-amber-950/10 hover:border-amber-500/40 hover:shadow-amber-950/20",
          iconContainer: "bg-amber-500/15 text-amber-400 border-amber-500/20",
          badge: "warning"
        };
      case "success":
        return {
          card: "border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/40 hover:shadow-emerald-950/20",
          iconContainer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
          badge: "success"
        };
      case "info":
        return {
          card: "border-sky-500/20 bg-sky-950/10 hover:border-sky-500/40 hover:shadow-sky-950/20",
          iconContainer: "bg-sky-500/15 text-sky-400 border-sky-500/20",
          badge: "neutral"
        };
      case "primary":
      default:
        return {
          card: "border-indigo-500/20 bg-indigo-950/10 hover:border-indigo-500/40 hover:shadow-indigo-950/20",
          iconContainer: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
          badge: "primary"
        };
    }
  };

  return (
    <div className="col-span-12 space-y-4">
      {/* Container Card wrapper */}
      <Card
        title="Weather Intelligence Insights"
        subtitle="Dynamic, rule-based telemetry calculations converted into actionable warnings and advice"
        headerAction={
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold bg-indigo-650/5 border border-indigo-500/15 px-2.5 py-1 rounded-md glow-indigo">
            <Brain className="h-4 w-4 animate-pulse" />
            <span>Telemetry Rule Engine</span>
          </div>
        }
      >
        <div className="space-y-6">
          
          {/* Custom Tabs with framer-motion sliding background */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900/60 border border-slate-800/80 rounded-xl max-w-md">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                    isActive ? "text-indigo-200" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIntelligenceTab"
                      className="absolute inset-0 bg-indigo-650/20 border border-indigo-500/25 rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredRecommendations.length > 0 ? (
                filteredRecommendations.map((rec) => {
                  const Icon = iconComponents[rec.iconName] || Info;
                  const styles = getSeverityStyles(rec.severity);

                  return (
                    <motion.div
                      key={rec.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      title={rec.desc}
                      className={`group p-4 rounded-xl border flex flex-col justify-between hover:scale-101 hover:shadow-lg transition-all duration-300 relative overflow-hidden ${styles.card}`}
                    >
                      {/* Interactive background glow on card hover */}
                      <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-current opacity-[0.01] group-hover:opacity-[0.03] rounded-full transition-opacity duration-300 blur-xl pointer-events-none" />

                      <div className="space-y-3.5">
                        {/* Header: Icon container & Badge */}
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg border flex items-center justify-center shrink-0 ${styles.iconContainer}`}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <Badge variant={styles.badge} className="text-[9px] font-bold px-2 py-0.2 uppercase">
                            {rec.badgeText}
                          </Badge>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            {rec.desc}
                          </p>
                        </div>
                      </div>

                      {/* Footer: Static system advisory tag */}
                      <div className="mt-4 pt-2 border-t border-slate-800/10 flex justify-between items-center text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
                        <span>Action Advisory</span>
                        <Sparkles className="h-3 w-3 opacity-30 group-hover:opacity-70 group-hover:text-indigo-400 transition-all" />
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-8 text-center bg-slate-900/10 border border-dashed border-slate-800/60 rounded-xl"
                >
                  <Info className="h-8 w-8 text-slate-600 mx-auto mb-2.5" />
                  <p className="text-sm font-semibold text-slate-455">
                    No recommendations matching filters for the current telemetry.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Skies are stable. Try checking back during unstable weather shifts.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </Card>
    </div>
  );
}
