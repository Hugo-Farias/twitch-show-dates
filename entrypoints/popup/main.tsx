import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style.css";

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", () => console.clear());
}

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
