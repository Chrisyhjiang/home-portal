import React, { useState, useEffect } from "react";
import Desktop from "./features/Desktop/components/Desktop";
import Loading from "./features/Loading/Loading";
import Background from "./features/Background/components/Background";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
        setFadeIn(true);
      }, 500);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div
          className={`fixed inset-0 ${
            fadeOut ? "opacity-0 transition-opacity duration-1000" : ""
          }`}
        >
          <Loading />
        </div>
      )}

      <div
        className={`relative h-screen w-screen ${
          fadeIn ? "opacity-100 transition-opacity duration-1000" : "opacity-0"
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

export default App;
