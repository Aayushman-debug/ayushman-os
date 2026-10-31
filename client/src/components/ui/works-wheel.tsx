"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExternalLink, Sparkles, FolderGit2 } from "lucide-react";

export interface WorksWheelItem {
  title: string;
  image: string;
  href?: string;
  category?: string;
  description?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  label?: string;
  action?: string;
}

/* Geometry constants */
const CARD_H = 0.40; // Front card height relative to stage
const CARD_MAX_W = 0.36; 
const CARD_RATIO = 1.45;
const STEP = 42; // Degrees between cards on the drum
const DRUM = 2.25; // Drum radius in card heights
const LENS = 2.8; // Perspective distance
const RING_R = 1.15;
const BOW = 1.85;
const TITLE = 0.125;
const INDEX = 0.042;
const CULL = 1.6;

const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;
const bowAt = (drumDeg: number, bow: number) => -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` translateY(${m * drumR * Math.sin(rad(drumDeg))}px)` +
    ` translateZ(${m * drumR * Math.cos(rad(drumDeg))}px)` +
    ` rotateX(${-m * drumDeg}deg)`
  );
}

// Resilient Image Card Component with graceful fallback
const WheelCardImage: React.FC<{ item: WorksWheelItem; isFront: boolean }> = ({ item, isFront }) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [item.image]);

  return (
    <div className="relative size-full overflow-hidden bg-[#0c1020]">
      {!imgError && item.image ? (
        <img
          src={item.image}
          alt={item.title}
          draggable={false}
          onError={() => setImgError(true)}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
      ) : (
        /* Designed Graceful Fallback if image unavailable */
        <div className="size-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#12162e] via-[#0b0e1a] to-[#1e1338] border border-white/5 text-center">
          <div className="size-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <FolderGit2 className="size-6 text-cyan-400" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">{item.title}</span>
          <span className="text-[11px] font-mono text-neutral-400 mt-1">{item.category || "Interactive System"}</span>
        </div>
      )}

      {/* Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-black/40 to-transparent pointer-events-none" />

      {/* Front Card Glowing Edge */}
      {isFront && (
        <div className="absolute inset-0 border border-cyan-400/40 rounded-2xl pointer-events-none shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]" />
      )}
    </div>
  );
};

export const WorksWheel: React.FC<WorksWheelProps> = ({
  items,
  label = "AYushMan",
  action = "View",
  className,
  ...props
}) => {
  const navigate = useNavigate();
  const count = items.length;
  const last = Math.max(0, count - 1);

  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const wheelRef = React.useRef<HTMLDivElement | null>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement | null>(null);
  const titleRef = React.useRef<HTMLDivElement | null>(null);

  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState({ w: 0, h: 0 });
  const [mouseTilt, setMouseTilt] = React.useState({ x: 0, y: 0 });

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const drag = React.useRef<number | null>(null);
  const dragStartY = React.useRef<number>(0);
  const dragMoved = React.useRef<boolean>(false);
  const settling = React.useRef(0);

  const reduced = React.useRef(false);
  React.useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Responsive stage measurement
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setStage({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const cardH = stage.h * CARD_H;
    const cardW = Math.min(cardH * CARD_RATIO, stage.w * CARD_MAX_W);
    const depth = stage.h * CARD_H * LENS;
    return {
      cardH,
      cardW,
      depth,
      title: Math.round(stage.h * TITLE),
      index: Math.max(11, Math.round(stage.h * INDEX)),
    };
  }, [stage.h, stage.w]);

  // Animation Loop for 3D Circular Ring & Perspective Drum
  React.useEffect(() => {
    let frame = 0;

    const draw = () => {
      frame = requestAnimationFrame(draw);

      if (reduced.current) {
        turn.current = target.current;
      } else {
        turn.current = lerp(turn.current, target.current, EASE);
      }

      const m = clamp(turn.current, 0, 1);
      const pos = Math.max(0, turn.current - 1);

      const ringR = metrics.cardH * RING_R;
      const drumR = metrics.cardH * DRUM;
      const bow = metrics.cardH * BOW;

      const ringScale = (2 * ringR * Math.tan(Math.PI / count)) / metrics.cardW;

      if (wheelRef.current) {
        // Perspective drum translation + subtle pointer tilt
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px) rotateY(${mouseTilt.x * 0.05}deg) rotateX(${mouseTilt.y * -0.04}deg)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);

      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, mouseTilt]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  // Wheel interaction
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) event.preventDefault();
      to(next);
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  // Pointer movement tracking for interactive 3D stage tilt & vertical drag
  const handleStagePointerMove = (e: React.PointerEvent) => {
    if (stage.w > 0 && stage.h > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left - rect.width / 2);
      const py = (e.clientY - rect.top - rect.height / 2);
      setMouseTilt({ x: px, y: py });
    }

    if (drag.current === null) return;
    if (Math.abs(e.clientY - dragStartY.current) > 6) {
      dragMoved.current = true;
    }
    to(target.current + (drag.current - e.clientY) / DRAG_UNITS);
    drag.current = e.clientY;
  };

  const handleStagePointerLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
    drag.current = null;
  };

  const handleCardNavigation = (
    e: React.MouseEvent<HTMLElement>,
    item: WorksWheelItem,
    index: number,
  ) => {
    e.preventDefault();
    if (dragMoved.current) {
      dragMoved.current = false;
      return;
    }
    // If wheel is still in closed circular ring state (turn < 0.5), open to this card on first click;
    // or if already open / clicking the active card, navigate to destination route via React Router
    if (turn.current < 0.5) {
      to(index + 1);
      return;
    }
    if (index !== active) {
      to(index + 1);
      return;
    }
    if (item.href) {
      if (/^https?:\/\//i.test(item.href)) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        navigate(item.href);
      }
    }
  };

  const handleOpenButtonClick = (
    e: React.MouseEvent<HTMLElement>,
    href?: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragMoved.current) {
      dragMoved.current = false;
      return;
    }
    if (!href) return;
    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      navigate(href);
    }
  };

  return (
    <section
      aria-label={label}
      className={cn(
        "relative h-full min-h-[26rem] w-full overflow-hidden select-none bg-[#07090e]",
        className,
      )}
      {...props}
    >
      {/* Subtle Atmospheric Stage Background Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.12),transparent_70%)]" />

      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-foreground absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          dragStartY.current = event.clientY;
          dragMoved.current = false;
        }}
        onPointerMove={handleStagePointerMove}
        onPointerLeave={handleStagePointerLeave}
        onPointerUp={() => {
          drag.current = null;
          if (target.current > 1) to(Math.round(target.current));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            to(Math.round(target.current) + 1);
          } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            to(Math.round(target.current) - 1);
          } else if (event.key === "Enter" && items[active]?.href) {
            navigate(items[active].href!);
            return;
          } else {
            return;
          }
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d] transition-transform duration-100 ease-out"
        >
          {items.map((item, i) => {
            const isFront = i === active;
            const Tag = (item.href ? "a" : "div") as "a";

            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={isFront}
                  href={item.href}
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    handleCardNavigation(e, item, i)
                  }
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  className="group absolute [backface-visibility:hidden] transition-shadow duration-500"
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                >
                  <span className={cn(
                    "relative block size-full overflow-hidden rounded-2xl border transition-all duration-500",
                    isFront
                      ? "border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.35),0_20px_50px_rgba(0,0,0,0.8)] scale-[1.02]"
                      : "border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.15),0_15px_30px_rgba(0,0,0,0.7)] hover:border-purple-400/40"
                  )}>
                    <WheelCardImage item={item} isFront={isFront} />

                    {/* Card Title & Info Overlay on hover/front */}
                    <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between z-10">
                      <div className="pointer-events-none">
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-md">
                          {item.title}
                        </h4>
                        {item.category && (
                          <span className="text-[10px] font-mono text-cyan-300 mt-0.5 block">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {action && item.href ? (
                        <button
                          type="button"
                          onClick={(e) => handleOpenButtonClick(e, item.href)}
                          className="pointer-events-auto bg-white/10 border border-white/20 text-white flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 shadow-lg cursor-pointer"
                        >
                          <span>{action}</span>
                          <ExternalLink className="size-3" />
                        </button>
                      ) : null}
                    </div>
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Ring title and front-card title */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center font-black tracking-tight text-white/90 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </div>
      
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-1/2 left-[6%] -translate-y-1/2 font-black tracking-tight text-white opacity-0 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] z-20"
        style={{ fontSize: metrics.title }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-300">
          {items[active]?.title}
        </span>
      </div>

      {/* Interactive Navigation Index List */}
      <ol
        className="absolute top-[6%] right-[3%] text-right leading-[1.8] font-medium z-30 bg-black/50 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl"
        style={{ fontSize: metrics.index }}
      >
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 pb-1 border-b border-white/5 mb-1.5 text-left">
          Index
        </div>
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => to(i + 1)}
              className={cn(
                "focus-visible:outline-foreground cursor-pointer transition-all duration-200 outline-none flex items-center justify-end gap-2 text-xs md:text-sm w-full py-0.5",
                i === active 
                  ? "text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                  : "text-neutral-400 hover:text-white",
              )}
            >
              {i === active && (
                <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
              <span>{item.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default WorksWheel;
