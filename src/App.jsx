import React from "react";
import InitializeWeather from "./common/InitializeWeather";
import DashboardLayout from "./layouts/DashboardLayout";
import WeatherDashboard from "./pages/WeatherDashboard";

function App() {
  return (
    <>
      <InitializeWeather />

      <DashboardLayout>
        <WeatherDashboard />
      </DashboardLayout>
    </>
  );
}

export default App;
