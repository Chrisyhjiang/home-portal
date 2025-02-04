import { useAppStore } from "@hooks/useAppStore";
import Topbar from "@features/Topbar/components/Topbar";
import Dock from "@features/Dock/components/Dock";
import Finder from "@features/Finder/components/Finder";
import Terminal from "@features/Terminal/components/Terminal";
import Window from "@features/Window/components/Window";
import PDFViewer from "@features/PDFViewer/components/PDFViewer";
import { useRef, useEffect } from "react";
import { apps } from "@shared/constants";
import React from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { PanInfo } from "framer-motion";
import AppIcon from "@shared/components/AppIcon/AppIcon";
import { Rnd } from "react-rnd";
import { useWindowOpener } from "@hooks/useWindowOpener";
import { useWindowManager } from "@hooks/useWindowManager";

interface DesktopIconProps {
  app: {
    name: string;
    icon: string;
    position?: { x: number; y: number };
  };
  onOpen: () => void;
  onDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  app,
  onOpen,
  onDragEnd,
}) => {
  const { desktopIcons, updateIconPosition } = useAppStore();
  const iconState = desktopIcons.find((icon) => icon.app === app.name);

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    updateIconPosition(app.name, newPosition);
    onDragEnd(e, { point: newPosition });
  };

  return (
    <Rnd
      position={{
        x: iconState?.position.x ?? 20,
        y: iconState?.position.y ?? 20,
      }}
      size={{ width: 80, height: 80 }}
      onDragStop={handleDragStop}
      enableResizing={false}
      bounds="parent"
    >
      <div
        className="desktop-icon flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 group cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          console.log("Icon clicked:", app.name);
          onOpen();
        }}
      >
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-800 shadow-md border border-gray-300 overflow-hidden">
          <AppIcon
            icon={app.icon}
            name={app.name}
            className="w-12 h-12 object-cover rounded-full"
          />
        </div>
        <span
          className="text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          {app.name}
        </span>
      </div>
    </Rnd>
  );
};

export default function Desktop() {
  const {
    openApps,
    openApp,
    closeApp,
    minimizeApp,
    restoreApp,
    desktopIcons,
    updateIconPosition,
    initializeDesktopIcons,
  } = useAppStore();

  const dragRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
  const { openOrRestoreWindow } = useWindowOpener();
  const { windowStack } = useWindowManager();

  // Initialize desktop icons if empty
  useEffect(() => {
    if (desktopIcons.length === 0) {
      initializeDesktopIcons();
    }
  }, [desktopIcons.length, initializeDesktopIcons]);

  // ✅ Ensure refs exist for all openApps (without reinitializing on every render)
  useEffect(() => {
    openApps.forEach(({ appName }) => {
      if (!dragRefs.current[appName]) {
        dragRefs.current[appName] = { current: null };
      }
    });
  }, [openApps]);

  const handleMinimize = (appName: string) => {
    minimizeApp(appName);
  };

  const handleDockIconClick = (appName: string) => {
    const app = openApps.find((a) => a.appName === appName);

    if (app) {
      if (app.minimized) {
        // If app is minimized, restore it
        console.log(`[${appName}] Restoring minimized app`);
        restoreApp(appName);
      }
      // If app is already open and not minimized, do nothing
    } else {
      // If app isn't open at all, open it
      console.log(`[${appName}] Opening new app`);
      const appConfig = apps.find((a) => a.name === appName);
      if (appName === "Resume" && appConfig?.defaultFile) {
        openApp(appName, { filePath: appConfig.defaultFile });
      } else {
        openApp(appName);
      }
    }
  };

  // Update the desktop icon click handler
  const handleDesktopIconClick = (app: { name: string; icon: string }) => {
    console.log("Desktop icon clicked:", app.name);
    openOrRestoreWindow(app.name);
  };

  const handleGitHubClick = () => {
    window.open(
      "https://github.com/Chrisyhjiang",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      className="h-screen w-screen relative flex flex-col overflow-hidden pt-12 pb-20"
      onClick={(e) => console.log("Desktop clicked")}
    >
      <Topbar />

      {/* Desktop Icons Layer */}
      <div
        className="absolute inset-0 pt-12 z-10"
        onClick={(e) => console.log("Icons container clicked")}
      >
        <div
          className="relative w-full h-full"
          onClick={(e) => console.log("Inner icons container clicked")}
        >
          {apps.map((app) => (
            <DesktopIcon
              key={app.name}
              app={app}
              onOpen={() => openOrRestoreWindow(app.name)}
              onDragEnd={(event, info) =>
                updateIconPosition(app.name, {
                  x: info.point.x,
                  y: info.point.y,
                })
              }
            />
          ))}
          {/* GitHub Icon */}
        </div>
      </div>

      {/* Windows Layer */}
      {openApps.length > 0 && (
        <div className="relative z-30">
          {openApps.map(({ appName, filePath, minimized, startPosition }) => {
            const initialPosition = startPosition || {
              x: window.innerWidth / 2 - 300,
              y: window.innerHeight / 2 - 200,
            };

            // Calculate z-index based on window stack position
            const zIndex = windowStack.indexOf(appName);
            const baseZIndex = 30;
            const calculatedZIndex =
              zIndex === -1 ? baseZIndex : baseZIndex + zIndex;

            return (
              <div
                key={appName}
                style={{
                  position: "absolute",
                  zIndex: calculatedZIndex,
                  display: minimized ? "none" : "block",
                }}
              >
                <Window
                  title={appName}
                  isVisible={true}
                  onClose={() => closeApp(appName)}
                  onMinimize={() => handleMinimize(appName)}
                  startPosition={initialPosition}
                  windowId={appName}
                >
                  {appName === "Finder" && <Finder />}
                  {appName === "Terminal" && <Terminal />}
                  {appName === "Resume" && (
                    <PDFViewer
                      filePath={filePath}
                      onClose={() => closeApp(appName)}
                    />
                  )}
                </Window>
              </div>
            );
          })}
        </div>
      )}

      {/* Dock - Topmost layer */}
      <div className="z-40">
        <Dock openApp={handleDockIconClick} />
      </div>
    </div>
  );
}
