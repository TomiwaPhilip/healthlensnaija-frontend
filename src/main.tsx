//frontend/src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client"; // Import `createRoot` from ReactDOM
import App from "./App";
import { DashboardProvider } from "./context/DashboardContext";
import { ThemeProvider } from "next-themes";
import "./i18n";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </ThemeProvider>
  </React.StrictMode>
);
