/**
 * npcDialogs.ts — Dialog tree definitions for all NPCs in NEON DISTRICT
 *
 * Each NPC has a branching dialog tree that reveals
 * real portfolio content through in-world conversation.
 */
import { DialogTree } from '../store/useDialogStore';

/* ─── GHOST — Central Nexus guide NPC ─────────────────────────────── */
export const ghostDialog: DialogTree = {
  id: 'ghost',
  startLine: 'intro',
  lines: {
    intro: {
      id: 'intro',
      speaker: 'GHOST',
      speakerColor: '#00f5ff',
      style: 'glitch',
      text: "Signal acquired. Welcome to NEON DISTRICT — the living archive of AYUSHMAN.\nI am GHOST, your navigator. Where do you want to jack in?",
      choices: [
        { label: 'Who is AYUSHMAN?',    next: 'who' },
        { label: 'Show me the districts', next: 'districts' },
        { label: 'Just looking.',        next: null },
      ],
    },
    who: {
      id: 'who',
      speaker: 'GHOST',
      speakerColor: '#00f5ff',
      text: "Aayushman Pathak. Full-stack developer, UI/UX engineer, anime connoisseur.\nCurrently building things that matter — and some that are just fun.\nOrigin: India. Status: Online.",
      choices: [
        { label: 'What districts are there?', next: 'districts' },
        { label: 'That\'s enough.',            next: null },
      ],
    },
    districts: {
      id: 'districts',
      speaker: 'GHOST',
      speakerColor: '#00f5ff',
      style: 'system',
      text: "Six active districts in this build:\n▸ CENTRAL NEXUS — you are here\n▸ MEMORY LANE    — personal archive\n▸ ACADEMIA       — education credentials\n▸ TECH CORE      — projects & skills\n▸ ARCADE 99      — media & gaming\n▸ SKYPORT        — comms & socials\n\nWalk close to any building and press [E] to enter.",
      next: null,
    },
  },
};

/* ─── CIPHER — Tech Core recruiter NPC ────────────────────────────── */
export const cipherDialog: DialogTree = {
  id: 'cipher',
  startLine: 'intro',
  lines: {
    intro: {
      id: 'intro',
      speaker: 'CIPHER',
      speakerColor: '#ffb700',
      text: "Hey. You look like someone who knows what a commit message is.\nI run intel on the TECH CORE district. You hiring or just browsing?",
      choices: [
        { label: 'What can he build?',    next: 'skills' },
        { label: 'Show me his projects.', next: 'projects' },
        { label: 'Just passing through.', next: null },
      ],
    },
    skills: {
      id: 'skills',
      speaker: 'CIPHER',
      speakerColor: '#ffb700',
      text: "Stack reads:\nFrontend  → React, Next.js, TypeScript, Tailwind, Three.js\nBackend   → Node.js, Express, PostgreSQL, Prisma, Redis\nDevOps    → Docker, GitHub Actions, Vercel, AWS\nTools     → Figma, Blender (learning), GSAP\n\nSolid across the full stack. Prefers shipping over theorising.",
      choices: [
        { label: 'See the projects.',    next: 'projects' },
        { label: 'Got it, thanks.',      next: null },
      ],
    },
    projects: {
      id: 'projects',
      speaker: 'CIPHER',
      speakerColor: '#ffb700',
      text: "Latest builds:\n▸ AYushMan OS — this very system. Personal OS as a portfolio.\n▸ More projects live in TECH CORE. Walk over and jack in.\n\nAll repos are on GitHub. No ghost commits — real work.",
      next: null,
    },
  },
};

/* ─── RAVI — Arcade 99 music/anime NPC ──────────────────────────── */
export const raviDialog: DialogTree = {
  id: 'ravi',
  startLine: 'intro',
  lines: {
    intro: {
      id: 'intro',
      speaker: 'RAVI',
      speakerColor: '#ff006e',
      text: "Ayo! You found ARCADE 99. Best spot in the district.\nSit down. I'll play you something good.",
      choices: [
        { label: 'What music is he into?',  next: 'music' },
        { label: 'Anime recommendations?',  next: 'anime' },
        { label: 'I\'ll just browse.',        next: null },
      ],
    },
    music: {
      id: 'music',
      speaker: 'RAVI',
      speakerColor: '#ff006e',
      text: "Man has taste. Runs 9 playlists — lofi, phonk, OSTs, study beats.\nSpotify connected. Check ARCADE 99 district to see the full lineup.",
      next: 'anime_pitch',
    },
    anime_pitch: {
      id: 'anime_pitch',
      speaker: 'RAVI',
      speakerColor: '#ff006e',
      text: "While you're here — you watch anime?",
      choices: [
        { label: 'Yeah, what does he watch?', next: 'anime' },
        { label: 'Not my thing.',              next: null },
      ],
    },
    anime: {
      id: 'anime',
      speaker: 'RAVI',
      speakerColor: '#ff006e',
      text: "List is long but the hits:\nAttack on Titan · Demon Slayer · JJK · Vinland Saga · HxH · Mushishi\n\nAlso keeps a full watch history in the system. Hit ARCADE 99 to see it all.",
      next: null,
    },
  },
};

/* ─── VERA — Skyport comms NPC ─────────────────────────────────────── */
export const veraDialog: DialogTree = {
  id: 'vera',
  startLine: 'intro',
  lines: {
    intro: {
      id: 'intro',
      speaker: 'VERA',
      speakerColor: '#00f5ff',
      style: 'system',
      text: "SKYPORT COMMS ONLINE. All outbound channels are live.\nLooking to reach AYUSHMAN?",
      choices: [
        { label: 'How do I contact him?', next: 'contact' },
        { label: 'What social links?',    next: 'socials' },
        { label: 'I\'m good.',             next: null },
      ],
    },
    contact: {
      id: 'contact',
      speaker: 'VERA',
      speakerColor: '#00f5ff',
      text: "Direct line:\nEmail → pathakaayushman57@gmail.com\n\nResponse time: usually within 24h. Serious inquiries only — he reads every message.",
      next: 'socials_pitch',
    },
    socials_pitch: {
      id: 'socials_pitch',
      speaker: 'VERA',
      speakerColor: '#00f5ff',
      text: "Want the social grid too?",
      choices: [
        { label: 'Yes, all links.', next: 'socials' },
        { label: 'Email is enough.', next: null },
      ],
    },
    socials: {
      id: 'socials',
      speaker: 'VERA',
      speakerColor: '#00f5ff',
      style: 'system',
      text: "Active channels:\nGitHub   → github.com/ayushmanpathak\nLinkedIn → linkedin.com/in/ayushmanpathak\nTwitter  → @aayushmanpathak\n\nAll links are live in SKYPORT district.",
      next: null,
    },
  },
};

export const ALL_NPC_DIALOGS: Record<string, DialogTree> = {
  ghost: ghostDialog,
  cipher: cipherDialog,
  ravi: raviDialog,
  vera: veraDialog,
};
