import { motion } from "framer-motion";
import AppIcon from "./AppIcon";
import { apps } from "../constants";

interface DockProps {
  openApp: (app: string) => void;
}

export default function Dock({ openApp }: DockProps) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center z-50">
      <div className="flex gap-4 bg-gray-800/80 backdrop-blur-md p-3 rounded-2xl flex-row items-end shadow-lg">
        {apps.map((app, index) => (
          <motion.div
            key={app.name}
            whileHover={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {app.link ? (
              <a href={app.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={app.icon}
                  className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
                  alt={app.name}
                />
              </a>
            ) : (
              <AppIcon
                name={app.name}
                icon={app.icon}
                onClick={() => openApp(app.name)}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
