import { motion } from "framer-motion";
import Draggable from "react-draggable";
import { useRef, useEffect } from "react";

interface WindowProps {
  appName: string;
  closeApp: () => void;
  children: React.ReactNode;
}

export default function Window({ appName, closeApp, children }: WindowProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null); // ✅ Define nodeRef persistently

  useEffect(() => {
    console.log(`Window mounted for: ${appName}`);
    return () => console.log(`Window unmounted for: ${appName}`);
  }, [appName]);

  return (
    <Draggable nodeRef={nodeRef}>
      <motion.div
        ref={nodeRef} // ✅ Attach nodeRef correctly
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute w-64 h-40 bg-gray-700 rounded-lg shadow-lg flex flex-col"
      >
        <div className="bg-gray-600 p-2 flex justify-between text-white">
          <span>{appName}</span>
          <button onClick={closeApp} className="text-red-500">
            ⨉
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-white">
          {children}
        </div>
      </motion.div>
    </Draggable>
  );
}
