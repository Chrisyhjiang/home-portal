import React, { useState, useEffect } from 'react';
import Desktop from "./features/Desktop/components/Desktop";
import Loading from './features/Loading/Loading';

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
      }, 1000);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={fadeOut ? 'fade-out' : ''}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={`relative h-screen w-screen ${fadeIn ? 'fade-in' : ''}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <div className="relative">
        {/* macOS Desktop UI */}
        <Desktop />
      </div>
    </div>
  );
};

export default App;
