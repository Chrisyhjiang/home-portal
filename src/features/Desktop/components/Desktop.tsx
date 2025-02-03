import { useAppStore } from "@hooks/useAppStore";
import Topbar from "@features/Topbar/components/Topbar";
import Dock from "@features/Dock/components/Dock";
import Finder from "@features/Finder/components/Finder";
import Terminal from "@features/Terminal/components/Terminal";
import Window from "@features/Window/components/Window";
import PDFViewer from "@features/PDFViewer/components/PDFViewer";
import { useRef, useEffect } from "react";
import { apps } from "@shared/constants";

export default function Desktop() {
  const { openApps, openApp, closeApp, minimizeApp, restoreApp } = useAppStore();

  // Only log when debugging specific issues
  // console.log("openApps:", openApps); // Remove or comment out this line

  // ✅ Persistent dragRefs that never reset
  const dragRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

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
      // If app exists (whether minimized or not), restore it
      console.log(`[${appName}] Restoring app`);
      restoreApp(appName);
    } else {
      // If app doesn't exist, open it fresh
      console.log(`[${appName}] Opening new app from:`, startPosition);
      openApp(appName, { startPosition });
    }
  };

  return (
    <div className="h-screen w-screen relative flex flex-col overflow-hidden pt-12 pb-20">
      <Topbar />

      <div className="flex-1 relative z-10 p-4">
        {openApps.map(({ appName, filePath, minimized, startPosition }, index) => {
          console.log(`Rendering ${appName}:`, { minimized, startPosition });
          return (
            <div
              key={appName}
              style={{ 
                position: "absolute", 
                zIndex: 20 + index,
                display: minimized ? 'none' : 'block'
              }}
            >
              <Window
                title={appName}
                isVisible={true}
                onClose={() => closeApp(appName)}
                onMinimize={() => handleMinimize(appName)}
              >
                {appName === "Finder" && <Finder />}
                {appName === "Terminal" && <Terminal />}
                {appName === "PDFViewer" && (
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

      <Dock 
        openApp={(appName: string) => {
          const app = openApps.find(a => a.appName === appName);
          console.log(`[${appName}] Dock click - Current state:`, app);
          
          if (app?.minimized) {
            // If app is minimized, restore it with animation
            console.log(`[${appName}] Restoring minimized app`);
            restoreApp(appName, true); // Add a second parameter to indicate restore from dock
          } else if (!app) {
            // If app doesn't exist, open it fresh
            console.log(`[${appName}] Opening new app`);
            const appConfig = apps.find(a => a.name === appName);
            if (appName === "PDFViewer" && appConfig?.defaultFile) {
              openApp(appName, { filePath: appConfig.defaultFile });
            } else {
              openApp(appName);
            }
          }
          // If app exists and isn't minimized, do nothing
        }} 
      />
    </div>
  );
}
