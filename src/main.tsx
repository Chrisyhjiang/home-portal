import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  // 🚨 Remove StrictMode to avoid warnings
  <App />
);
