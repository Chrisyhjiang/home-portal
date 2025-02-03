import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import "../styles/Window.css";

interface WindowProps {
  title: string;
  isVisible: boolean;
  onMinimize: () => void;
  onClose: () => void;
  isMaximizedAlready?: boolean;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  title,
  isVisible,
  onMinimize,
  onClose,
  isMaximizedAlready = false,
  children,
}) => {
  // Initial size and position
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 300,
    y: window.innerHeight / 2 - 200,
  });
  const [isMaximized, setIsMaximized] = useState(isMaximizedAlready);
  const [minimized, setMinimized] = useState(false); // New state for minimizing

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

  if (!isVisible || minimized) return null; // Hides window when minimized

  return (
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
          <button onClick={() => setMinimized(true)}>_</button> {/* Minimize */}
          <button onClick={() => setIsMaximized(!isMaximized)}>
            {isMaximized ? "❐" : "[]"}
          </button>
          <button onClick={onClose}>X</button> {/* Close */}
        </div>
        <span className="window-title">{title}</span>
      </div>

      <div className="window-content">{children}</div>
    </Rnd>
  );
};

export default Window;
