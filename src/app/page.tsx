"use client";

import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Header } from "@/components/header";
import { Hero } from "@/components/home/hero";
import { FeaturedBlogsSection } from "@/components/home/featured";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { blogs = [], FeaturedTags = [] } = useContext(AppContext) ?? {};

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 lg:py-10 space-y-8">
        <Hero />

        <FeaturedBlogsSection blogs={blogs} featuredTags={FeaturedTags} />

        <ContactSection blogs={blogs} />
      </main>

      <Footer />
    </div>
  );
}
