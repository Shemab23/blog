"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AppContext, Theme } from "./AppContext";
import { BLOG_REGISTRY, FeaturedTags } from "@/data/BlogRegistry";
import { TUTORIAL_REGISTRY } from "@/data/TutorialRegistry";
import { MATERIAL_REGISTRY } from "@/data/MaterialRegistry";

import "@/data/notes/DartCourse";
import "@/data/tutorials/pythonSetupWalkthorough";
import "@/data/materials/cleanArchitectureNotes";

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      blogs: BLOG_REGISTRY,
      FeaturedTags,
      tutorials: TUTORIAL_REGISTRY,
      materials: MATERIAL_REGISTRY,
    }),
    [theme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
