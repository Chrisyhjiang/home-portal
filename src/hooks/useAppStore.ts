import { create } from "zustand";

interface AppState {
  openApps: { appName: string; filePath?: string }[];
  openApp: (appName: string, options?: { filePath?: string }) => void;
  closeApp: (appName: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  openApps: [],
  openApp: (appName, options) =>
    set((state) => {
      // If already open, do not add again.
      if (state.openApps.find((app) => app.appName === appName)) {
        return state;
      }
      return { openApps: [...state.openApps, { appName, ...options }] };
    }),
  closeApp: (appName) =>
    set((state) => ({
      openApps: state.openApps.filter((app) => app.appName !== appName),
    })),
}));
