"use client";

import { AppContext } from "@/context/AppContext";
import { HOME_PAGE_DATA } from "@/data/HomeData";
import Link from "next/link";
import React, { useContext } from "react";

export const Hero = () => {
  const { hero } = HOME_PAGE_DATA;
  const context = useContext(AppContext);

  const notesCount = context?.blogs.length ?? 0;
  const tutorialsCount = context?.tutorials.length ?? 0;
  const materialsCount = context?.materials.length ?? 0;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Title, Subtitle & Action Buttons */}
      <div className="lg:col-span-8 space-y-5">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {hero.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            {hero.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href={hero.primaryCta.href}
            className="px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-xs font-mono font-medium hover:opacity-90 transition-opacity"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="px-4 py-2.5 rounded-md border border-border bg-card text-foreground text-xs font-mono font-medium hover:bg-muted/60 transition-colors"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* Right Column: High-Level Platform Metrics Box */}
      <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          {hero.metricsBox.heading}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <Link
            href="/notes"
            className="rounded-lg bg-muted/60 hover:bg-muted transition-colors p-2.5 block"
          >
            <div className="text-lg font-bold">{notesCount}</div>
            <div className="text-[10px] font-mono text-muted-foreground">
              {hero.metricsBox.labels.notes}
            </div>
          </Link>

          <Link
            href="/tutorials"
            className="rounded-lg bg-muted/60 hover:bg-muted transition-colors p-2.5 block"
          >
            <div className="text-lg font-bold">{tutorialsCount}</div>
            <div className="text-[10px] font-mono text-muted-foreground">
              {hero.metricsBox.labels.tutorials}
            </div>
          </Link>

          <Link
            href="/materials"
            className="rounded-lg bg-muted/60 hover:bg-muted transition-colors p-2.5 block"
          >
            <div className="text-lg font-bold">{materialsCount}</div>
            <div className="text-[10px] font-mono text-muted-foreground">
              {hero.metricsBox.labels.materials}
            </div>
          </Link>
        </div>

        <div className="pt-2 border-t border-border text-[11px] font-mono text-muted-foreground text-center">
          {hero.metricsBox.footerNote}
        </div>
      </div>
    </section>
  );
};
