import { create } from "zustand";

interface WindowPosition {
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface AppState {
  openApps: {
    appName: string;
    minimized: boolean;
    lastPosition?: WindowPosition;
    filePath?: string;
  }[];
  openApp: (appName: string, options?: { iconPreview?: string }) => void;
  minimizeApp: (appName: string) => void;
  restoreApp: (appName: string) => void;
  closeApp: (appName: string) => void;
  setWindowPosition: (appName: string, position: WindowPosition) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  openApps: [],

  openApp: (appName, options) =>
    set((state) => {
      const existingApp = state.openApps.find((app) => app.appName === appName);
      if (existingApp) {
        return {
          openApps: state.openApps.map((app) =>
            app.appName === appName ? { ...app, minimized: false } : app
          ),
        };
      }
      return {
        openApps: [
          ...state.openApps,
          { appName, minimized: false, ...options },
        ],
      };
    }),

  minimizeApp: (appName) =>
    set((state) => ({
      openApps: state.openApps.map((app) =>
        app.appName === appName ? { ...app, minimized: true } : app
      ),
    })),

  restoreApp: (appName) =>
    set((state) => ({
      openApps: state.openApps.map((app) =>
        app.appName === appName ? { ...app, minimized: false } : app
      ),
    })),

  closeApp: (appName) =>
    set((state) => ({
      openApps: state.openApps.filter((app) => app.appName !== appName),
    })),

  setWindowPosition: (appName, position) => 
    set(state => ({
      openApps: state.openApps.map(app => 
        app.appName === appName 
          ? { ...app, lastPosition: position }
          : app
      )
    })),
}));
