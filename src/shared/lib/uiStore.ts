import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light';

type UIState = {
  mobileDrawerOpen: boolean;
  /** Флаг проигранной typed-анимации логотипа (per session). */
  brandTypedOnce: boolean;
  /** Подложено на будущее — переключение темы. Пока используется только 'dark'. */
  theme: ThemeMode;
};

type UIActions = {
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: () => void;
  markBrandTyped: () => void;
  setTheme: (theme: ThemeMode) => void;
};

export type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        mobileDrawerOpen: false,
        brandTypedOnce: false,
        theme: 'dark',

        openMobileDrawer: () =>
          set({ mobileDrawerOpen: true }, false, 'ui/openMobileDrawer'),
        closeMobileDrawer: () =>
          set({ mobileDrawerOpen: false }, false, 'ui/closeMobileDrawer'),
        toggleMobileDrawer: () =>
          set((s) => ({ mobileDrawerOpen: !s.mobileDrawerOpen }), false, 'ui/toggleMobileDrawer'),
        markBrandTyped: () =>
          set({ brandTypedOnce: true }, false, 'ui/markBrandTyped'),
        setTheme: (theme) => set({ theme }, false, 'ui/setTheme'),
      }),
      {
        name: 'dijex.ui',
        storage: createJSONStorage(() => localStorage),
        // Сохраняем только theme — остальные флаги runtime-only (drawer/brandTyped — сбрасываются на reload).
        partialize: (s) => ({ theme: s.theme }),
        version: 1,
      },
    ),
    { name: 'ui', enabled: import.meta.env.DEV },
  ),
);
