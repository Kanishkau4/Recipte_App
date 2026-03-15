import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES } from "../constants/colors";

const THEME_STORAGE_KEY = "@recipe_app_theme";

const ThemeContext = createContext({
    themeName: "purple",
    colors: THEMES.purple,
    setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState("purple");

    // Load persisted theme on mount
    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY)
            .then((saved) => {
                if (saved && THEMES[saved]) {
                    setThemeName(saved);
                }
            })
            .catch(() => {});
    }, []);

    const setTheme = async (name) => {
        if (!THEMES[name]) return;
        setThemeName(name);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
        } catch (_) {}
    };

    return (
        <ThemeContext.Provider value={{ themeName, colors: THEMES[themeName], setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
