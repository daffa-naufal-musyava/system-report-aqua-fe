import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authProvider.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { MachineAnalyticsProvider } from "./contexts/MachineAnalyticsProvider.jsx";
import { AuthProvider } from "./contexts/authProvider.jsx";
import { MachineSummaryProvider } from "./contexts/machineSummaryProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <MachineAnalyticsProvider>
      <MachineSummaryProvider>
        <RouterProvider router={router} />
      </MachineSummaryProvider>
    </MachineAnalyticsProvider>
  </AuthProvider>,
);
