/**
 * terminalContents.tsx — In-game terminal content for each district building.
 *
 * This is real portfolio data rendered in the cyberpunk terminal frame.
 * Styled with monospace, neon colors, and ASCII-art dividers.
 */
import React from 'react';

const MONO: React.CSSProperties = { fontFamily: 'monospace' };

/* ─── Reusable primitives ──────────────────────────────────────────── */
function Section({ title, color }: { title: string; color: string }) {
  return (
    <div style={{ ...MONO, color, fontSize: '0.6rem', letterSpacing: '0.2em', marginBottom: 6, marginTop: 20 }}>
      {'─'.repeat(4)} {title} {'─'.repeat(20)}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ ...MONO, fontSize: '0.8rem', marginBottom: 5, display: 'flex', gap: 16 }}>
      <span style={{ color: '#4a6080', minWidth: 120 }}>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}

function Tag({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        ...MONO,
        fontSize: '0.65rem',
        border: `1px solid ${color}`,
        color,
        padding: '2px 8px',
        marginRight: 6,
        marginBottom: 6,
        display: 'inline-block',
      }}
    >
      {text}
    </span>
  );
}

/* ─── CENTRAL NEXUS — About / Identity ─────────────────────────────── */
export function CentralNexusContent() {
  return (
    <div style={MONO}>
      <div style={{ fontSize: '1.1rem', color: '#00f5ff', marginBottom: 4, letterSpacing: '0.1em' }}>
        AYUSHMAN PATHAK
      </div>
      <div style={{ color: '#4a6080', fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: 20 }}>
        FULL-STACK DEVELOPER · UI/UX ENGINEER · BUILDER
      </div>

      <Section title="IDENTITY" color="#00f5ff" />
      <Row label="Status" value="Available for opportunities" color="#00ff88" />
      <Row label="Location" value="India 🇮🇳" color="#c8d8e8" />
      <Row label="Email" value="pathakaayushman57@gmail.com" color="#00f5ff" />
      <Row label="Focus" value="React · Node.js · UI/UX · Three.js" color="#c8d8e8" />

      <Section title="ABOUT" color="#00f5ff" />
      <div style={{ fontSize: '0.8rem', color: '#c8d8e8', lineHeight: 1.8, maxWidth: 540 }}>
        I build things at the intersection of engineering and design.
        My work ranges from full-stack web applications to interactive 3D experiences.
        I care deeply about the details — the micro-interactions, the right font weight, the
        animation curve that makes something feel alive.
        <br /><br />
        When I'm not coding, I'm watching anime, curating playlists, or losing hours to open-world games.
      </div>

      <Section title="CURRENT SYSTEMS" color="#00f5ff" />
      <Row label="This project" value="AYushMan OS — Personal portfolio as a game world" color="#00f5ff" />
      <Row label="Stack" value="React + Three.js + Rapier + Node.js" color="#c8d8e8" />
    </div>
  );
}

/* ─── TECH CORE — Projects & Skills ──────────────────────────────── */
export function TechCoreContent() {
  const skills = {
    Frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Three.js', 'GSAP', 'Framer Motion'],
    Backend: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'REST', 'WebSockets'],
    DevOps: ['Docker', 'GitHub Actions', 'Vercel', 'AWS S3', 'Nginx'],
    Design: ['Figma', 'Blender (learning)', 'UI/UX', 'Design Systems'],
  };

  return (
    <div style={MONO}>
      <div style={{ fontSize: '1rem', color: '#ffb700', letterSpacing: '0.1em', marginBottom: 20 }}>
        TECH CORE · SKILLS & PROJECTS
      </div>

      <Section title="SKILLS MATRIX" color="#ffb700" />
      {Object.entries(skills).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 14 }}>
          <div style={{ color: '#ffb700', fontSize: '0.65rem', letterSpacing: '0.15em', marginBottom: 6 }}>
            {category.toUpperCase()}
          </div>
          <div>
            {items.map((s) => (
              <Tag key={s} text={s} color="#ffb700" />
            ))}
          </div>
        </div>
      ))}

      <Section title="FEATURED PROJECT" color="#ffb700" />
      <div style={{ border: '1px solid #ffb70044', padding: 14, marginBottom: 12 }}>
        <div style={{ color: '#ffb700', fontSize: '0.85rem', marginBottom: 4 }}>AYushMan OS</div>
        <div style={{ color: '#4a6080', fontSize: '0.65rem', marginBottom: 8 }}>Full-stack · React · Three.js · Node.js · JWT Auth</div>
        <div style={{ color: '#c8d8e8', fontSize: '0.78rem', lineHeight: 1.7 }}>
          A personal portfolio reimagined as a playable cyberpunk city.
          Secure admin auth, public portfolio browsing, interactive 3D world with physics,
          NPC dialog system, and a full personal OS with music, entertainment, and productivity modules.
        </div>
      </div>

      <div style={{ color: '#4a6080', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
        → More projects at /developer (FULL VIEW ↗ above)
      </div>
    </div>
  );
}

/* ─── ACADEMIA — Education credentials ──────────────────────────── */
export function AcademiaContent() {
  return (
    <div style={MONO}>
      <div style={{ fontSize: '1rem', color: '#ffb700', letterSpacing: '0.1em', marginBottom: 20 }}>
        ACADEMIA · EDUCATION ARCHIVE
      </div>

      <Section title="DEGREES" color="#ffb700" />
      <div style={{ border: '1px solid #ffb70033', padding: 14, marginBottom: 12 }}>
        <div style={{ color: '#ffb700', fontSize: '0.85rem' }}>B.Tech — Computer Science Engineering</div>
        <div style={{ color: '#4a6080', fontSize: '0.7rem', marginTop: 4 }}>
          Graduating · India
        </div>
        <div style={{ color: '#c8d8e8', fontSize: '0.78rem', marginTop: 8, lineHeight: 1.6 }}>
          Core focus: Data Structures, Algorithms, Web Engineering, Database Systems, OS, Networks.
        </div>
      </div>

      <Section title="CERTIFICATIONS" color="#ffb700" />
      {[
        'Full-Stack Web Development',
        'React — Advanced Patterns',
        'Node.js & Express API Design',
        'UI/UX Design Foundations (Figma)',
        'Docker & Container Orchestration',
      ].map((cert) => (
        <div key={cert} style={{ color: '#c8d8e8', fontSize: '0.78rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#ffb700' }}>▸</span> {cert}
        </div>
      ))}

      <div style={{ color: '#4a6080', fontSize: '0.65rem', marginTop: 16, letterSpacing: '0.1em' }}>
        → Full credentials at /academics (FULL VIEW ↗)
      </div>
    </div>
  );
}

/* ─── ARCADE 99 — Music / Anime / Gaming ─────────────────────────── */
export function Arcade99Content() {
  const anime = [
    { title: 'Attack on Titan', status: '✓ Complete', rating: '10/10' },
    { title: 'Demon Slayer', status: '✓ Complete', rating: '9/10' },
    { title: 'Jujutsu Kaisen', status: '↻ Watching', rating: '9/10' },
    { title: 'Vinland Saga', status: '✓ Complete', rating: '10/10' },
    { title: 'Hunter × Hunter', status: '✓ Complete', rating: '10/10' },
    { title: 'Mushishi', status: '✓ Complete', rating: '9/10' },
    { title: 'Made in Abyss', status: '✓ Complete', rating: '9/10' },
  ];

  return (
    <div style={MONO}>
      <div style={{ fontSize: '1rem', color: '#ff006e', letterSpacing: '0.1em', marginBottom: 20 }}>
        ARCADE 99 · MEDIA & ENTERTAINMENT
      </div>

      <Section title="MUSIC PLAYLISTS" color="#ff006e" />
      {[
        'Lofi Hip-Hop Beats', 'Phonk & Dark Ambient',
        'Anime OSTs Collection', 'Study Mode · Deep Focus',
        'Synthwave Neon', 'Chill Vibes',
        'Gaming Bangers', 'Late Night Coding', 'Workout Mix',
      ].map((pl, i) => (
        <div key={pl} style={{ fontSize: '0.78rem', color: '#c8d8e8', marginBottom: 5, display: 'flex', gap: 12 }}>
          <span style={{ color: '#2a3a50' }}>{String(i + 1).padStart(2, '0')}</span>
          <span>{pl}</span>
        </div>
      ))}

      <Section title="ANIME WATCH LIST" color="#ff006e" />
      {anime.map((a) => (
        <div key={a.title} style={{ fontSize: '0.78rem', display: 'flex', gap: 12, marginBottom: 5 }}>
          <span style={{ color: '#c8d8e8', minWidth: 180 }}>{a.title}</span>
          <span style={{ color: '#4a6080', minWidth: 100 }}>{a.status}</span>
          <span style={{ color: '#ff006e' }}>{a.rating}</span>
        </div>
      ))}

      <div style={{ color: '#4a6080', fontSize: '0.65rem', marginTop: 16, letterSpacing: '0.1em' }}>
        → Full list at /entertainment and /music (FULL VIEW ↗)
      </div>
    </div>
  );
}

/* ─── MEMORY LANE — About / Story ─────────────────────────────────── */
export function MemoryLaneContent() {
  return (
    <div style={MONO}>
      <div style={{ fontSize: '1rem', color: '#ff006e', letterSpacing: '0.1em', marginBottom: 20 }}>
        MEMORY LANE · ORIGIN STORY
      </div>

      <Section title="TIMELINE" color="#ff006e" />
      {[
        { year: '2004', event: 'System initialized. Born in India.' },
        { year: '2018', event: 'First contact with code. HTML + CSS. "This is magic."' },
        { year: '2020', event: 'Discovered JavaScript. Built first interactive site.' },
        { year: '2021', event: 'React. Everything clicked. Started building real apps.' },
        { year: '2022', event: 'Full-stack. Node.js, databases, APIs. The back end unlocked.' },
        { year: '2023', event: 'UI/UX obsession begins. Figma, design systems, motion.' },
        { year: '2024', event: 'Three.js, WebGL, immersive web. The 3D dimension opens.' },
        { year: '2025', event: 'AYushMan OS. The portfolio becomes the project.' },
        { year: '2026', event: 'NEON DISTRICT. You are here.' },
      ].map(({ year, event }) => (
        <div key={year} style={{ display: 'flex', gap: 20, marginBottom: 10, alignItems: 'flex-start' }}>
          <span style={{ color: '#ff006e', minWidth: 44, fontSize: '0.72rem' }}>{year}</span>
          <span style={{ color: '#c8d8e8', fontSize: '0.78rem', lineHeight: 1.5 }}>{event}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── SKYPORT — Contact & Socials ─────────────────────────────────── */
export function SkyportContent() {
  const links = [
    { label: 'Email', value: 'pathakaayushman57@gmail.com', href: 'mailto:pathakaayushman57@gmail.com' },
    { label: 'GitHub', value: 'github.com/ayushmanpathak', href: 'https://github.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/ayushmanpathak', href: 'https://linkedin.com' },
    { label: 'Twitter', value: '@aayushmanpathak', href: 'https://twitter.com' },
  ];

  return (
    <div style={MONO}>
      <div style={{ fontSize: '1rem', color: '#ffb700', letterSpacing: '0.1em', marginBottom: 20 }}>
        SKYPORT · COMMUNICATIONS HUB
      </div>

      <Section title="OPEN CHANNELS" color="#ffb700" />
      {links.map(({ label, value, href }) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ color: '#4a6080', fontSize: '0.6rem', letterSpacing: '0.15em', marginBottom: 4 }}>
            {label.toUpperCase()}
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#ffb700', fontSize: '0.85rem', textDecoration: 'none' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = 'underline')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = 'none')}
          >
            {value} ↗
          </a>
        </div>
      ))}

      <Section title="STATUS" color="#ffb700" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
        <span style={{ color: '#00ff88', fontSize: '0.78rem' }}>ONLINE · Open to opportunities</span>
      </div>
      <div style={{ color: '#c8d8e8', fontSize: '0.78rem', lineHeight: 1.7, maxWidth: 420 }}>
        Whether you're looking to collaborate, hire, or just talk about anime —
        the signal is open. Expected response: within 24 hours.
      </div>
    </div>
  );
}
