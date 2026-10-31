import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  ExternalLink, 
  Layers, 
  Cpu, 
  GitBranch,
  Terminal,
  ArrowUpRight
} from 'lucide-react';
import { WorksWheel, WorksWheelItem } from '@/components/ui/works-wheel';
import { AsciiArtCanvas } from '@/components/ui/ascii-art-canvas';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { PageTransition } from '@/components/ui/page-transition';
import { SmartImage } from '@/components/ui/smart-image';

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const PROJECT_WHEEL_ITEMS: WorksWheelItem[] = [
  {
    title: "AYushMan",
    category: "Personal Space & Full-Stack",
    image: "/assets/projects/ayushman-os.svg",
    href: "https://github.com/Aayushman-debug/ayushman-os",
  },
  {
    title: "Mithila Art",
    category: "Heritage E-Commerce & Gallery",
    image: "/assets/projects/mithila-art.svg",
    href: "https://github.com/Aayushman-debug/mithila-art",
  },
  {
    title: "CampusConnect",
    category: "Academic Hub & Collaboration",
    image: "/assets/projects/campus-connect.svg",
    href: "https://github.com/Aayushman-debug/campus-connect",
  },
  {
    title: "RTU Academic Engine",
    category: "SGPA Analytics & Syllabus",
    image: "/assets/projects/ayushman-os.svg",
    href: "/academics",
  },
  {
    title: "Holographic Gaming Vault",
    category: "7 Interactive Game Profiles",
    image: "/assets/games/clash-royale.svg",
    href: "/gaming",
  }
];

const FALLBACK_SKILLS = [
  { id: 1, name: 'C++ & STL', category: 'language', proficiency: 92, verified: true },
  { id: 2, name: 'Python', category: 'language', proficiency: 88, verified: true },
  { id: 3, name: 'Java & J2EE', category: 'language', proficiency: 85, verified: true },
  { id: 4, name: 'MySQL & Relational Databases', category: 'database', proficiency: 90, verified: true },
  { id: 5, name: 'Data Structures & Algorithms', category: 'core_cs', proficiency: 90, verified: true },
  { id: 6, name: 'Operating Systems & Networking', category: 'core_cs', proficiency: 86, verified: true },
  { id: 7, name: 'React & TypeScript', category: 'web', proficiency: 92, verified: true },
  { id: 8, name: 'Node.js & Express API', category: 'web', proficiency: 89, verified: true },
  { id: 9, name: 'Git & Linux Workflows', category: 'tools', proficiency: 94, verified: true },
];

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'AYushMan',
    tag: 'Web Platform',
    description: 'A personal website combining academic records, daily tracking, entertainment, and interactive components.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'GSAP', 'Tailwind'],
    githubUrl: 'https://github.com/Aayushman-debug/ayushman-os',
    liveUrl: '/',
    imageUrl: '/assets/projects/ayushman-os.svg',
    accentColor: '#a855f7',
    repoSlug: 'Aayushman-debug/ayushman-os',
    architectureNote: 'React 19 + Express + MySQL · Spatial UI & Telemetry',
    featured: true,
  },
  {
    id: 2,
    title: 'Mithila Art Heritage Platform',
    tag: 'E-Commerce & Cultural Archive',
    description: 'An interactive cultural marketplace exhibiting authentic Madhubani hand-painted artworks, artist biographies, and seamless transaction workflows.',
    technologies: ['React', 'Node.js', 'Express', 'Tailwind', 'Render', 'Vercel'],
    githubUrl: 'https://github.com/Aayushman-debug/mithila-art',
    liveUrl: '#',
    imageUrl: '/assets/projects/mithila-art.svg',
    accentColor: '#f59e0b',
    repoSlug: 'Aayushman-debug/mithila-art',
    architectureNote: 'Cultural Gallery · Artist Curations & Checkout',
    featured: true,
  },
  {
    id: 3,
    title: 'CampusConnect Portal',
    tag: 'University Management & Community',
    description: 'Comprehensive academic portal enabling timetable management, syllabus tracking, note exchanges, and event notifications for college cohorts.',
    technologies: ['React', 'Node.js', 'MySQL', 'Tailwind'],
    githubUrl: 'https://github.com/Aayushman-debug/CampusConnect',
    liveUrl: '#',
    imageUrl: '/assets/projects/campus-connect.svg',
    accentColor: '#10b981',
    repoSlug: 'Aayushman-debug/CampusConnect',
    architectureNote: 'RTU Sem V Cohort · Syllabus & Resource Sync',
    featured: true,
  },
];

function resolveProjectImage(proj: any): string {
  const title = (proj?.title || '').toLowerCase();
  if (title.includes('mithila')) return '/assets/projects/mithila-art.svg';
  if (title.includes('campus')) return '/assets/projects/campus-connect.svg';
  if (title.includes('ayushman')) return '/assets/projects/ayushman-os.svg';
  if (proj?.imageUrl && proj.imageUrl.startsWith('/assets/projects/')) return proj.imageUrl;
  return '/assets/projects/ayushman-os.svg';
}

function resolveProjectMeta(proj: any) {
  const title = (proj?.title || '').toLowerCase();
  if (title.includes('mithila')) {
    return {
      accentColor: '#f59e0b',
      repoSlug: 'Aayushman-debug/mithila-art',
      architectureNote: 'Cultural Gallery · Artist Curations & Checkout',
    };
  }
  if (title.includes('campus')) {
    return {
      accentColor: '#10b981',
      repoSlug: 'Aayushman-debug/CampusConnect',
      architectureNote: 'RTU Sem V Cohort · Syllabus & Resource Sync',
    };
  }
  return {
    accentColor: '#a855f7',
    repoSlug: 'Aayushman-debug/ayushman-os',
    architectureNote: 'React 19 + Express + MySQL · Spatial UI & Telemetry',
  };
}

export const DeveloperPage: React.FC = () => {
  const [skills, setSkills] = useState<any[]>(FALLBACK_SKILLS);
  const [projects, setProjects] = useState<any[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    fetch('/api/developer/skills')
      .then(r => r.json())
      .then(d => d.skills && d.skills.length > 0 && setSkills(d.skills))
      .catch(console.error);
    fetch('/api/developer/projects')
      .then(r => r.json())
      .then(d => d.projects && d.projects.length > 0 && setProjects(d.projects))
      .catch(console.error);
  }, []);

  return (
    <PageTransition>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <AsciiArtCanvas
              theme="cyberpunk"
              renderMode="matrix"
              animStyle="wave"
              cellSize={14}
              contrast={110}
              bloom={true}
              vignette={true}
              animSpeed={0.8}
              animIntensity={40}
            />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Code2 className="size-3.5" />
              <span>Engineering &amp; Software Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Projects &amp; Engineering
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Production code repositories, interactive UI previews, and verified technical proficiencies.
            </p>
          </div>

          <div className="flex gap-3 relative z-10">
            <a
              href="https://github.com/Aayushman-debug"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition shadow-lg hover:border-cyan-400/50"
            >
              <Github className="size-4" />
              <span>@Aayushman-debug</span>
            </a>
          </div>
        </div>

        {/* Projects List & Repositories — Interface Depth Swap Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <GitBranch className="size-5 text-cyan-400" />
              <span>Featured Builds &amp; System Architectures</span>
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              Hover cards for 3D interface depth preview · {projects.length} Repositories
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-portfolio-grid="projects">
            {projects.map((proj) => {
              const imageSrc = resolveProjectImage(proj);
              const meta = resolveProjectMeta(proj);

              return (
                <SpotlightCard
                  key={proj.id}
                  enableTilt={true}
                  maxTilt={6}
                  spotlightColor={`${meta.accentColor}28`}
                  className="rounded-2xl bg-[#0b0e18]/90 border border-white/10 flex flex-col justify-between hover:border-cyan-400/45 transition-all duration-300 group shadow-2xl overflow-hidden"
                >
                  <div>
                    {/* Browser Chrome Header + Interface Depth Swap Preview Window */}
                    <div className="relative bg-[#060913] border-b border-white/10 overflow-hidden">
                      {/* Window Chrome Top Bar */}
                      <div className="px-3.5 py-2 bg-[#090d1a] border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-full bg-rose-500/80" />
                          <span className="size-2.5 rounded-full bg-amber-400/80" />
                          <span className="size-2.5 rounded-full bg-emerald-400/80" />
                        </div>
                        <span className="truncate max-w-[180px] text-neutral-300">{meta.repoSlug}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                          style={{
                            backgroundColor: `${meta.accentColor}22`,
                            color: meta.accentColor,
                          }}
                        >
                          LIVE UI
                        </span>
                      </div>

                      {/* Project Artwork Viewport */}
                      <div className="relative w-full h-52 overflow-hidden bg-[#060913]">
                        <SmartImage
                          src={imageSrc}
                          fallbackSrc="/assets/projects/ayushman-os.svg"
                          alt={proj.title}
                          category="project"
                          accentColor={meta.accentColor}
                          containerClassName="size-full"
                          className="size-full object-cover object-center group-hover:scale-[1.05] group-hover:-translate-y-1 transition-transform duration-500 ease-out"
                        />

                        {/* Architectural Blueprint Grid Overlay on Hover */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            backgroundImage:
                              'linear-gradient(to right, rgba(6,182,212,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.12) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                          }}
                        />

                        {/* Bottom Gradient + Sliding Architecture Telemetry Bar */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e18] via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 truncate">
                            <Terminal className="size-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{meta.architectureNote}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-semibold"
                          style={{
                            borderColor: `${meta.accentColor}45`,
                            backgroundColor: `${meta.accentColor}18`,
                            color: '#f8fafc',
                          }}
                        >
                          {proj.tag}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">● Verified Repo</span>
                      </div>

                      <h3 className="text-xl font-black text-white mt-3 group-hover:text-cyan-300 transition-colors tracking-tight">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(proj.technologies || []).map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] text-neutral-200 border border-white/10 group-hover:border-cyan-500/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:text-cyan-300 flex items-center gap-2 font-bold transition"
                    >
                      <Github className="size-4" />
                      <span>Open GitHub Repository</span>
                      <ArrowUpRight className="size-3.5" />
                    </a>

                    {proj.liveUrl && proj.liveUrl !== '#' && (
                      <a
                        href={proj.liveUrl}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition"
                      >
                        <span>Explore</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

        {/* 3D WorksWheel Project Showcase */}
        <div className="p-6 rounded-3xl bg-[#0b0e18]/80 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="size-5 text-indigo-400" />
                <span>Interactive 3D Systems Drum</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">3D perspective portfolio browser</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Scroll or drag</span>
            </span>
          </div>

          <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 relative">
            <WorksWheel items={PROJECT_WHEEL_ITEMS} label="AYushMan" action="GitHub" />
          </div>
        </div>

        {/* Skills Matrix */}
        <div className="p-6 rounded-3xl bg-[#0b0e18]/80 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Cpu className="size-4" />
              </div>
              <h3 className="text-base font-bold text-white">Technical Skills &amp; Proficiencies</h3>
            </div>
            <span className="text-xs font-mono text-neutral-400">Core CS &amp; Full-Stack</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <SpotlightCard 
                key={skill.id} 
                enableTilt={true}
                maxTilt={5}
                spotlightColor="rgba(168, 85, 247, 0.15)"
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-purple-400/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{skill.name}</span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase font-mono pt-1">
                  <span>{skill.category}</span>
                  {skill.verified && <span className="text-emerald-400 font-medium">Verified</span>}
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default DeveloperPage;
