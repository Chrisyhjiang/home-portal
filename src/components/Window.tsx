import { motion } from "framer-motion";
import Draggable from "react-draggable";
import { useRef, useEffect, useState } from "react";

interface WindowProps {
  appName: string;
  closeApp: () => void;
  children: React.ReactNode;
}

export default function Window({ appName, closeApp, children }: WindowProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 500, height: 400 }); // Default size
  const [isResizing, setIsResizing] = useState(false);

  // Calculate the center position dynamically
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    setDefaultPosition({
      x: screenWidth / 2 - 250, // Center horizontally
      y: screenHeight / 2 - 200, // Center vertically
    });
  }, []);

  // Handle window resizing
  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
      setSize({
        width: Math.max(newWidth, 300), // Minimum width
        height: Math.max(newHeight, 200), // Minimum height
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds="parent"
      defaultPosition={defaultPosition}
    >
      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bg-gray-700 rounded-lg shadow-lg flex flex-col"
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        {/* Window header with drag handle */}
        <div className="bg-gray-600 p-2 flex justify-between text-white drag-handle">
          <span>{appName}</span>
          <button onClick={closeApp} className="text-red-500">
            ⨉
          </button>
        </div>

        {/* Window content */}
        <div className="flex-1 flex items-center justify-center text-white overflow-hidden">
          {children}
        </div>

        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-600"
          onMouseDown={(e) => {
            setIsResizing(true);
            handleResize(e);
          }}
        />
      </motion.div>
    </Draggable>
  );
}
