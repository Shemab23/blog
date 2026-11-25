"use client";

import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const context = useContext(AppContext);

  if (!context) return null;

  const { theme, setTheme } = context;

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="fixed bottom-4 right-4 z-50 border border-border bg-card shadow-md"
    >
      <Sun className="h-5 w-5 hidden dark:block" />
      <Moon className="h-5 w-5 block dark:hidden" />
    </Button>
  );
}
