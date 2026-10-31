"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowUpRight } from "lucide-react";

const STYLES = `
.footer-bg-grid {
  background-size: 48px 48px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 85%, transparent);
}

.footer-glass-pill {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 100%);
  border: 1px solid rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(12px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-color: rgba(56, 189, 248, 0.45);
  box-shadow: 0 10px 28px -10px rgba(56, 189, 248, 0.25);
  color: #ffffff;
}
`;

export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
    to?: string;
  };

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(element, {
            x: x * 0.24,
            y: y * 0.24,
            scale: 1.03,
            ease: "power2.out",
            duration: 0.25,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            scale: 1,
            ease: "power3.out",
            duration: 0.5,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

export function CinematicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <footer className="relative w-full border-t border-white/[0.07] bg-[#05070c] text-slate-100 overflow-hidden">
        <div className="footer-bg-grid absolute inset-0 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55vw] h-40 bg-gradient-to-b from-cyan-500/[0.06] via-violet-500/[0.04] to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
          {/* Top Row: Brand Identity & Primary Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
            <div>
              <div className="text-2xl font-black tracking-tight text-white">AYushMan</div>
              <p className="text-xs text-neutral-400 mt-1 max-w-md">
                Personal digital workspace — B.Tech CSE academics (RTU Kota), software engineering, gaming profiles, and media archives.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MagneticButton
                as={Link}
                to="/dashboard"
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-xs transition flex items-center gap-2"
              >
                <span>Enter Workspace</span>
                <ArrowUpRight className="size-3.5" />
              </MagneticButton>

              <MagneticButton
                as={Link}
                to="/academics"
                className="footer-glass-pill px-6 py-2.5 rounded-full text-neutral-200 font-semibold text-xs flex items-center gap-2"
              >
                <span>Academics</span>
              </MagneticButton>
            </div>
          </div>

          {/* Middle Row: Section Links & Verified External Profiles */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Academics", to: "/academics" },
                { label: "Projects", to: "/developer" },
                { label: "Gaming", to: "/gaming" },
                { label: "Anime & Movies", to: "/entertainment" },
                { label: "Music", to: "/music" },
                { label: "Journal", to: "/productivity" },
                { label: "Social & Platforms", to: "/social" },
                { label: "Memories", to: "/vault" },
              ].map((link) => (
                <MagneticButton
                  key={link.to}
                  as={Link}
                  to={link.to}
                  className="footer-glass-pill px-3.5 py-1.5 rounded-full text-neutral-400 text-xs font-medium hover:text-white"
                >
                  {link.label}
                </MagneticButton>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <MagneticButton
                as="a"
                href="https://github.com/Aayushman-debug"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-glass-pill px-3.5 py-1.5 rounded-full text-cyan-300/90 font-mono text-[11px]"
              >
                GitHub @Aayushman-debug ↗
              </MagneticButton>
              <MagneticButton
                as="a"
                href="https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-glass-pill px-3.5 py-1.5 rounded-full text-emerald-300/90 font-mono text-[11px]"
              >
                Spotify Profile ↗
              </MagneticButton>
              <MagneticButton
                as="a"
                href="https://music.youtube.com/@wtfk1y0"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-glass-pill px-3.5 py-1.5 rounded-full text-rose-300/90 font-mono text-[11px]"
              >
                YT Music @wtfk1y0 ↗
              </MagneticButton>
              <MagneticButton
                as="a"
                href="https://www.instagram.com/wtfk1yo/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-glass-pill px-3.5 py-1.5 rounded-full text-pink-300/90 font-mono text-[11px]"
              >
                Instagram @wtfk1yo ↗
              </MagneticButton>
            </div>
          </div>

          {/* Bottom Row: Copyright & Scroll to Top */}
          <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>© 2026 AYushMan · Arya College of Engg. &amp; IT (RTU Kota)</span>
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="footer-glass-pill size-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white"
            >
              <ArrowUp className="size-4" />
            </MagneticButton>
          </div>
        </div>
      </footer>
    </>
  );
}

export default CinematicFooter;
