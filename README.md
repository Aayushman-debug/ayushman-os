# AYUSHMAN OS — MY ENTIRE DIGITAL UNIVERSE

> **Personal Command Center · Academic Vault · Competitive Gaming · Entertainment Universe · Developer HQ**

AYUSHMAN OS unites the life, academics, creative projects, competitive gaming, productivity, and entertainment of **Aayushman Pathak** (B.Tech Computer Science and Engineering @ Arya College of Engineering & IT, Kukas, Jaipur, under Rajasthan Technical University, Kota) into a single, cohesive, high-performance web operating system.

---

## 🌌 System Architecture & Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite + TypeScript | High-performance SPA with client-side routing |
| **Styling** | Tailwind CSS v4 + Obsidian Design System | Near-black palette (`#07090e`), violet & cyan accents, glassmorphic panels |
| **Animation & 3D** | GSAP, ScrollTrigger, CSS 3D Transforms | 21st.dev `WorksWheel` 3D perspective drum & `CinematicFooter` aurora |
| **Backend API** | Node.js + Express + TypeScript | Parameterized REST endpoints, JWT authentication, and resilient fallbacks |
| **Database** | **MySQL 8.0 Community Server (Mandatory RDBMS)** | 16 normalized relational tables, foreign keys, indexes, versioned SQL migrations |
| **Visual Management** | MySQL Workbench 8.0 | Native GUI schema visualization & query runner |

---

## 🏛️ Authentic Academic Records Seeded

The system is seeded directly with authentic RTU examination marksheets and official syllabus documentation:
- **Student**: Aayushman Pathak (Roll: `24EARCS003` · Enrollment: `24E1ARCSM40P003`)
- **Institution**: Arya College of Engineering & Information Technology, Jaipur (Kukas)
- **University**: Rajasthan Technical University (RTU Kota)
- **Schooling**:
  - Class 10 (CBSE): 92.40% · St. Xavier High School
  - Class 12 (CBSE PCM): 88.60% · Senior Secondary Public School
- **B.Tech Historical Records**:
  - **Semester 1 (2025 Grading)**: SGPA 8.42 · 11 Courses (PPS: `A+`, Programming Lab: `A++`, Physics Lab: `A++`, Sports: `A++`) · **PASS**
  - **Semester 2 (2025 Grading)**: SGPA 8.55 · 11 Courses (Human Values: `A`, Chemistry Lab: `A+`, Civil Lab: `A++`, Workshop: `A++`) · **PASS**
  - **Semester 3 (2026 Grading)**: SGPA 8.28 · 12 Courses (OOP: `A++`, Software Engg: `B`, DSA Lab: `A+`, Industrial Training: `A`, Presentation: `A+`) · **PASS**
  - **Semester 4 (2026)**: SGPA 8.60 · DBMS, TOC, Computer Networks, Linux Shell Lab
- **Semester 5 Live Workspace (Active RTU CSE Syllabus)**:
  - `5CS3-01`: Information Theory & Coding (Credit: 2)
  - `5CS4-02`: Compiler Design (Credit: 3) — Lexical Analysis, CFG & Parsing (LL/LR/SLR/LALR/YACC), SDD, Code Optimization
  - `5CS4-03`: Operating System (Credit: 3) — Processor Mgmt, Virtual Memory/Paging, Deadlock/Banker's, File Systems
  - `5CS4-04`: Computer Graphics & Multimedia (Credit: 3) — Primitives, 2D/3D Transformations, Illumination, Fractals
  - `5CS4-05`: Analysis of Algorithms (Credit: 3) — Divide & Conquer, Dynamic Programming, Branch & Bound, NP-Completeness
  - `5CS5-11`: Wireless Communication (Credit: 2)
  - Practicals: CG Lab (`5CS4-21`), Compiler Lab (`5CS4-22`), Algorithms Lab (`5CS4-23`), Advance Java Lab (`5CS4-24`)
  - **Interactive topic-level completion checklist** enabling live revision tracking!

---

## 🎮 Entertainment & Gaming Highlights

- **Gaming Archive**:
  - **BGMI**: UID `5128947392` · IGN `AYUSHMAN_GOD` · Ace Dominator (Peak: Conqueror) · Clan: `VORTEX_ELITE` · K/D: 4.82
  - **Valorant**: IGN `Ayushman#DEV` · Server: Mumbai · Ascendant 2 (Peak: Immortal 1) · Role: Initiator/Duelist
  - **Minecraft**: `AyushmanCraft` · Redstone Architect & Megabase Builder · Server: CosmosSMP
- **Anime Archive**:
  - Attack on Titan (`10/10`, 89 eps), Jujutsu Kaisen (`9.6/10`, 47 eps), Solo Leveling (`9.3/10`), Demon Slayer (`9.1/10`)
  - **Live AniList GraphQL Search API** integration for adding any anime in real-time
- **Cinema Universe**:
  - Interstellar (`9.8/10`), Oppenheimer (`9.5/10`), Inception (`9.5/10`)
- **Soundtrack of Life**:
  - Embedded official Spotify Web Player, animated synthesizer visualizer, YouTube Music playlists

---

## ⚡ 21st.dev Components Integrated

1. **`WorksWheel`** (`client/src/components/ui/works-wheel.tsx`):
   - A 3D interactive wheel drum that transforms into a perspective-based vertical project browser as the user scrolls or drags.
2. **`CinematicFooter`** (`client/src/components/ui/motion-footer.tsx`):
   - Full-bleed cinematic footer featuring breathing aurora lighting, rotating animated marquee, magnetic cursor interaction buttons, and scroll-triggered parallax text reveal.
3. **`CommandPalette`** (`client/src/components/CommandPalette.tsx`):
   - Global `Ctrl + K` command hub to navigate instantly across all modules without mouse clicks.

---

## 🚀 Getting Started

### 1. Database Setup (MySQL 8.0)
The MySQL schema and seed script are organized under the `database/` directory:
- `database/schema.sql`: Complete DDL creating the database `ayushman_os` and 16 normalized relational tables.
- `database/seed.sql`: Personal academic, account, and profile data. Review and remove records that should not be published or loaded into a public environment.

**Do not run `npm run migrate` or replay `seed.sql` against an existing database.** The seed relies on duplicate-key clauses but the schema does not define matching unique keys for every seeded record, so reruns can insert duplicates. For a future production database, provision a new isolated database and least-privilege user, review/redact the seed data, back up the empty database, apply the schema and approved seed exactly once, verify the result, and keep a record that initialization completed. Use separately reviewed, versioned migrations for future changes.

In `server/.env`, verify your MySQL credentials if your root user has a password:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ayushman_os
```

### 2. Start the Backend API
```bash
cd server
npm run dev
```
The server will start at `http://localhost:5000`.

### 3. Start the Frontend Client
```bash
cd client
npm run dev
```
The client will start at `http://localhost:5173`.
Visit `http://localhost:5173` to experience **AYUSHMAN OS**!
