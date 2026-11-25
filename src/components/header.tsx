"use client";

import { HOME_PAGE_DATA } from "@/data/HomeData";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface HeaderProps {
  activeLink?: string;
}

export const Header = ({ activeLink }: HeaderProps) => {
  const { navbar } = HOME_PAGE_DATA;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5"
        >
          <Image
            src={navbar.logo}
            alt={`${navbar.brandName} logo`}
            width={32}
            height={32}
            className="rounded-md object-contain"
            priority
          />
          <span className="font-semibold tracking-tight text-sm">
            {navbar.brandName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-muted-foreground">
          {navbar.navLinks.map((item) => {
            const isActive =
              activeLink?.toLowerCase() === item.label.toLowerCase();

            return (
              <Link
                key={`${item.label}-${item.link}`}
                href={item.link}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "text-foreground font-medium"
                    : "hover:text-foreground transition-colors"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-md border border-border bg-card text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Absolute Blurred Overlay Dropdown */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden absolute top-full inset-x-0 z-40 border-b border-border bg-background/85 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg"
        >
          {navbar.navLinks.map((item) => {
            const isActive =
              activeLink?.toLowerCase() === item.label.toLowerCase();

            return (
              <Link
                key={`mobile-${item.label}-${item.link}`}
                href={item.link}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-xs font-mono transition-colors ${
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};
