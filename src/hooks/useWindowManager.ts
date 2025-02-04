import { create } from 'zustand';

interface WindowState {
  activeWindow: string | null;
  windowStack: string[];
  setActiveWindow: (windowId: string) => void;
  bringToFront: (windowId: string) => void;
  registerWindow: (windowId: string) => void;
}

export const useWindowManager = create<WindowState>((set) => ({
  activeWindow: null,
  windowStack: [],
  setActiveWindow: (windowId: string) => {
    console.log(`Setting active window: ${windowId}`);
    set({ activeWindow: windowId });
  },
  bringToFront: (windowId: string) => {
    console.log(`Bringing window to front: ${windowId}`);
    set((state) => {
      const newStack = [
        ...state.windowStack.filter(id => id !== windowId),
        windowId
      ];
      console.log(`Updated window stack: ${newStack}`);
      return {
        activeWindow: windowId,
        windowStack: newStack
      };
    });
  },
  registerWindow: (windowId: string) => {
    set((state) => ({
      windowStack: state.windowStack.includes(windowId) 
        ? state.windowStack 
        : [...state.windowStack, windowId]
    }));
  }
})); 