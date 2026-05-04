import { createContext, useContext } from "react";

export const dashboardContext = createContext(null);

export const useDashboard = () => {
  const context = useContext(dashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};