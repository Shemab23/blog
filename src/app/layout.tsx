import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppProvider";
import { ThemeToggle } from "@/components/ToggleTheme";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Shema docs",
  description:
    "A living archive of technical notes, video walkthroughs, and study materials built from first principles.",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const showThemeToggle =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_THEME_TOGGLE === "true";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>
          {showThemeToggle && <ThemeToggle />}
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
