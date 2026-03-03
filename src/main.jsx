import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NhostReactProvider } from '@nhost/react';
import { nhost } from './nhost';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NhostReactProvider nhost={nhost}>
      <App />
    </NhostReactProvider>
  </StrictMode>
);
