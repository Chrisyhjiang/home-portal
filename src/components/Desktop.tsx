import { useAppStore } from "../store/useAppStore";
import Topbar from "./Topbar";
import Dock from "./Dock";
import Finder from "./Finder";
import Terminal from "./Terminal";
import Window from "./Window";
import PDFViewer from "./PDFViewer";
import { useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
import "../styles/mac_background.css";

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
        {openApps.map(({ appName, filePath }, index) => {
          // ✅ Ensure a ref exists before rendering
          if (!dragRefs.current[appName]) {
            dragRefs.current[appName] = { current: null };
          }

          return (
            <Draggable key={appName} nodeRef={dragRefs.current[appName]}>
              <motion.div
                ref={dragRefs.current[appName]}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute ${
                  appName === "PDFViewer" ? "w-[80vw] h-[80vh]" : "w-80 h-96"
                } bg-gray-700 rounded-lg shadow-lg flex flex-col backdrop-blur-xl border border-gray-600`}
                style={{ zIndex: 20 + index }}
              >
                <Window appName={appName} closeApp={() => closeApp(appName)}>
                  {appName === "Finder" && <Finder />}
                  {appName === "Terminal" && <Terminal />}
                  {appName === "PDFViewer" && <PDFViewer filePath={filePath} />}
                </Window>
              </motion.div>
            </Draggable>
          );
        })}
      </div>

      <Dock openApp={openApp} />
    </div>
  );
}
