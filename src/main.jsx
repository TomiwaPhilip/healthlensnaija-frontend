//frontend/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client"; // Import `createRoot` from ReactDOM
import App from "./App";
import { DashboardProvider } from "./context/DashboardContext";
import "./i18n";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </React.StrictMode>
);
