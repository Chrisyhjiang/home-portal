import React, { useState, useEffect } from 'react';
import Desktop from "./features/Desktop/components/Desktop";
import Loading from './features/Loading/Loading';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Commenting out the timeout logic so loading screen stays visible
  /*
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
  */

  return (
    <>
      {isLoading && (
        <div className={`fixed inset-0 ${fadeOut ? 'opacity-0 transition-opacity duration-1000' : ''}`}>
          <Loading />
        </div>
      )}
      
      {/* Commenting out the desktop/background part
      <div className={`relative h-screen w-screen ${fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
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

        <div className="relative">
          <Desktop />
        </div>
      </div>
      */}
    </>
  );
};

export default App;
