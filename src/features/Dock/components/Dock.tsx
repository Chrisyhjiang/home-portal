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

export default function Dock() {
  const mouseLeft = useMotionValue(-Infinity);
  const { openApps, openApp, restoreApp } = useAppStore();

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-4 bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-lg z-50"
      onMouseMove={(e) => {
        const { left, right } = e.currentTarget.getBoundingClientRect();
        mouseLeft.set(e.clientX - left);
      }}
      onMouseLeave={() => mouseLeft.set(-Infinity)}
    >
      {/* Regular Apps */}
      {apps.map((app) => {
        const isRunning = openApps.some((a) => a.appName === app.name);
        const isMinimized = openApps.some(
          (a) => a.appName === app.name && a.minimized
        );

        return (
          <DockItem
            key={app.name}
            app={app}
            openApp={() => {
              if (isMinimized) {
                restoreApp(app.name);
                animate(
                  ".window-rnd",
                  { scale: 1, opacity: 1 },
                  { duration: 0.2 }
                );
              } else if (!isRunning) {
                openApp(app.name);
              }
            }}
            mouseLeft={mouseLeft}
          />
        );
      })}
    </motion.div>
  );
}

interface DockItemProps {
  app: { name: string; icon: string; link?: string };
  openApp: () => void;
  mouseLeft: MotionValue<number>;
}

function DockItem({ app, openApp, mouseLeft }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

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
            className="group relative flex flex-col items-center"
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
