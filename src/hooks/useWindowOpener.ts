import { useAppStore } from "./useAppStore";
import { apps } from "@shared/constants";

export const useWindowOpener = () => {
  const { openApps, openApp, restoreApp, minimizeApp } = useAppStore();

  const openOrRestoreWindow = (appName: string, options?: { filePath?: string }) => {
    if (appName === "GitHub") {
      // Open GitHub profile in a new tab
      window.open("https://github.com/Chrisyhjiang", "_blank", "noopener,noreferrer");
      return;
    }

    const openedApp = openApps.find(a => a.appName === appName);
    
    if (openedApp) {
      if (openedApp.minimized) {
        console.log(`[${appName}] Restoring minimized app`);
        restoreApp(appName);
      } else {
        console.log(`[${appName}] App already open`);
      }
    } else {
      console.log(`[${appName}] Opening new app`);
      // Correct center position calculation
      const startPosition = {
        x: (window.innerWidth - 600) / 2, // Center horizontally (assuming 600px width)
        y: (window.innerHeight - 400) / 2 // Center vertically (assuming 400px height)
      };
      
      // Check for default file if it's PDFViewer
      const appConfig = apps.find(a => a.name === appName);
      const finalOptions = {
        ...options,
        startPosition,
        ...(appName === "PDFViewer" && appConfig?.defaultFile ? { filePath: appConfig.defaultFile } : {})
      };

      openApp(appName, finalOptions);
    }
  };

  return { openOrRestoreWindow };
}; 