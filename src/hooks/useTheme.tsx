import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark" | "sakura" | "neon" | "forest" | "starry";
export type ThemeCharacter = "none" | "miku";
export type AmbientEffect = "none" | "particles" | "sakura_leaf" | "matrix_grid";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  character: ThemeCharacter;
  setCharacter: (c: ThemeCharacter) => void;
  ambientEffect: AmbientEffect;
  setAmbientEffect: (a: AmbientEffect) => void;
  bgBlur: number;
  setBgBlur: (b: number) => void;
  bgOpacity: number;
  setBgOpacity: (o: number) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [character, setCharacterState] = useState<ThemeCharacter>(() => {
    const saved = localStorage.getItem("theme_char") as ThemeCharacter;
    return saved || "none";
  });

  const [ambientEffect, setAmbientEffectState] = useState<AmbientEffect>(() => {
    const saved = localStorage.getItem("theme_ambient") as AmbientEffect;
    return saved || "particles";
  });

  const [bgBlur, setBgBlurState] = useState<number>(() => {
    const saved = localStorage.getItem("theme_blur");
    return saved ? parseInt(saved, 10) : 4;
  });

  const [bgOpacity, setBgOpacityState] = useState<number>(() => {
    const saved = localStorage.getItem("theme_opacity");
    return saved ? parseInt(saved, 10) : 15;
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  };

  const setCharacter = (c: ThemeCharacter) => {
    setCharacterState(c);
    localStorage.setItem("theme_char", c);
  };

  const setAmbientEffect = (a: AmbientEffect) => {
    setAmbientEffectState(a);
    localStorage.setItem("theme_ambient", a);
  };

  const setBgBlur = (b: number) => {
    setBgBlurState(b);
    localStorage.setItem("theme_blur", b.toString());
  };

  const setBgOpacity = (o: number) => {
    setBgOpacityState(o);
    localStorage.setItem("theme_opacity", o.toString());
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(
      "light",
      "dark",
      "theme-light",
      "theme-dark",
      "theme-sakura",
      "theme-neon",
      "theme-forest",
      "theme-starry"
    );
    
    if (theme === "light" || theme === "sakura" || theme === "forest") {
      root.classList.add("light");
    } else {
      root.classList.add("dark");
    }
    
    root.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // System theme preference listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "sakura", "neon", "forest", "starry"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        character,
        setCharacter,
        ambientEffect,
        setAmbientEffect,
        bgBlur,
        setBgBlur,
        bgOpacity,
        setBgOpacity,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
