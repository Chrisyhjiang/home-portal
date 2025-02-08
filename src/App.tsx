import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Desktop from "./features/Desktop/components/Desktop";
import Loading from "./features/Loading/Loading";
import Portfolio from "./features/Portfolio/containers/Main/Main";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

// Lazy load the Background component
const Background = lazy(
  () => import("./features/Background/components/Background")
);

// Separate component for the Desktop route to handle loading state
const DesktopRoute: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset states when route changes to /desktop
    if (location.pathname === "/desktop") {
      setIsLoading(true);
      setFadeOut(false);
      setFadeIn(false);

      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsLoading(false);
          setFadeIn(true);
        }, 500); // Wait for loading fade out
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Add loading-active class to body when loading
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("loading-active");
    } else {
      document.body.classList.remove("loading-active");
    }
  }, [isLoading]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        } ${!isLoading ? "pointer-events-none" : ""}`}
      >
        <Loading />
      </div>
      <div
        className={`relative h-screen w-screen transition-opacity duration-500 ${
          fadeIn && !isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        <Background />
        <div className="relative">
          <Desktop />
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Background />
          <Routes>
            <Route path="/desktop" element={<DesktopRoute />} />
            <Route
              path="/"
              element={
                <div className="portfolio-container">
                  <Portfolio />
                </div>
              }
            />
            {/* Redirect all other routes to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
