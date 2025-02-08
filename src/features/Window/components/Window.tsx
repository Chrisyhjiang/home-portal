import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Window.css";
import { useWindowManager } from "../../../hooks/useWindowManager";

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
    y: (window.innerHeight - 400) / 2,
  },
  windowId,
}) => {
  console.log(
    "Window component initialized with windowId:",
    windowId,
    "and title:",
    title
  );

  const [size, setSize] = useState(() => {
    if (title === "Resume") {
      return {
        width: Math.min(window.innerWidth * 0.6, 900),
        height: Math.min(window.innerHeight * 0.6, 800),
      };
    }
    return { width: 600, height: 400 };
  });
  const [position, setPosition] = useState(startPosition);
  const [isMaximized, setIsMaximized] = useState(isMaximizedAlready);
  const windowClassName = `window-rnd-${title
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
  const [isAnimating] = useState(false);
  const [preMaximizedState, setPreMaximizedState] = useState<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { bringToFront, windowStack, registerWindow } = useWindowManager();

  useEffect(() => {
    if (title === "Resume") {
      const width = isMaximized
        ? Math.min(window.innerWidth * 0.8, 1200)
        : Math.min(window.innerWidth * 0.6, 900);

      const height = isMaximized
        ? Math.min(window.innerHeight * 0.8, 1000)
        : Math.min(window.innerHeight * 0.6, 800);

      setSize({ width, height });
      setPosition({
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2,
      });
    }
  }, [isMaximized, title]);

  useEffect(() => {
    if (isMaximized) {
      const lastWindowState = {
        position,
        size,
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
    console.log("Window registration effect - windowId:", windowId);
    if (windowId) {
      registerWindow(windowId);
    } else {
      console.warn(
        "Attempting to register window but windowId is undefined for title:",
        title
      );
    }
  }, [windowId, registerWindow, title]);

  const handleMaximize = () => {
    if (isMaximized) {
      // When un-maximizing, restore to previous size and position
      if (preMaximizedState) {
        setSize(preMaximizedState.size);
        setPosition(preMaximizedState.position);
      }
    } else {
      // When maximizing, save current state and set new size
      setPreMaximizedState({
        position,
        size,
      });
      const width = window.innerWidth * 0.8;
      const height = window.innerHeight * 0.8;
      setSize({ width, height });
      setPosition({
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2,
      });
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => onClose(), 200);
  };

  const handleClick = () => {
    console.log("Window clicked - windowId:", windowId, "title:", title);
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
        >
          <Rnd
            size={size}
            position={position}
            onDragStop={(_, d) => {
              // Ensure the window doesn't go above the topbar
              const y = Math.max(5, d.y);
              setPosition({ x: d.x, y });
            }}
            bounds="window"
            onResizeStop={(_, __, ref, ___, position) => {
              setSize({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              });
              // Ensure position stays within bounds after resize
              const y = Math.max(5, position.y);
              setPosition({ x: position.x, y });
            }}
            dragHandleClassName="window-top-bar"
            minWidth={300}
            minHeight={200}
            disableDragging={false}
            enableResizing={true}
            className={`${windowClassName} ${windowId}`}
            style={{
              zIndex,
              transition: isAnimating ? "width 0.3s, height 0.3s" : "none",
            }}
          >
            <div
              className={`window-container ${isMaximized ? "maximized" : ""}`}
            >
              <div className="window-top-bar">
                <div className="window-controls">
                  <button onClick={onMinimize} className="minimize-button">
                    _
                  </button>
                  <button onClick={handleMaximize}>
                    {isMaximized ? "❐" : "[]"}
                  </button>
                  <button onClick={handleClose}>X</button>
                </div>
                <span className="window-title">{title}</span>
              </div>
              <div
                className="window-content"
                style={{ height: "calc(100% - 30px)" }}
              >
                {children}
              </div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Window;
