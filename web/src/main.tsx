import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WorkspaceProvider } from "./core/store";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WorkspaceProvider>
      <BrowserRouter><App /></BrowserRouter>
    </WorkspaceProvider>
  </React.StrictMode>
);