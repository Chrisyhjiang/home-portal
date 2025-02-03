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

  console.log("openApps:", openApps); // ✅ Debugging

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

  return (
    <div className="h-screen w-screen relative flex flex-col overflow-hidden pt-12 pb-20">
      <Topbar />

      <div className="flex-1 relative z-10 p-4">
        {openApps.map(({ appName, filePath, minimized }, index) => (
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
        ))}
      </div>

      <Dock 
        openApp={(appName: string) => {
          const app = openApps.find(a => a.appName === appName);
          if (app?.minimized) {
            // Restore minimized app
            restoreApp(appName);
          } else if (!app) {
            // Open new app only if it's not already open
            // Special handling for PDFViewer to include default file
            const appConfig = apps.find(a => a.name === appName);
            if (appName === "PDFViewer" && appConfig?.defaultFile) {
              openApp(appName, { filePath: appConfig.defaultFile });
            } else {
              openApp(appName);
            }
          }
        }} 
      />
    </div>
  );
}
