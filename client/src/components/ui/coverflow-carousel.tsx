"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { SmartImage, SmartImageCategory } from "@/components/ui/smart-image";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  id?: string | number;
  src: string;
  fallbackSrc?: string;
  alt: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  accentColor?: string;
  category?: SmartImageCategory;
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Show compact title/stat overlay directly on each slide card. */
  showCardOverlay?: boolean;
  /** Visual preset for card border and active spotlight treatment. */
  variant?: "default" | "gaming" | "social";
  /** Optional controlled selected index (0..slides.length-1). */
  selectedIndex?: number;
  /** Callback fired when the active slide changes. */
  onSelect?: (index: number, slide: CoverflowSlide) => void;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(148px, 22vw, 260px)",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  showCardOverlay = true,
  variant = "default",
  selectedIndex,
  onSelect,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;
  const effectiveLoop = loop && count > 1;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(selectedIndex ?? 0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(selectedIndex ?? 0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const reducedMotionRef = React.useRef(false);
  const onSelectRef = React.useRef(onSelect);
  onSelectRef.current = onSelect;

  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
    moved: boolean;
    clickedIndex: number | null;
  } | null>(null);

  const [selected, setSelected] = React.useState(() =>
    count > 0 ? Math.max(0, Math.min(count - 1, selectedIndex ?? 0)) : 0,
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => {
      if (count <= 0) return 0;
      return ((Math.round(pos) % count) + count) % count;
    },
    [count],
  );

  const notifySelection = React.useCallback(
    (nextIndex: number) => {
      setSelected((prev) => (prev !== nextIndex ? nextIndex : prev));
      if (slides[nextIndex] && onSelectRef.current) {
        onSelectRef.current(nextIndex, slides[nextIndex]);
      }
    },
    [slides],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width || count === 0) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (effectiveLoop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = distance === 0 ? 0 : Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = effectiveLoop
        ? Math.min(1, Math.max(0, count / 2 - distance + 0.15))
        : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance * 10));
    });
  }, [count, depth, effectiveLoop, fade, falloff, gap, rotate]);

  const settle = React.useCallback(
    (target: number, emitSelect = true) => {
      if (count === 0) return;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      const nextIdx = indexAt(target);
      if (emitSelect) {
        notifySelection(nextIdx);
      } else {
        setSelected(nextIdx);
      }

      if (reducedMotionRef.current) {
        posRef.current = target;
        paint();
        rafRef.current = null;
        return;
      }

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // Exponential ease-out settle
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [count, indexAt, notifySelection, paint],
  );

  const clamp = React.useCallback(
    (pos: number) =>
      effectiveLoop ? pos : Math.max(0, Math.min(Math.max(0, count - 1), pos)),
    [count, effectiveLoop],
  );

  const goTo = React.useCallback(
    (index: number, emitSelect = true) => {
      if (count === 0) return;
      const safeIndex = ((index % count) + count) % count;
      // Take the shorter way round rather than unwinding the whole ring.
      const target = effectiveLoop
        ? safeIndex + Math.round((targetRef.current - safeIndex) / count) * count
        : safeIndex;
      settle(clamp(target), emitSelect);
    },
    [clamp, count, effectiveLoop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => {
      if (count <= 1) return;
      settle(clamp(Math.round(targetRef.current) + by), true);
    },
    [clamp, count, settle],
  );

  // Sync external selectedIndex prop when changed by parent controls
  React.useEffect(() => {
    if (
      typeof selectedIndex === "number" &&
      count > 0 &&
      selectedIndex >= 0 &&
      selectedIndex < count
    ) {
      const currentTargetIdx = indexAt(targetRef.current);
      if (currentTargetIdx !== selectedIndex) {
        goTo(selectedIndex, false);
      }
    }
  }, [selectedIndex, count, goTo, indexAt]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (count <= 1) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const cardNode = (event.target as HTMLElement | null)?.closest?.(
      "[data-cf-index]",
    );
    const clickedIndex = cardNode
      ? Number(cardNode.getAttribute("data-cf-index"))
      : null;

    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      moved: false,
      clickedIndex:
        clickedIndex !== null && !Number.isNaN(clickedIndex)
          ? clickedIndex
          : null,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const deltaX = event.clientX - drag.x;
    if (Math.abs(deltaX) > 6) {
      drag.moved = true;
    }

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - deltaX / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) {
      notifySelection(index);
    }
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;

    // If the user clicked/tapped a card without dragging, glide directly to that card
    if (!drag.moved && drag.clickedIndex !== null) {
      goTo(drag.clickedIndex, true);
      return;
    }

    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)), true);
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || count === 0) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint, count]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  if (count === 0) {
    return (
      <div
        className={cn(
          "w-full py-12 text-center text-xs font-mono text-neutral-400 border border-white/10 rounded-2xl bg-white/[0.02]",
          className,
        )}
        role="region"
        aria-label={label}
      >
        No items available in carousel.
      </div>
    );
  }

  const active = slides[selected] || slides[0];

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden py-8 sm:py-10 outline-none ring-cyan-400/50 focus-visible:ring-2 active:cursor-grabbing rounded-2xl"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isCenter = index === selected;
              const accent = slide.accentColor || "#a855f7";

              return (
                <div
                  key={slide.id ?? index}
                  data-cf-index={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}: ${slide.title || slide.alt}`}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl bg-[#090d18] will-change-transform transition-shadow duration-300 border",
                    variant === "gaming"
                      ? isCenter
                        ? "border-white/50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] ring-2 ring-white/25"
                        : "border-white/15 shadow-2xl hover:border-white/30"
                      : variant === "social"
                      ? isCenter
                        ? "border-white/40 shadow-[0_14px_35px_-8px_rgba(0,0,0,0.75)] ring-1 ring-white/20"
                        : "border-white/10 shadow-xl hover:border-white/25"
                      : isCenter
                      ? "border-white/40 shadow-2xl"
                      : "border-white/10 shadow-xl",
                    cardClassName,
                  )}
                  style={{
                    width: "var(--cf-card)",
                    boxShadow: isCenter
                      ? variant === "gaming"
                        ? `0 22px 55px -12px ${accent}55, 0 0 28px 0 ${accent}35`
                        : variant === "social"
                        ? `0 16px 38px -10px ${accent}40`
                        : undefined
                      : undefined,
                  }}
                >
                  {/* Top Holographic / Accent Rim on Active Slide */}
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 top-0 h-[2.5px] z-30 transition-opacity duration-300",
                      isCenter ? "opacity-100" : "opacity-40",
                    )}
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent}, #ffffff, ${accent}, transparent)`,
                    }}
                  />

                  {/* Holographic Prismatic Edge Shimmer for Active Gaming Card */}
                  {variant === "gaming" && isCenter && (
                    <div
                      className="pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-screen"
                      style={{
                        background: `linear-gradient(135deg, transparent 25%, ${accent}44 48%, rgba(255,255,255,0.22) 52%, transparent 75%)`,
                      }}
                    />
                  )}

                  {/* Primary Artwork via SmartImage (with automatic category fallback) */}
                  <SmartImage
                    src={slide.src}
                    fallbackSrc={slide.fallbackSrc}
                    alt={slide.alt}
                    category={slide.category || (variant === "gaming" ? "gaming" : "social")}
                    accentColor={accent}
                    draggable={false}
                    containerClassName="h-full w-full select-none"
                    className="h-full w-full select-none object-cover"
                  />

                  {/* Compact Title & Key Stat Overlay on Card */}
                  {showCardOverlay && (slide.title || slide.badge || slide.subtitle) && (
                    <>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/45 to-transparent z-10" />

                      {slide.badge && (
                        <div className="pointer-events-none absolute top-3 right-3 z-20">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg"
                            style={{
                              backgroundColor: "rgba(6, 9, 18, 0.84)",
                              borderColor: `${accent}80`,
                              color: "#ffffff",
                            }}
                          >
                            {slide.badge}
                          </span>
                        </div>
                      )}

                      <div className="pointer-events-none absolute bottom-0 inset-x-0 p-3.5 sm:p-4 z-20">
                        {slide.title && (
                          <div className="text-sm sm:text-base font-black text-white tracking-tight truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                            {slide.title}
                          </div>
                        )}
                        {slide.subtitle && (
                          <div
                            className="text-[11px] font-mono font-semibold truncate mt-0.5"
                            style={{ color: isCenter ? "#f8fafc" : "#cbd5e1" }}
                          >
                            {slide.subtitle}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-2 sm:left-4 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#0b0e18]/85 hover:bg-white/15 border border-white/15 p-2.5 text-white backdrop-blur-md transition shadow-xl cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-2 sm:right-4 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#0b0e18]/85 hover:bg-white/15 border border-white/15 p-2.5 text-white backdrop-blur-md transition shadow-xl cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-1 flex flex-col items-center px-6 duration-300 animate-in fade-in text-center"
        >
          <p className="text-base font-bold tracking-tight text-white">
            {active.title}
          </p>
          {active.subtitle && (
            <p className="mt-0.5 text-xs font-mono text-neutral-400">
              {active.subtitle}
            </p>
          )}
          {active.meta && active.meta.length > 0 && (
            <dl className="mt-4 w-full max-w-[260px] text-xs bg-white/[0.03] border border-white/10 rounded-xl p-3">
              {active.meta.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between py-1 border-b border-white/5 last:border-0"
                >
                  <dt className="text-neutral-400 font-mono">{row.label}</dt>
                  <dd className="font-bold text-white font-mono">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {showPagination && count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((slide, index) => {
            const isCurrent = index === selected;
            return (
              <button
                key={slide.id ?? index}
                type="button"
                aria-label={`Go to ${slide.title || `slide ${index + 1}`}`}
                aria-current={isCurrent}
                onClick={() => goTo(index, true)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer",
                  isCurrent
                    ? "w-6 bg-white opacity-100"
                    : "w-2 bg-white/40 hover:bg-white/70 opacity-60",
                )}
                style={
                  isCurrent && slide.accentColor
                    ? { backgroundColor: slide.accentColor }
                    : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CoverflowCarousel;
