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
  // Initial size: 600x400 and initial position: centered based on window dimensions.
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 300,
    y: window.innerHeight / 2 - 200,
  });
  const [isMaximized, setIsMaximized] = useState(isMaximizedAlready);

  useEffect(() => {
    if (isMaximized) {
      // When maximized, adjust size and position accordingly.
      setSize({ width: 1280, height: 800 });
      setPosition({
        x: window.innerWidth / 2 - 640,
        y: window.innerHeight / 2 - 400,
      });
    } else {
      // Restore to the default size and position.
      setSize({ width: 600, height: 400 });
      setPosition({
        x: window.innerWidth / 2 - 300,
        y: window.innerHeight / 2 - 200,
      });
    }
  }, [isMaximized]);

  const handleMinimize = () => onMinimize();
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };
  const handleClose = () => onClose();

  if (!isVisible) return null;

  return (
    <div className="window-container">
      <Rnd
        // Use the controlled size and position.
        size={size}
        position={position}
        onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, newPosition) => {
          setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
          setPosition(newPosition);
        }}
        minWidth={300}
        minHeight={200}
        // **Key change:** Set bounds to "window" so that the coordinate space matches window.innerWidth/innerHeight.
        bounds="window"
        dragHandleClassName="drag-handle"
        className="window-rnd"
        style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)" }}
      >
        <div className="window-top-bar drag-handle">
          <span>{title}</span>
          <div className="window-controls">
            <button onClick={handleMinimize}>_</button>
            <button onClick={handleMaximize}>{isMaximized ? "❐" : "[]"}</button>
            <button onClick={handleClose}>X</button>
          </div>
        </div>
        <div className="window-content">{children}</div>
      </Rnd>
    </div>
  );
};

export default Window;
