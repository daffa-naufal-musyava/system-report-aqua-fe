import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { MachineAnalyticsProvider } from "./contexts/MachineAnalyticsProvider.jsx";
import { AuthProvider } from "./contexts/authProvider.jsx";
import { MachineSummaryProvider } from "./contexts/machineSummaryProvider.jsx";
import { DashboardProvider } from "./contexts/dashboardProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <DashboardProvider>
      <MachineAnalyticsProvider>
        <MachineSummaryProvider>
          <RouterProvider router={router} />
        </MachineSummaryProvider>
      </MachineAnalyticsProvider>
    </DashboardProvider>
  </AuthProvider>,
);
