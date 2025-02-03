import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion, animate } from "framer-motion";
import { useAppStore } from "@hooks/useAppStore";
import "../styles/Window.css";

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
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 300,
    y: window.innerHeight / 2 - 200,
  });
  const [isMaximized, setIsMaximized] = useState(isMaximizedAlready);
  const { minimizeApp, openApps } = useAppStore();

  const appData = openApps.find((app) => app.appName === title);

  useEffect(() => {
    if (isMaximized) {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    } else {
      setSize({ width: 600, height: 400 });
      setPosition({
        x: window.innerWidth / 2 - 300,
        y: window.innerHeight / 2 - 200,
      });
    }
  }, [isMaximized]);

  if (!isVisible || appData?.minimized) return null;

  return (
    <motion.div
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Rnd
        size={size}
        position={position}
        bounds="window"
        className="window-rnd"
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
              onClick={() => {
                animate(
                  ".window-rnd",
                  { scale: 0, opacity: 0 },
                  { duration: 0.2 }
                ).then(() => minimizeApp(title));
              }}
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
  );
};

export default Window;
