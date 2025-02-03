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
    startPosition?: { x: number; y: number };
    filePath?: string;
  }[];
  openApp: (appName: string, options?: { filePath?: string; startPosition?: { x: number; y: number } }) => void;
  minimizeApp: (appName: string) => void;
  restoreApp: (appName: string) => void;
  closeApp: (appName: string) => void;
  setWindowPosition: (appName: string, position: WindowPosition) => void;
  completeRestore: (appName: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  openApps: [],

  openApp: (appName: string, options?: { filePath?: string; startPosition?: { x: number; y: number } }) => {
    console.log(`[${appName}] Opening app with options:`, options);
    set((state) => ({
      openApps: [
        ...state.openApps,
        { 
          appName, 
          minimized: false,
          startPosition: options?.startPosition,
          ...options 
        }
      ],
    }));
  },

  minimizeApp: (appName: string) =>
    set((state) => ({
      openApps: state.openApps.map((app) =>
        app.appName === appName
          ? { ...app, minimized: true }
          : app
      ),
    })),

  restoreApp: (appName: string) => {
    console.log(`[${appName}] Restoring app`);
    set((state) => ({
      openApps: state.openApps.map((app) =>
        app.appName === appName
          ? { ...app, minimized: false }
          : app
      ),
    }));
  },

  completeRestore: (appName: string) =>
    set((state) => ({
      openApps: state.openApps.map((app) =>
        app.appName === appName
          ? { ...app, minimized: false }
          : app
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
