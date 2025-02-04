import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion, animate, AnimatePresence } from "framer-motion";
import { useAppStore } from "@hooks/useAppStore";
import "../styles/Window.css";
import { useWindowManager } from '../../../hooks/useWindowManager';

interface WindowProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMaximizedAlready?: boolean;
  children: React.ReactNode;
  startPosition?: { x: number; y: number };
  windowId: string;
}

const Window: React.FC<WindowProps> = ({
  title,
  isVisible,
  onClose,
  onMinimize,
  isMaximizedAlready = false,
  children,
  startPosition = { 
    x: (window.innerWidth - 600) / 2,
    y: (window.innerHeight - 400) / 2
  },
  windowId
}) => {
  console.log('Window component initialized with windowId:', windowId, 'and title:', title);

  const [size, setSize] = useState({ width: 600, height: 400 });
  const [position, setPosition] = useState(startPosition);
  const [isMaximized, setIsMaximized] = useState(isMaximizedAlready);
  const { openApps, setWindowPosition } = useAppStore();
  const windowClassName = `window-rnd-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const [isAnimating, setIsAnimating] = useState(false);
  const [preMaximizedState, setPreMaximizedState] = useState<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { bringToFront, windowStack, registerWindow } = useWindowManager();

  useEffect(() => {
    if (title === "PDFViewer") {
      setSize({ width: 900, height: 1100 });
    }

    const app = openApps.find(a => a.appName === title);
    if (app?.startPosition) {
      setPosition(app.startPosition);
    } else if (app?.lastPosition) {
      setPosition(app.lastPosition.position);
      setSize(app.lastPosition.size);
    }
  }, [title]);

  useEffect(() => {
    if (isMaximized) {
      const lastWindowState = {
        position,
        size
      };

      // Calculate 75% of screen dimensions
      const maxWidth = window.innerWidth * 0.75;
      const maxHeight = window.innerHeight * 0.75;
      
      // Calculate position to center the window
      const centerX = (window.innerWidth - maxWidth) / 2;
      const centerY = (window.innerHeight - maxHeight) / 2;

      setSize({ width: maxWidth, height: maxHeight });
      setPosition({ x: centerX, y: centerY });

      setPreMaximizedState(lastWindowState);
    } else if (preMaximizedState) {
      setSize(preMaximizedState.size);
      setPosition(preMaximizedState.position);
    }
  }, [isMaximized]);

  useEffect(() => {
    console.log('Window registration effect - windowId:', windowId);
    if (windowId) {
      registerWindow(windowId);
    } else {
      console.warn('Attempting to register window but windowId is undefined for title:', title);
    }
  }, [windowId, registerWindow, title]);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleDrag = (e, d) => {
    const { innerWidth, innerHeight } = window;
    const threshold = 20;

    if (d.x < threshold) {
      // Snap to left half
      setSize({ width: innerWidth / 2, height: innerHeight });
      setPosition({ x: 0, y: 0 });
    } else if (d.x > innerWidth - threshold) {
      // Snap to right half
      setSize({ width: innerWidth / 2, height: innerHeight });
      setPosition({ x: innerWidth / 2, y: 0 });
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => onClose(), 200);
  };

  const handleClick = () => {
    console.log('Window clicked - windowId:', windowId, 'title:', title);
    if (windowId) {
      bringToFront(windowId);
    } else {
      console.error("windowId is undefined for window title:", title);
    }
  };

  const zIndex = windowStack.indexOf(windowId);

  return (
    <AnimatePresence>
      {isVisible && !isClosing && (
        <motion.div
          className={`${windowClassName} ${windowId}`}
          style={{ zIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
        >
          <Rnd
            size={size}
            position={position}
            onDragStop={(e, d) => {
              setPosition({ x: d.x, y: d.y });
              setWindowPosition(title, {
                position: { x: d.x, y: d.y },
                size
              });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              const newSize = { 
                width: ref.offsetWidth, 
                height: ref.offsetHeight 
              };
              setSize(newSize);
              setPosition(position);
              setWindowPosition(title, {
                position,
                size: newSize
              });
            }}
            bounds="window"
            dragHandleClassName="drag-handle"
          >
            <div className="window-top-bar drag-handle">
              <div className="window-controls">
                <button onClick={onMinimize} className="minimize-button">_</button>
                <button onClick={handleMaximize}>
                  {isMaximized ? "❐" : "[]"}
                </button>
                <button onClick={handleClose}>X</button>
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
