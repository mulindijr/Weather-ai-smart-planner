import React, { useState } from "react";
import { 
  CloudSun, 
  Menu, 
  X, 
  CalendarRange, 
  Brain, 
  Settings, 
  MapPin,
  HelpCircle,
  ArrowUpRight
} from "lucide-react";
import SearchInput from "../components/common/SearchInput";
import { useWeatherSettings } from "../context/WeatherSettingsContext";
import { useUsage } from "../hooks/useUsageQueries";
import ProgressBar from "../components/common/ProgressBar";
import Badge from "../components/common/Badge";
import SettingsDrawer from "../components/weather/SettingsDrawer";
import toast from "react-hot-toast";


export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { location } = useWeatherSettings();
  const { data: usage, isLoading: usageLoading } = useUsage();

  const menuItems = [
    { name: "Weather Dashboard", icon: CloudSun, active: true },
    { name: "Smart Planner", icon: CalendarRange, active: false, badge: "AI" },
    { name: "AI Insights", icon: Brain, active: false, pro: true },
    { name: "Developer APIs", icon: Settings, active: false },
  ];

  const handleLinkClick = (e, item) => {
    if (!item.active) {
      e.preventDefault();
      toast.error(
        `${item.name} is a locked feature. Upgrade to a PRO plan to gain full access.`,
        {
          icon: "🔒",
          style: {
            background: "#090d16",
            color: "#f3f4f6",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* 1. Sidebar - Desktop (hidden on mobile) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-800/60 bg-slate-950/40 backdrop-blur-md z-30">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-850">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white glow-indigo">
              <CloudSun className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 text-sm tracking-tight leading-none">
                Weather.AI
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
                Smart Planner
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href="#"
                title={item.active ? item.name : `${item.name} (Requires Upgrade)`}
                onClick={(e) => handleLinkClick(e, item)}
                className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  item.active
                    ? "bg-indigo-600/10 text-indigo-200 border border-indigo-500/20"
                    : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                    item.active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-350"
                  }`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="primary" className="text-[9px] px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
                {item.pro && (
                  <Badge variant="warning" className="text-[9px] px-1.5 py-0 flex items-center gap-0.5">
                    PRO
                  </Badge>
                )}
              </a>
            ))}
          </nav>

          {/* Usage Meter & Plan Widget (Bottom) */}
          <div className="p-4 border-t border-slate-850/60 bg-slate-950/20">
            {usageLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-800 animate-pulse rounded" />
                <div className="h-2 w-full bg-slate-800 animate-pulse rounded" />
              </div>
            ) : (
              usage && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">API Usage</span>
                    <Badge variant={usage.plan === "free" ? "neutral" : "success"} className="text-[10px] px-2 py-0 uppercase">
                      {usage.plan}
                    </Badge>
                  </div>
                  
                  <ProgressBar
                    value={usage.used}
                    max={usage.limit}
                    size="xs"
                    color={usage.used / usage.limit > 0.85 ? "rose" : "indigo"}
                    info={`${usage.used} / ${usage.limit}`}
                  />
                  
                  {usage.plan === "free" && (
                    <button 
                      type="button"
                      className="w-full bg-indigo-500/10 hover:bg-indigo-500/18 text-indigo-300 hover:text-white border border-indigo-500/25 rounded-md px-2.5 py-1.5 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <span>Upgrade Plan</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </aside>

      {/* 2. Topbar Header */}
      <div className="flex flex-col flex-1 md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-800/60 bg-slate-950/30 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          {/* Mobile hamburger menu and active location details */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-slate-400 hover:text-slate-200 md:hidden cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {location && location.city && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-slate-250 font-semibold">{location.city}</span>
                {location.region && <span className="opacity-60">{location.region}</span>}
                <span className="px-1 py-0.2 bg-slate-800 text-[10px] text-slate-350 rounded border border-slate-700 uppercase">
                  {location.country}
                </span>
              </div>
            )}
          </div>

          {/* Core Autocomplete Search Widget */}
          <SearchInput placeholder="Search global cities (e.g. London, New York...)" />

          {/* Right utility items */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="h-8 w-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors bg-slate-900/50 cursor-pointer"
              title="Settings"
            >
              <Settings className="h-4.5 w-4.5" />
            </button>
            <button 
              className="h-8 w-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors bg-slate-900/50 cursor-pointer"
              title="Help & Support documentation"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>
            <div 
              className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-slate-900 font-bold text-xs shadow-sm shadow-indigo-500/10"
              title="WA User (Free Plan)"
            >
              WA
            </div>
          </div>
        </header>

        {/* 3. Mobile Navigation Drawer Slider */}
        {mobileMenuOpen && (
          <div className="relative z-40 md:hidden" role="dialog" aria-modal="true">
            {/* Backdrop cover overlay */}
            <div 
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu container */}
            <div className="fixed inset-y-0 left-0 flex max-w-xs w-full bg-slate-950 border-r border-slate-850 p-6 flex-col">
              <div className="flex items-center justify-between pb-6 border-b border-slate-850 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center text-white">
                    <CloudSun className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-bold text-slate-100 text-sm tracking-tight">
                    Weather.AI
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile links */}
              <nav className="flex-1 space-y-1.5">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    onClick={(e) => {
                      handleLinkClick(e, item);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.active
                        ? "bg-indigo-600/10 text-indigo-200 border border-indigo-500/20"
                        : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && <Badge variant="primary">{item.badge}</Badge>}
                    {item.pro && <Badge variant="warning">PRO</Badge>}
                  </a>
                ))}
              </nav>

              {/* Usage Widget in Mobile Navigation */}
              {usage && (
                <div className="mt-auto border-t border-slate-850/80 pt-6 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Usage Limit</span>
                    <span className="text-slate-200 font-semibold">{usage.used} / {usage.limit}</span>
                  </div>
                  <ProgressBar
                    value={usage.used}
                    max={usage.limit}
                    size="xs"
                    color={usage.used / usage.limit > 0.85 ? "rose" : "indigo"}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Page Main Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>

      {/* Settings Configuration Drawer */}
      <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
