"use client";

import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ScrollProvider } from "@/lib/scroll";

export function App() {
  return (
    <ScrollProvider>
      <RevealObserver />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </ScrollProvider>
  );
}
