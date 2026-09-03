import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import berniqMark from "./assets/berniq-mark.png";
import "./styles/global.css";

const favicon = document.querySelector('link[rel="icon"]') ?? document.createElement("link");
favicon.rel = "icon";
favicon.href = berniqMark;
document.head.appendChild(favicon);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
