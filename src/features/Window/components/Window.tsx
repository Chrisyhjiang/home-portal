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
    
    // Use the unique window class name
    const rndElement = document.querySelector(`.${windowClassName}`) as HTMLElement;
    if (!rndElement) return;

    // Get the transform matrix to account for any transforms
    const transform = window.getComputedStyle(rndElement).transform;
    const matrix = new DOMMatrix(transform);
    
    // Store the actual position including transforms
    const currentPosition = {
      x: position.x + matrix.m41,
      y: position.y + matrix.m42
    };

    const dockIcon = document.querySelector(`[data-app="${title}"]`);
    const dockIconRect = dockIcon?.getBoundingClientRect();
    
    if (dockIconRect) {
      // Store the current position
      setWindowPosition(title, { 
        position: currentPosition,
        size 
      });

      // Calculate the animation target
      const targetX = dockIconRect.x - currentPosition.x;
      const targetY = dockIconRect.y - currentPosition.y;

      // Use the unique window class name for animation
      await animate(
        `.${windowClassName}`,
        {
          scale: 0.1,
          opacity: 0,
          x: targetX,
          y: targetY
        },
        { duration: 0.3 }
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
            scale: isMinimizing ? 0.3 : 1, 
            opacity: isMinimizing ? 0 : 1 
          }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.2 }}
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
