import React, { useRef } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  MotionValue,
} from "framer-motion";
import { useAppStore } from "@hooks/useAppStore";
import AppIcon from "@shared/components/AppIcon/AppIcon";
import { apps } from "@shared/constants";

const SCALE = 1.75;
const DISTANCE = 70;
const NUDGE = 20;
const SPRING = {
  mass: 0.1,
  stiffness: 170,
  damping: 12,
};

interface Props {
  openApp: (appName: string, startPosition?: { x: number; y: number }) => void;
}

export default function Dock({ openApp }: Props) {
  const mouseLeft = useMotionValue(-Infinity);
  const { openApps, minimizeApp, restoreApp } = useAppStore();

  const handleDockIconClick = (appName: string) => {
    const app = openApps.find(a => a.appName === appName);
    const iconImg = document.querySelector(`img[alt="${appName}"]`);
    const dockIcon = iconImg?.closest('.group');
    
    if (!dockIcon) {
      console.error('Could not find dock icon for:', appName);
      return;
    }

    const dockIconRect = dockIcon.getBoundingClientRect();
    const startPosition = {
      x: dockIconRect.left,
      y: dockIconRect.top
    };

    if (app) {
      if (app.minimized) {
        // If app is minimized, restore it
        restoreApp(appName);
      }
      // If app is already open and not minimized, do nothing
    } else {
      // If app isn't open at all, open it with starting position
      openApp(appName, { startPosition });
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-4 bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-lg z-50"
      onMouseMove={(e) => {
        const { left } = e.currentTarget.getBoundingClientRect();
        mouseLeft.set(e.clientX - left);
      }}
      onMouseLeave={() => mouseLeft.set(-Infinity)}
    >
      {apps.map((app) => {
        const isRunning = openApps.some((a) => a.appName === app.name);
        const isMinimized = openApps.some(
          (a) => a.appName === app.name && a.minimized
        );

        return (
          <DockItem
            key={app.name}
            app={app}
            openApp={() => handleDockIconClick(app.name)}
            mouseLeft={mouseLeft}
          />
        );
      })}
    </motion.div>
  );
}

interface DockItemProps {
  app: { 
    name: string; 
    icon: string; 
    link?: string;
    defaultFile?: string;
  };
  openApp: () => void;
  mouseLeft: MotionValue<number>;
}

function DockItem({ app, openApp, mouseLeft }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { openApps } = useAppStore();
  const isMinimized = openApps.some(
    a => a.appName === app.name && a.minimized
  );

  const distance = useTransform(() => {
    const bounds = ref.current
      ? { x: ref.current.offsetLeft, w: ref.current.offsetWidth }
      : { x: 0, w: 0 };
    return mouseLeft.get() - bounds.x - bounds.w / 2;
  });

  const scale = useTransform(distance, [-DISTANCE, 0, DISTANCE], [1, SCALE, 1]);
  const scaleSpring = useSpring(scale, SPRING);

  const x = useTransform(() => {
    const d = distance.get();
    if (d === -Infinity) return 0;
    if (Math.abs(d) > DISTANCE) return Math.sign(d) * -1 * NUDGE;
    return (-d / DISTANCE) * NUDGE * scale.get();
  });
  const xSpring = useSpring(x, SPRING);
  const y = useMotionValue(0);

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.div
            ref={ref}
            style={{ x: xSpring, scale: scaleSpring, y }}
            className={`group relative flex flex-col items-center ${isMinimized ? 'minimized' : ''}`}
            onClick={() => {
              animate(y, [0, -20, 0], {
                repeat: 2,
                duration: 0.7,
                ease: "easeInOut",
              });
              openApp();
            }}
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-800 shadow-md border border-gray-300 overflow-hidden">
              <motion.img
                src={app.icon}
                className="w-12 h-12 object-cover rounded-full"
                alt={app.name}
              />
            </div>

            {/* Label Above Icon (only visible on hover) */}
            <span className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              {app.name}
            </span>

            {/* Add a dot indicator for minimized windows */}
            {isMinimized && (
              <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
            )}
          </motion.div>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={8}
            className="bg-gray-700 px-2 py-1.5 text-sm rounded text-white border border-gray-600 shadow"
          >
            {app.name}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
