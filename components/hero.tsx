"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const getStartedButtonClass =
  "inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium tracking-wide text-background transition-colors hover:bg-foreground/90";

export interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  getStartedHref: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
    part3?: string;
  };
  socialLinks?: { icon: LucideIcon; href: string }[];
  locationText?: string;
  className?: string;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/60 transition-colors hover:text-foreground">
    <Icon className="h-5 w-5" />
  </a>
);

export function MinimalistHero({
  logoText,
  navLinks,
  mainText,
  getStartedHref,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks = [],
  locationText,
  className,
}: MinimalistHeroProps) {
  const showFooter = socialLinks.length > 0 || Boolean(locationText);
  const footerJustify =
    socialLinks.length > 0 && locationText
      ? "justify-between"
      : locationText && socialLinks.length === 0
        ? "justify-end"
        : "justify-start";
  return (
    <div
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-background p-8 font-sans md:p-12",
        className
      )}
    >
      <header className="z-30 flex w-full max-w-7xl items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="font-logo text-2xl tracking-wide text-foreground"
        >
          {logoText}
        </motion.div>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          <motion.a
            href={getStartedHref}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={cn(getStartedButtonClass, "py-2 text-xs")}
          >
            Get started
          </motion.a>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <a href={getStartedHref} className={cn(getStartedButtonClass, "py-2 text-xs")}>
            Get started
          </a>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            type="button"
            className="flex flex-col space-y-1.5"
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-6 bg-foreground"></span>
            <span className="block h-0.5 w-6 bg-foreground"></span>
            <span className="block h-0.5 w-5 bg-foreground"></span>
          </motion.button>
        </div>
      </header>

      <div className="font-hero relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-2 text-center font-sans md:order-1 md:text-left"
        >
          <p className="mx-auto max-w-xs whitespace-pre-line text-sm leading-relaxed text-foreground/80 md:mx-0">
            {mainText}
          </p>
          <a href={getStartedHref} className={cn(getStartedButtonClass, "mt-6")}>
            Get started
          </a>
        </motion.div>

        <div className="relative order-1 flex min-h-[280px] items-center justify-center py-6 md:order-2 md:min-h-0 md:py-0">
          {/* Outer disc — halo behind the portrait */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 aspect-square w-[min(82vw,320px)] rounded-full bg-gradient-to-br from-yellow-300/95 to-amber-400/90 shadow-[0_0_0_1px_rgba(250,204,21,0.35)] md:w-[min(52vw,420px)] lg:w-[min(46vw,520px)]"
            aria-hidden
          />
          {/* Inset circular crop — sits inside the yellow disc; blend removes harsh white */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="relative z-10 aspect-square w-[min(70vw,270px)] overflow-hidden rounded-full ring-2 ring-yellow-400/40 ring-offset-2 ring-offset-background md:w-[min(44vw,360px)] lg:w-[min(40vw,450px)]"
          >
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover object-[center_28%] mix-blend-multiply dark:mix-blend-soft-light"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found";
              }}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-end md:pl-10 lg:pl-16 xl:pl-24"
        >
          <h1 className="text-7xl font-bold leading-none text-foreground md:text-8xl lg:text-9xl">
            {overlayText.part1}
            <br />
            {overlayText.part2}
            {overlayText.part3 != null && overlayText.part3 !== "" ? (
              <>
                <br />
                {overlayText.part3}
              </>
            ) : null}
          </h1>
        </motion.div>
      </div>

      {showFooter ? (
        <footer className={cn("z-30 flex w-full max-w-7xl items-center gap-4", footerJustify)}>
          {socialLinks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex items-center space-x-4"
            >
              {socialLinks.map((link, index) => (
                <SocialIcon key={index} href={link.href} icon={link.icon} />
              ))}
            </motion.div>
          ) : null}
          {locationText ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="text-sm font-medium text-foreground/80"
            >
              {locationText}
            </motion.div>
          ) : null}
        </footer>
      ) : null}
    </div>
  );
}
