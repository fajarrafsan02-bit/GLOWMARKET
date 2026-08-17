import { useEffect } from "react";

const THEME_KEY = "theme";

export const getStoredTheme = () => "light"; // Always light

export const getSystemTheme = () => "light"; // Always light

export const getInitialTheme = () => "light"; // Always light

export const applyTheme = () => {
    document.documentElement.classList.remove("dark"); // Force remove dark class
};

export const setTheme = () => {
    localStorage.setItem(THEME_KEY, "light");
    applyTheme("light");
};

export const initTheme = () => applyTheme("light");

export function useTheme() {
    useEffect(() => {
        applyTheme("light");
    }, []);

    const toggle = () => {
        // Do nothing, theme is fixed to light
    };

    return { theme: "light", isDark: false, toggle };
}

export default {
    getStoredTheme,
    getSystemTheme,
    getInitialTheme,
    applyTheme,
    setTheme,
    initTheme,
    useTheme,
};
