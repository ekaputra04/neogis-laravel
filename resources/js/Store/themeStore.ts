import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: "system",

            toggleTheme: () => {
                const current = get().theme;
                const next =
                    current === "light"
                        ? "dark"
                        : current === "dark"
                        ? "light"
                        : "light";
                set({ theme: next });
            },

            setTheme: (theme) => set({ theme }),
        }),
        {
            name: "theme-storage",
        }
    )
);
