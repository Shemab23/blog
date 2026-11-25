"use client";

import { BlogEntry } from "@/data/BlogRegistry";
import { MaterialEntry } from "@/data/MaterialRegistry";
import { TutorialEntry } from "@/data/TutorialRegistry";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type Theme = "light" | "dark"[number];

export interface AppContextType {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  blogs: BlogEntry[];
  FeaturedTags: string[];
  tutorials: TutorialEntry[];
  materials: MaterialEntry[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside an AppProvider");
  return context;
}
