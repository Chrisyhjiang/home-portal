import { useAppStore } from "@hooks/useAppStore";
import Topbar from "@features/Topbar/components/Topbar";
import Dock from "@features/Dock/components/Dock";
import Finder from "@features/Finder/components/Finder";
import Terminal from "@features/Terminal/components/Terminal";
import Window from "@features/Window/components/Window";
import PDFViewer from "@features/PDFViewer/components/PDFViewer";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function Desktop() {
  const { openApps, openApp, closeApp } = useAppStore();

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

  return (
    <div className="h-screen w-screen relative flex flex-col overflow-hidden pt-12 pb-20">
      <Topbar />

      <div className="flex-1 relative z-10 p-4">
        {openApps.map(({ appName, filePath }, index) => (
          <div
            key={appName}
            // Use absolute positioning with a z-index based on the index
            style={{ position: "absolute", zIndex: 20 + index }}
          >
            <Window
              title={appName}
              isVisible={true}
              closeApp={() => closeApp(appName)}
              onMinimize={() => {
                /* add minimize logic if needed */
              }}
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

      <Dock openApp={openApp} />
    </div>
  );
}
