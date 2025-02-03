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
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isMaximized, setIsMaximized] = useState(isMaximizedAlready);
  const { openApps, setWindowPosition } = useAppStore();
  const windowClassName = `window-rnd-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (title === "PDFViewer") {
      setSize({ width: 900, height: 1100 });
    }

    const app = openApps.find(a => a.appName === title);
    if (app?.startPosition) {
      setPosition(app.startPosition);
      setIsAnimating(true);
      handleOpenAnimation(app.startPosition);
    } else if (app?.lastPosition) {
      setPosition(app.lastPosition.position);
      setSize(app.lastPosition.size);
    }
  }, [title]);

  const handleOpenAnimation = async (startPos: { x: number; y: number }) => {
    const targetPosition = { x: 20, y: 20 };

    try {
      const rndElement = document.querySelector(`.${windowClassName}`);
      if (!rndElement) return;

      rndElement.style.transformOrigin = 'center center';
      setPosition({ x: 0, y: 0 });

      await animate(
        rndElement,
        {
          scale: [0.1, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
          x: [
            startPos.x,
            startPos.x + (targetPosition.x - startPos.x) * 0.1,
            startPos.x + (targetPosition.x - startPos.x) * 0.3,
            startPos.x + (targetPosition.x - startPos.x) * 0.5,
            startPos.x + (targetPosition.x - startPos.x) * 0.7,
            startPos.x + (targetPosition.x - startPos.x) * 0.9,
            targetPosition.x
          ],
          y: [
            startPos.y,
            startPos.y - 40,
            startPos.y - 30,
            targetPosition.y + 40,
            targetPosition.y + 20,
            targetPosition.y + 5,
            targetPosition.y
          ]
        },
        {
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1],
          times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]
        }
      );

      requestAnimationFrame(() => {
        setPosition(targetPosition);
        setWindowPosition(title, {
          position: targetPosition,
          size
        });
      });
    } catch (error) {
      console.error('Animation failed:', error);
      setPosition(targetPosition);
    } finally {
      setIsAnimating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={windowClassName}>
      <Rnd
        size={size}
        position={position}
        bounds="window"
        dragHandleClassName="drag-handle"
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
      >
        <div className="window-top-bar drag-handle">
          <div className="window-controls">
            <button onClick={onMinimize} className="minimize-button">_</button>
            <button onClick={() => setIsMaximized(!isMaximized)}>
              {isMaximized ? "❐" : "[]"}
            </button>
            <button onClick={onClose}>X</button>
          </div>
          <span className="window-title">{title}</span>
        </div>
        <div className="window-content">{children}</div>
      </Rnd>
    </div>
  );
};

export default Window;
