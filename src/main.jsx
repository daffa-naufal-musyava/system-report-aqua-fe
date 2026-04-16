import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authProvider.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { MachineAnalyticsProvider } from "./contexts/MachineAnalyticsProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <MachineAnalyticsProvider>
      <RouterProvider router={router} />
    </MachineAnalyticsProvider>
  </AuthProvider>,
);
