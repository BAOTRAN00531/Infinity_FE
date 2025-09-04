// @ts-nocheck
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { QuizzProvider } from "./contexts/QuizzContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QuizzProvider>
        <App />
      </QuizzProvider>
    </BrowserRouter>
  </React.StrictMode>
);
