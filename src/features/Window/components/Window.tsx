import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion, animate } from "framer-motion";
import { useAppStore } from "@hooks/useAppStore";
import "../styles/Window.css";
import { AnimatePresence } from "framer-motion";

interface WindowProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMaximizedAlready?: boolean;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  title,
  isVisible,
  onClose,
  onMinimize,
  isMaximizedAlready = false,
  children,
}) => {
  const [size, setSize] = useState(() => {
    // Set larger initial size for PDF viewer
    if (title === "PDFViewer") {
      return { width: 900, height: 1100 };
    }
    return { width: 600, height: 400 };
  });

  const [position, setPosition] = useState(() => {
    // Position PDF viewer in top-left
    if (title === "PDFViewer") {
      return { x: 20, y: 20 };
    }
    // Change default position to top-left with a small offset
    return { x: 20, y: 20 };
  });

  const [isMaximized, setIsMaximized] = useState(isMaximizedAlready);
  const { minimizeApp, openApps, setWindowPosition } = useAppStore();
  const [isMinimizing, setIsMinimizing] = useState(false);

  // Add state to track if we're restoring from minimized
  const [isRestoring, setIsRestoring] = useState(false);

  // Track if we should animate from dock
  const [shouldAnimateFromDock, setShouldAnimateFromDock] = useState(false);

  const appData = openApps.find((app) => app.appName === title);

  // Add a sanitized class name for the window
  const windowClassName = `window-rnd-${title.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    if (isMaximized) {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    } else {
      setSize({ width: 600, height: 400 });
      // Update this to also use top-left positioning when un-maximizing
      setPosition({ x: 20, y: 20 });
    }
  }, [isMaximized]);

  useEffect(() => {
    // When window becomes visible and was previously minimized
    const app = openApps.find(a => a.appName === title);
    if (isVisible && app?.lastPosition) {
      if (app.minimized) {
        // Set flag to animate from dock
        setShouldAnimateFromDock(true);
      } else {
        // Normal position restore
        setPosition(app.lastPosition.position);
        setSize(app.lastPosition.size);
      }
    }
  }, [isVisible, openApps]);

  // Handle the actual restore animation when needed
  useEffect(() => {
    if (shouldAnimateFromDock) {
      handleRestore();
      setShouldAnimateFromDock(false);
    }
  }, [shouldAnimateFromDock]);

  const handleMinimize = async () => {
    setIsMinimizing(true);
    
    const rndElement = document.querySelector(`.${windowClassName}`) as HTMLElement;
    if (!rndElement) {
      console.error('Could not find window element with class:', windowClassName);
      return;
    }

    const iconImg = document.querySelector(`img[alt="${title}"]`);
    const dockIcon = iconImg?.closest('.group');
    
    if (!dockIcon) {
      console.error('Could not find dock icon for:', title);
      const allIcons = document.querySelectorAll('img');
      console.log('Available icons:', Array.from(allIcons).map(img => img.alt));
      return;
    }

    const dockIconRect = dockIcon.getBoundingClientRect();
    
    if (dockIconRect) {
      setWindowPosition(title, { 
        position: { x: position.x, y: position.y },
        size 
      });

      const targetX = dockIconRect.left - rndElement.offsetLeft;
      const targetY = dockIconRect.top - rndElement.offsetTop;
      
      try {
        await animate(
          rndElement,
          {
            scale: [
              1,        // Start normal size
              0.8,      // Slight shrink
              0.6,      // Continue shrinking
              0.4,      // Getting smaller
              0.2,      // Almost there
              0.1       // Final tiny size
            ],
            x: [
              0,                  // Start position
              targetX * 0.1,      // Start moving slightly
              targetX * 0.3,      // Pick up speed
              targetX * 0.5,      // Halfway there
              targetX * 0.8,      // Almost there
              targetX             // Final position
            ],
            y: [
              0,                  // Start position
              -80,               // Move up first
              -40,               // Start coming down
              targetY * 0.3,      // Continue arc
              targetY * 0.7,      // Almost there
              targetY             // Final position
            ]
          },
          {
            duration: 0.5,        // Slightly longer duration
            ease: [0.32, 0, 0.67, 0], // Custom easing for smooth motion
            times: [0, 0.2, 0.4, 0.6, 0.8, 1] // Control timing of keyframes
          }
        );
      } catch (error) {
        console.error('Animation failed:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    onMinimize();
    setIsMinimizing(false);
  };

  const handleRestore = async () => {
    setIsRestoring(true);

    const iconImg = document.querySelector(`img[alt="${title}"]`);
    const dockIcon = iconImg?.closest('.group');
    
    if (!dockIcon) {
      console.error('Could not find dock icon for:', title);
      return;
    }

    const dockIconRect = dockIcon.getBoundingClientRect();
    const app = openApps.find(a => a.appName === title);
    
    if (dockIconRect && app?.lastPosition) {
      const targetX = app.lastPosition.position.x;
      const targetY = app.lastPosition.position.y;
      
      const startX = dockIconRect.left;
      const startY = dockIconRect.top;

      // Set initial position to dock icon position
      setPosition({ x: startX, y: startY });
      setSize({ width: 50, height: 50 }); // Start with icon size

      // Small delay to ensure position is set
      await new Promise(resolve => setTimeout(resolve, 50));

      const rndElement = document.querySelector(`.${windowClassName}`) as HTMLElement;
      if (!rndElement) return;
      
      try {
        await animate(
          rndElement,
          {
            scale: [
              0.1,      // Start tiny (dock icon size)
              0.2,      // Start growing
              0.4,      // Getting bigger
              0.6,      // Continue growing
              0.8,      // Almost there
              1        // Final size
            ],
            width: [
              50,      // Start with icon width
              app.lastPosition.size.width * 0.2,
              app.lastPosition.size.width * 0.4,
              app.lastPosition.size.width * 0.6,
              app.lastPosition.size.width * 0.8,
              app.lastPosition.size.width
            ],
            height: [
              50,      // Start with icon height
              app.lastPosition.size.height * 0.2,
              app.lastPosition.size.height * 0.4,
              app.lastPosition.size.height * 0.6,
              app.lastPosition.size.height * 0.8,
              app.lastPosition.size.height
            ],
            x: [
              0,
              (targetX - startX) * 0.2,
              (targetX - startX) * 0.4,
              (targetX - startX) * 0.6,
              (targetX - startX) * 0.8,
              targetX - startX
            ],
            y: [
              0,
              -20,    // Small up movement
              (targetY - startY) * 0.3,
              (targetY - startY) * 0.5,
              (targetY - startY) * 0.7,
              targetY - startY
            ]
          },
          {
            duration: 0.4,
            ease: [0.2, 0.9, 0.1, 1],
            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
          }
        );

        // Set final size and position
        setSize(app.lastPosition.size);
        setPosition(app.lastPosition.position);
      } catch (error) {
        console.error('Restore animation failed:', error);
      }
    }
    
    setIsRestoring(false);
  };

  if (!isVisible || appData?.minimized) return null;

  return (
    <AnimatePresence>
      {isVisible && !appData?.minimized && (
        <motion.div
          initial={!shouldAnimateFromDock && !isRestoring}
          animate={{ 
            scale: isMinimizing ? 1 : 1, 
            opacity: isMinimizing ? 1 : 1 
          }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            transformOrigin: 'top left',
            width: 'fit-content',
            height: 'fit-content'
          }}
        >
          <Rnd
            size={size}
            position={position}
            bounds="window"
            className={`window-rnd ${windowClassName}`}
            dragHandleClassName="drag-handle"
            onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, newPosition) => {
              setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
              setPosition(newPosition);
            }}
            style={{
              transformOrigin: 'top left'
            }}
          >
            <div className="window-top-bar drag-handle">
              <div className="window-controls">
                <button
                  onClick={handleMinimize}
                  className="minimize-button"
                >
                  _
                </button>
                <button onClick={() => setIsMaximized(!isMaximized)}>
                  {isMaximized ? "❐" : "[]"}
                </button>
                <button onClick={onClose}>X</button>
              </div>
              <span className="window-title">{title}</span>
            </div>

            <div className="window-content">{children}</div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Window;
