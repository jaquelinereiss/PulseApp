import { createContext, useContext, useState } from "react";
import { lightTheme } from "../theme/light";
import { darkTheme } from "../theme/dark";

type ThemeType = 'light' | 'dark';

const ThemeContext = createContext({} as any);

export function ThemeProvider ({ children }: {children: React.ReactNode}) {
    const [theme, setTheme] = useState<ThemeType>('light');

    const toggleTheme = () =>
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{theme, currentTheme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);