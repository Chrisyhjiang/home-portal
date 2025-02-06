import { create } from "zustand";
import { apps } from "@shared/constants";

interface WindowPosition {
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DesktopIconState {
  position: { x: number; y: number };
  app: string;
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
  desktopIcons: DesktopIconState[];
  updateIconPosition: (appName: string, position: { x: number; y: number }) => void;
  initializeDesktopIcons: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  openApps: [],
  desktopIcons: [],

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

  updateIconPosition: (appName, position) =>
    set((state) => ({
      desktopIcons: state.desktopIcons.map((icon) =>
        icon.app === appName ? { ...icon, position } : icon
      ),
    })),

  initializeDesktopIcons: () => {
    const initialIcons = apps.map((app, index) => ({
      app: app.name,
      position: {
        x: 20,
        y: 20 + (index * 150)
      }
    }));
    
    set({ desktopIcons: initialIcons });
  },
}));
