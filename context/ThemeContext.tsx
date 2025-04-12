import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from '../hooks/color/useColorScheme';
import { SecureStorage } from '@/class/SecureStorage';
import { tintColors } from '@/constants/Colors';

type ThemeContextType = {
    theme: 'light' | 'dark';
    tint: typeof tintColors[number]['name'];
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setTint: (tint: typeof tintColors[number]['name']) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    SecureStorage.initializeDefaults()

    const systemTheme = useColorScheme() ?? 'light';
    const [theme, setThemeState] = useState<'light' | 'dark'>(systemTheme);
    const [tint, setTint] = useState<typeof tintColors[number]['name']>(tintColors[0].name);

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const prefs = await SecureStorage.get('preferences');
                setThemeState(
                    prefs?.theme === 'system' ? systemTheme :
                        prefs?.theme || systemTheme
                );
                setTint(
                    prefs?.colorScheme || tintColors[0].name
                );
            } catch (e) {
                console.warn(e);
            }
        };
        loadPreferences();
    }, [systemTheme]);

    const setTheme = async (newTheme: 'light' | 'dark' | 'system') => {
        const actualTheme = newTheme === 'system' ? systemTheme : newTheme;
        setThemeState(actualTheme);
        await SecureStorage.modify('preferences', 'theme', newTheme);
    };

    const updateTint = async (newTint: typeof tintColors[number]['name']) => {
        setTint(newTint);
        await SecureStorage.modify('preferences', 'colorScheme', newTint);
    };


    return (
        <ThemeContext.Provider
            value={{ theme, tint, setTheme, setTint: updateTint }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};