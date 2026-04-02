"use client";

import { MinimalistHero } from "@/components/hero";

const landingContent = {
  logoText: "mu8ic",
  navLinks: [
    { label: "About", href: "/auth" },
    { label: "Generate", href: "/auth" },
    { label: "Contact", href: "/auth" },
  ],
  mainText:
    "Royalty-ready AI music for your YouTube cuts.\nDescribe the mood—get a track in seconds.",
  getStartedHref: "/auth",
  imageSrc:
    "https://images.unsplash.com/photo-1683122805203-150142bfa2d6?w=700&q=80&auto=format&fit=crop",
  imageAlt: "Side profile of a person with eyes closed",
  overlayText: {
    part1: "Create",
    part2: "Your",
    part3: "Sound",
  },
};

export function LandingHero() {
  return <MinimalistHero {...landingContent} />;
}
