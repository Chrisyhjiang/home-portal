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

  const handleMinimize = async () => {
    setIsMinimizing(true);
    
    const rndElement = document.querySelector(`.${windowClassName}`) as HTMLElement;
    if (!rndElement) return;

    const transform = window.getComputedStyle(rndElement).transform;
    const matrix = new DOMMatrix(transform);
    
    const currentPosition = {
      x: position.x + matrix.m41,
      y: position.y + matrix.m42
    };

    const dockIcon = document.querySelector(`[data-app="${title}"]`);
    const dockIconRect = dockIcon?.getBoundingClientRect();
    
    if (dockIconRect) {
      setWindowPosition(title, { 
        position: currentPosition,
        size 
      });

      // Calculate the animation target relative to the current window position
      const targetX = dockIconRect.x - currentPosition.x;
      const targetY = dockIconRect.y - currentPosition.y;
      
      await animate(
        `.${windowClassName}`,
        {
          scale: [1, 0.9, 0.5, 0.2],
          opacity: [1, 1, 0.8, 0],
          x: [
            0,
            targetX * 0.1, 
            targetX * 0.3,
            targetX
          ],
          y: [
            0,
            -100, // Move up more dramatically
            targetY * 0.3,
            targetY
          ],
          rotate: [0, -8, -15, -5], // More pronounced rotation
        },
        {
          duration: 0.5, // Slightly longer duration
          ease: [0.4, 0, 0.2, 1], // Custom easing for more bounce
        }
      );
    }
    
    onMinimize();
    setIsMinimizing(false);
  };

  // Restore position when window becomes visible
  useEffect(() => {
    const app = openApps.find(a => a.appName === title);
    if (app?.lastPosition && !isMinimizing) {
      // Just restore the exact position we stored
      setPosition(app.lastPosition.position);
      setSize(app.lastPosition.size);
    }
  }, [openApps, title, isMinimizing]);

  if (!isVisible || appData?.minimized) return null;

  return (
    <AnimatePresence>
      {isVisible && !appData?.minimized && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
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
