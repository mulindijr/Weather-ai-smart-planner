/**
 * Reusable utility functions to analyze weather telemetry and generate
 * intelligent, actionable recommendations.
 */

// Helper to convert temperature to Celsius internally for thresholds
const toCelsius = (temp, isImperial) => {
  return isImperial ? ((temp - 32) * 5) / 9 : temp;
};

// Helper to convert wind speed to m/s internally for thresholds
const toMetersPerSecond = (speed, isImperial) => {
  return isImperial ? speed * 0.44704 : speed;
};

// WMO Rainy/Snowy/Stormy Codes
const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
const SNOW_CODES = [71, 73, 75, 77, 85, 86];

/**
 * Evaluates current and forecast weather telemetry to generate intelligent cards.
 * 
 * @param {Object} weatherData - Raw weather object from API.
 * @param {Object} settings - Context settings (for units, lang, etc.).
 * @returns {Array} List of actionable recommendations.
 */
export const getWeatherRecommendations = (weatherData, settings = {}) => {
  if (!weatherData) return [];

  const current = weatherData.current || {};
  const dailyList = weatherData.daily || [];
  const hourlyList = weatherData.hourly || [];
  const todayDaily = dailyList[0] || {};

  const isImperial = settings.units === "imperial";

  // Normalize metrics
  const currentTempC = toCelsius(current.temperature || 0, isImperial);
  const maxTempC = toCelsius(todayDaily.temp_max || current.temperature || 0, isImperial);
  const minTempC = toCelsius(todayDaily.temp_min || current.temperature || 0, isImperial);
  const windSpeedMs = toMetersPerSecond(current.windspeed || 0, isImperial);
  const dailyPrecipMm = todayDaily.precipitation || 0;
  const currentCode = current.weathercode !== undefined ? Number(current.weathercode) : -1;

  const recommendations = [];

  // Check hourly forecast for next 5 hours of rain
  const next5Hours = hourlyList.slice(0, 5);
  const rainInComingHours = next5Hours.some(
    (h) => (h.precipitation || 0) > 0.8 || RAIN_CODES.includes(Number(h.weathercode))
  );

  // 1. Carry Umbrella
  const isCurrentlyRaining = RAIN_CODES.includes(currentCode);
  if (isCurrentlyRaining || rainInComingHours) {
    const isThunderstorm = [95, 96, 99].includes(currentCode);
    recommendations.push({
      id: "carry_umbrella",
      type: "alert",
      title: "Carry Umbrella",
      desc: isCurrentlyRaining
        ? "Precipitation is active right now. Ensure you take a waterproof umbrella."
        : "Rain is expected in the next few hours. Keep an umbrella close by.",
      severity: isThunderstorm ? "danger" : "warning",
      iconName: "Umbrella",
      badgeText: "Rain Advisory"
    });
  }

  // 2. Rain Expected (but not currently raining or in the next 5 hours)
  if (dailyPrecipMm > 1.5 && !isCurrentlyRaining && !rainInComingHours) {
    recommendations.push({
      id: "rain_expected",
      type: "alert",
      title: "Rain Expected Today",
      desc: `Total accumulation of ${Math.round(dailyPrecipMm * 10) / 10}mm forecast. Keep rain gear handy.`,
      severity: "info",
      iconName: "CloudRain",
      badgeText: "Precipitation"
    });
  }

  // 3. High UV
  const isSunny = [0, 1].includes(currentCode);
  if (isSunny && maxTempC > 24) {
    recommendations.push({
      id: "high_uv",
      type: "alert",
      title: "High UV Radiation",
      desc: "Peak solar telemetry indicates high UV index. Wear sunglasses and SPF protection.",
      severity: "warning",
      iconName: "Sun",
      badgeText: "UV Exposure"
    });
  }

  // 4. Strong Wind
  if (windSpeedMs > 8.5) {
    recommendations.push({
      id: "strong_wind",
      type: "alert",
      title: "Strong Wind Warning",
      desc: `Velocities reaching ${Math.round(current.windspeed)} ${isImperial ? "mph" : "m/s"}. Watch for flying debris.`,
      severity: "warning",
      iconName: "Wind",
      badgeText: "Gale Advisory"
    });
  }

  // 5. Good Running Weather
  const isRainyOrSnowy = RAIN_CODES.includes(currentCode) || SNOW_CODES.includes(currentCode);
  const isGoodRunningTemp = currentTempC >= 10 && currentTempC <= 22;
  if (isGoodRunningTemp && windSpeedMs < 5.5 && !isRainyOrSnowy && dailyPrecipMm < 0.2) {
    recommendations.push({
      id: "running_weather",
      type: "activity",
      title: "Good Running Weather",
      desc: `Temperatures are a perfect ${Math.round(current.temperature)}°${isImperial ? "F" : "C"} with minimal wind resistance.`,
      severity: "success",
      iconName: "Activity",
      badgeText: "Cardio"
    });
  }

  // 6. Excellent Cycling Weather
  const isGoodCyclingTemp = currentTempC >= 13 && currentTempC <= 25;
  const isCyclingSkyClear = [0, 1, 2].includes(currentCode);
  if (isGoodCyclingTemp && windSpeedMs < 6.5 && !isRainyOrSnowy && isCyclingSkyClear) {
    recommendations.push({
      id: "cycling_weather",
      type: "activity",
      title: "Excellent Cycling Weather",
      desc: "Outstanding visibility and low headwinds. Perfect for hitting the trails.",
      severity: "success",
      iconName: "Bike",
      badgeText: "Cycling"
    });
  }

  // 7. Poor Farming Conditions
  const isExtremeHeat = currentTempC > 34;
  const isFrostRisk = minTempC <= 1;
  const isHeavyRain = dailyPrecipMm > 15;
  const isFarmingWindy = windSpeedMs > 9.5;

  if (isExtremeHeat || isFrostRisk || isHeavyRain || isFarmingWindy) {
    let farmReason = "Unstable telemetry detected.";
    if (isFrostRisk) farmReason = "Frost warnings in place. Protect cold-sensitive sprouts.";
    else if (isExtremeHeat) farmReason = "Heat stress warnings active. Increase crops hydration.";
    else if (isHeavyRain) farmReason = "Heavy rain expected. Risk of soil waterlogging and erosion.";
    else if (isFarmingWindy) farmReason = "Gale-force winds could damage structure and taller vegetation.";

    recommendations.push({
      id: "poor_farming",
      type: "activity",
      title: "Poor Farming Conditions",
      desc: farmReason,
      severity: "warning",
      iconName: "Sprout",
      badgeText: "Agriculture"
    });
  }

  // 8. Stay Hydrated
  if (currentTempC > 27) {
    recommendations.push({
      id: "stay_hydrated",
      type: "lifestyle",
      title: "Stay Hydrated",
      desc: "Scorching atmosphere increases fluid loss. Carry water and drink frequently.",
      severity: "warning",
      iconName: "Droplet",
      badgeText: "Health"
    });
  }

  // 9. Cold Morning
  if (minTempC < 8) {
    recommendations.push({
      id: "cold_morning",
      type: "lifestyle",
      title: "Cold Morning Outlook",
      desc: `Dipping to a freezing ${Math.round(todayDaily.temp_min || 0)}°${isImperial ? "F" : "C"}. Layer warm attire.`,
      severity: "primary",
      iconName: "Thermometer",
      badgeText: "Attire Advice"
    });
  }

  // 10. Hot Afternoon
  if (maxTempC > 29) {
    recommendations.push({
      id: "hot_afternoon",
      type: "lifestyle",
      title: "Hot Afternoon Outlook",
      desc: `Expect temperatures to peak around ${Math.round(todayDaily.temp_max || 0)}°${isImperial ? "F" : "C"}. Dress light.`,
      severity: "warning",
      iconName: "Sun",
      badgeText: "Attire Advice"
    });
  }

  return recommendations;
};
