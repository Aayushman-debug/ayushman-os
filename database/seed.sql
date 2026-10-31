-- AYushMan Authentic Seed Data
-- Extracted from genuine RTU Marksheets & CSE Syllabus Documents

USE ayushman_os;

-- 1. Primary User: Ayushman Pathak
INSERT INTO users (id, username, email, password_hash, full_name, father_name, college_name, branch, university, roll_no, enrollment_no, avatar_url, bio, role)
VALUES (
    1,
    'ayushman',
    'pathakaayushman57@gmail.com',
    '',
    'AYushMan',
    'Sanjay Kumar Pathak',
    'Arya College of Engineering & Information Technology, Jaipur (Kukas)',
    'Computer Science and Engineering',
    'Rajasthan Technical University, Kota',
    '24EARCS003',
    '24E1ARCSM40P003',
    '/assets/profile/ayushman.jpg',
    'Computer Science & Engineering student.',
    'admin'
) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), avatar_url = VALUES(avatar_url);

-- 2. Schooling Academic Records
INSERT INTO academic_records (user_id, education_level, institution_name, board, passing_year, percentage)
VALUES 
(1, 'Class 10', 'St. Xavier High School', 'CBSE', 2022, 92.40),
(1, 'Class 12', 'Senior Secondary Public School', 'CBSE', 2024, 88.60)
ON DUPLICATE KEY UPDATE passing_year = VALUES(passing_year);

-- 3. B.Tech Semesters
INSERT INTO semesters (id, user_id, semester_number, academic_year, status, sgpa, total_credits, remarks)
VALUES 
(1, 1, 1, '2024-2025', 'completed', 8.42, 21, 'PASS'),
(2, 1, 2, '2024-2025', 'completed', 8.55, 21, 'PASS'),
(3, 1, 3, '2025-2026', 'completed', 8.28, 24, 'PASS'),
(4, 1, 4, '2025-2026', 'completed', 8.60, 24, 'PASS'),
(5, 1, 5, '2026-2027', 'active', NULL, 23, 'IN PROGRESS - RTU CSE CORE')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 4. Semester 1 Subjects & Marks (Authentic RTU Main Exam 2025 Marksheet)
INSERT INTO subjects (id, semester_id, course_code, course_title, course_type, credits, max_internal, max_endterm)
VALUES
(101, 1, '1FY1-04', 'Communication Skills', 'theory', 2, 30, 70),
(102, 1, '1FY1-22', 'Language Lab', 'lab', 1, 60, 40),
(103, 1, '1FY2-01', 'Engineering Mathematics-I', 'theory', 4, 30, 70),
(104, 1, '1FY2-02', 'Engineering Physics', 'theory', 4, 30, 70),
(105, 1, '1FY2-20', 'Engineering Physics Lab', 'lab', 1, 60, 40),
(106, 1, '1FY3-06', 'Programming For Problem Solving', 'theory', 3, 30, 70),
(107, 1, '1FY3-08', 'Basic Electrical Engineering', 'theory', 2, 30, 70),
(108, 1, '1FY3-24', 'Computer Programming Lab', 'lab', 1.5, 60, 40),
(109, 1, '1FY3-26', 'Basic Electrical Engineering Lab', 'lab', 1, 60, 40),
(110, 1, '1FY3-29', 'Computer Aided Machine Drawing', 'lab', 1.5, 60, 40),
(111, 1, 'FEC01', 'Sports I', 'sports', 0.5, 0, 100)
ON DUPLICATE KEY UPDATE course_title = VALUES(course_title);

INSERT INTO marks (subject_id, midterm_marks, endterm_marks, grade, passed)
VALUES
(101, 25, 40, 'B', TRUE),
(102, 49, 31, 'A+', TRUE),
(103, 24, 31, 'C', TRUE),
(104, 27, 27, 'C', TRUE),
(105, 52, 32, 'A++', TRUE),
(106, 27, 51, 'A+', TRUE),
(107, 25, 32, 'C', TRUE),
(108, 56, 35, 'A++', TRUE),
(109, 53, 36, 'A++', TRUE),
(110, 53, 35, 'A++', TRUE),
(111, 0, 82, 'A++', TRUE)
ON DUPLICATE KEY UPDATE grade = VALUES(grade);

-- 5. Semester 2 Subjects & Marks (Authentic RTU Main Exam 2025 Marksheet)
INSERT INTO subjects (id, semester_id, course_code, course_title, course_type, credits, max_internal, max_endterm)
VALUES
(201, 2, '2FY1-05', 'Human Values', 'theory', 2, 30, 70),
(202, 2, '2FY1-23', 'Human Values Activities & Sports', 'sports', 1, 60, 40),
(203, 2, '2FY2-01', 'Engineering Mathematics-II', 'theory', 4, 30, 70),
(204, 2, '2FY2-03', 'Engineering Chemistry', 'theory', 4, 30, 70),
(205, 2, '2FY2-21', 'Engineering Chemistry Lab', 'lab', 1, 60, 40),
(206, 2, '2FY3-07', 'Basic Mechanical Engineering', 'theory', 2, 30, 70),
(207, 2, '2FY3-09', 'Basic Civil Engineering', 'theory', 2, 30, 70),
(208, 2, '2FY3-25', 'Manufacturing Practices Workshop', 'lab', 1.5, 60, 40),
(209, 2, '2FY3-27', 'Basic Civil Engineering Lab', 'lab', 1, 60, 40),
(210, 2, '2FY3-28', 'Computer Aided Engineering Graphics', 'lab', 1.5, 60, 40),
(211, 2, 'FEC02', 'Sports II', 'sports', 0.5, 0, 100)
ON DUPLICATE KEY UPDATE course_title = VALUES(course_title);

INSERT INTO marks (subject_id, midterm_marks, endterm_marks, grade, passed)
VALUES
(201, 25, 47, 'A', TRUE),
(202, 55, 33, 'A++', TRUE),
(203, 26, 33, 'C+', TRUE),
(204, 24, 40, 'B', TRUE),
(205, 48, 32, 'A+', TRUE),
(206, 24, 44, 'B+', TRUE),
(207, 24, 37, 'C+', TRUE),
(208, 49, 35, 'A++', TRUE),
(209, 51, 33, 'A++', TRUE),
(210, 50, 30, 'A+', TRUE),
(211, 0, 85, 'A++', TRUE)
ON DUPLICATE KEY UPDATE grade = VALUES(grade);

-- 6. Semester 3 Subjects & Marks (Authentic RTU Main Exam 2026 Marksheet)
INSERT INTO subjects (id, semester_id, course_code, course_title, course_type, credits, max_internal, max_endterm)
VALUES
(301, 3, '3CS1-03', 'Managerial Economics & Financial Accounting', 'theory', 2, 30, 70),
(302, 3, '3CS2-01', 'Advanced Engineering Mathematics', 'theory', 3, 30, 70),
(303, 3, '3CS3-04', 'Digital Electronics', 'theory', 3, 30, 70),
(304, 3, '3CS4-05', 'Data Structures & Algorithms', 'theory', 3, 30, 70),
(305, 3, '3CS4-06', 'Object Oriented Programming', 'theory', 3, 30, 70),
(306, 3, '3CS4-07', 'Software Engineering', 'theory', 3, 30, 70),
(307, 3, '3CS4-21', 'Data Structures & Algorithms Lab', 'lab', 1.5, 60, 40),
(308, 3, '3CS4-22', 'Object Oriented Programming Lab', 'lab', 1.5, 60, 40),
(309, 3, '3CS4-23', 'Software Engineering Lab', 'lab', 1.5, 60, 40),
(310, 3, '3CS4-24', 'Digital Electronics Lab', 'lab', 1.5, 60, 40),
(311, 3, '3CS7-30', 'Industrial Training', 'training', 1, 60, 40),
(312, 3, 'FEC16', 'Business Communication & Presentation Skills', 'sports', 0.5, 0, 100)
ON DUPLICATE KEY UPDATE course_title = VALUES(course_title);

INSERT INTO marks (subject_id, midterm_marks, endterm_marks, grade, passed)
VALUES
(301, 29, 39, 'B+', TRUE),
(302, 26, 21, 'D', TRUE),
(303, 20, 33, 'D+', TRUE),
(304, 21, 34, 'C', TRUE),
(305, 25, 57, 'A++', TRUE),
(306, 21, 43, 'B', TRUE),
(307, 51, 29, 'A+', TRUE),
(308, 47, 29, 'A+', TRUE),
(309, 38, 32, 'B+', TRUE),
(310, 51, 29, 'A+', TRUE),
(311, 49, 26, 'A', TRUE),
(312, 0, 77, 'A+', TRUE)
ON DUPLICATE KEY UPDATE grade = VALUES(grade);

-- 7. Semester 5 Subjects (Active RTU Syllabus)
INSERT INTO subjects (id, semester_id, course_code, course_title, course_type, credits, max_internal, max_endterm)
VALUES
(501, 5, '5CS3-01', 'Information Theory & Coding', 'theory', 2, 20, 80),
(502, 5, '5CS4-02', 'Compiler Design', 'theory', 3, 30, 120),
(503, 5, '5CS4-03', 'Operating System', 'theory', 3, 30, 120),
(504, 5, '5CS4-04', 'Computer Graphics & Multimedia', 'theory', 3, 30, 120),
(505, 5, '5CS4-05', 'Analysis of Algorithms', 'theory', 3, 30, 120),
(506, 5, '5CS5-11', 'Wireless Communication', 'elective', 2, 20, 80),
(507, 5, '5CS4-21', 'Computer Graphics & Multimedia Lab', 'lab', 1, 30, 20),
(508, 5, '5CS4-22', 'Compiler Design Lab', 'lab', 1, 30, 20),
(509, 5, '5CS4-23', 'Analysis of Algorithms Lab', 'lab', 1, 30, 20),
(510, 5, '5CS4-24', 'Advance Java Lab', 'lab', 1, 30, 20)
ON DUPLICATE KEY UPDATE course_title = VALUES(course_title);

-- 8. Syllabus Topics for Sem 5 Core Subjects
INSERT INTO syllabus_topics (subject_id, unit_number, unit_title, content_details, teaching_hours, completed)
VALUES
-- Compiler Design (5CS4-02)
(502, 1, 'Introduction to Compiler', 'Compiler, Translator, Interpreter, Phases of compiler, Bootstrapping, Finite automata lexical analyzer, LEX generator', 6, TRUE),
(502, 2, 'CFG & Parsing Techniques', 'Top down parsing, LL grammars, Recursive descent, Shift reduce, LR parsers (SLR, CLR, LALR), Ambiguous grammar, YACC', 10, FALSE),
(502, 3, 'Syntax Directed Definitions & Intermediate Code', 'Syntax trees, S-Attributed, L-Attributed, DAG, Three address code (TAC), Quadruples, Triples', 10, FALSE),
(502, 4, 'Storage Organization & Activation Records', 'Storage allocation strategies, Activation records, Symbol table organization', 8, FALSE),
(502, 5, 'Basic Blocks & Code Optimization', 'Flow graphs, DAG representation, Loop optimization, Global data flow, Peephole optimization, Code generator', 7, FALSE),
-- Operating System (5CS4-03)
(503, 1, 'Structure & Processor Management', 'Inter-process communication, Mutual exclusion, Semaphores, Process scheduling algorithms, Threads, Multithreading', 4, TRUE),
(503, 2, 'Memory Management & Virtual Memory', 'Contiguous allocation, Paging, Page tables, Demand paging, Page replacement policies, Thrashing, Segmentation', 5, TRUE),
(503, 3, 'Deadlock & Device Management', 'Resource allocation, Deadlock detection, avoidance, prevention algorithms, Disk scheduling algorithms', 15, FALSE),
(503, 4, 'File Systems & Security', 'File concept, Directory structure, Access matrices, File security, User authentication', 7, FALSE),
(503, 5, 'Case Studies (UNIX/Linux/Mobile OS)', 'UNIX/Linux internals, Real-time OS, Android/Mobile architecture', 8, FALSE),
-- Analysis of Algorithms (5CS4-05)
(505, 1, 'Algorithm Analysis & Divide and Conquer', 'Asymptotic notation, Recurrences, Binary Search, Merge Sort, Quick Sort, Strassen matrix multiplication', 6, TRUE),
(505, 2, 'Greedy & Dynamic Programming', 'Knapsack problem, Job sequencing, Kruskal/Prim MST, Matrix Chain Multiplication, Longest Common Subsequence (LCS), 0/1 Knapsack', 10, TRUE),
(505, 3, 'Branch & Bound, Backtracking & Pattern Matching', 'Traveling Salesman Problem, N-Queens problem, Naive, Rabin-Karp, KMP Matcher, Boyer Moore', 8, FALSE),
(505, 4, 'Assignment & Randomized Algorithms', 'Assignment Problem, Quadratic Assignment, Las Vegas, Monte Carlo, Min-Cut, 2-SAT', 8, FALSE),
(505, 5, 'NP-Completeness & Approximation', 'P, NP, NP-Hard, NP-Complete, Cook Theorem, Satisfiability, Vertex Cover, Approximation algorithms', 8, FALSE)
ON DUPLICATE KEY UPDATE unit_title = VALUES(unit_title);

-- 9. Daily Check-in & Habits
INSERT INTO daily_checkins (user_id, checkin_date, study_hours, topics_completed, questions_solved, tasks_completed, mood, energy_level, sleep_hours, journal_entry, tomorrow_priorities)
VALUES
(1, CURDATE(), 6.5, 'Algorithms: Dynamic Programming (LCS & MCM), Compiler: Syntax Directed Translation', 8, 5, 'Energized', 9, 7.5, 'Crushed the DP concept matrix today. AYUSHMAN OS architecture is taking real shape!', 'Finish Operating System Deadlock graph algorithms and advance Node.js backend integration.')
ON DUPLICATE KEY UPDATE study_hours = VALUES(study_hours);

INSERT INTO habits (user_id, title, category, streak, target_frequency)
VALUES
(1, 'LeetCode Problem Solving', 'Coding', 24, 'Daily'),
(1, 'CSE Core Subjects Revision', 'Academics', 18, 'Daily'),
(1, 'Personal Website Development', 'Project', 12, 'Daily'),
(1, 'Workout & Physical Training', 'Health', 15, '5x/week')
ON DUPLICATE KEY UPDATE streak = VALUES(streak);

-- 10. Tasks
INSERT INTO tasks (user_id, title, description, priority, status, due_date, tag)
VALUES
(1, 'Review Compiler Design SLR & CLR Parsers', 'Practice constructing parsing tables and parse trees for upcoming midterm', 'high', 'in_progress', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Academics'),
(1, 'Implement WorksWheel interactive 3D Project Browser', 'Connect live project data to 3D perspective drum component', 'urgent', 'completed', CURDATE(), 'Projects'),
(1, 'Revise Dijkstra and Kruskal algorithms in C++', 'Solve 4 classic graph problems on LeetCode / GFG', 'medium', 'todo', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'DSA'),
(1, 'Connect Spotify Web API OAuth Callback', 'Fetch currently playing track and favorite playlists', 'high', 'in_progress', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'Music')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 11. Entertainment: Anime Archive
INSERT INTO anime_entries (user_id, title, anilist_id, poster_url, format, total_episodes, episodes_watched, status, score, favorite_character, notes)
VALUES
(1, 'Attack on Titan (Shingeki no Kyojin)', 16498, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop', 'TV', 89, 89, 'completed', 10.0, 'Levi Ackerman', 'Masterpiece storytelling, philosophical depth and unmatched plot pacing.'),
(1, 'Jujutsu Kaisen', 113415, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop', 'TV', 47, 47, 'completed', 9.5, 'Satoru Gojo', 'Domain expansion choreography and Gojo vs Sukuna intensity are elite.'),
(1, 'Solo Leveling (Ore dake Level Up na Ken)', 151807, 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop', 'TV', 12, 12, 'completed', 9.2, 'Sung Jin-woo', 'Arise! Outstanding animation by A-1 Pictures.'),
(1, 'Demon Slayer: Kimetsu no Yaiba', 101922, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop', 'TV', 55, 55, 'completed', 9.0, 'Tanjiro Kamado', 'Ufotable animation quality is peak cinema.')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 12. Cinema Universe
INSERT INTO movie_entries (user_id, title, tmdb_id, media_type, poster_url, release_year, status, rating, review)
VALUES
(1, 'Interstellar', 157336, 'movie', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop', 2014, 'watched', 9.8, 'Nolan at his peak. The emotional resonance combined with relativistic physics and Zimmer score is transcendent.'),
(1, 'Oppenheimer', 872585, 'movie', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop', 2023, 'watched', 9.4, 'Intense psychological pacing and incredible sound design.'),
(1, 'Inception', 27205, 'movie', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop', 2010, 'watched', 9.5, 'A mind-bending masterclass in layered narrative structure.')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 13. Music Collections
INSERT INTO music_collections (user_id, title, provider, external_url, embed_id, cover_url, mood, track_count, is_favorite)
VALUES
(1, 'Late Night Code & Cyber Beats', 'spotify', 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM', '37i9dQZF1DXdLEN7aqioXM', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop', 'Deep Focus', 45, TRUE),
(1, 'Anime Epic Openings & OSTs', 'spotify', 'https://open.spotify.com/playlist/37i9dQZF1DX0hWmn8726Rh', '37i9dQZF1DX0hWmn8726Rh', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop', 'Hype & Energy', 32, TRUE),
(1, 'Synthwave Space Odyssey', 'youtube', 'https://music.youtube.com', 'PLFgquLnL59alW3xmYiWRaoz0oM3HTr0e7', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop', 'Atmospheric', 28, FALSE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 14. Gaming Profile (BGMI, Valorant, Minecraft)
INSERT INTO gaming_profiles (user_id, game_name, in_game_id, uid, server_region, current_rank, peak_rank, clan_team, role, is_public)
VALUES
(1, 'BGMI (Battlegrounds Mobile India)', 'AYUSHMAN_GOD', '5128947392', 'India', 'Ace Dominator', 'Conqueror', 'VORTEX_ELITE', 'Assaulter & IGL', TRUE),
(1, 'Valorant', 'Ayushman#DEV', 'AYUSHMAN#999', 'Mumbai (AP)', 'Ascendant 2', 'Immortal 1', 'Team Void', 'Initiator / Duelist', TRUE),
(1, 'Minecraft', 'AyushmanCraft', 'MC-908124', 'Global / SMP', 'Architect', 'Redstone Master', 'CosmosSMP', 'Builder & Engineer', TRUE)
ON DUPLICATE KEY UPDATE current_rank = VALUES(current_rank);

-- 15. Developer Skills & Projects
INSERT INTO developer_skills (user_id, name, category, proficiency, verified)
VALUES
(1, 'C++ / STL', 'language', 92, TRUE),
(1, 'Python', 'language', 88, TRUE),
(1, 'Java / J2EE', 'language', 85, TRUE),
(1, 'SQL & Relational DBs (MySQL)', 'database', 90, TRUE),
(1, 'Data Structures & Algorithms', 'core_cs', 90, TRUE),
(1, 'Operating Systems & Networking', 'core_cs', 86, TRUE),
(1, 'React & TypeScript', 'web', 92, TRUE),
(1, 'Node.js & Express', 'web', 89, TRUE),
(1, 'Git & GitHub Workflows', 'tools', 94, TRUE)
ON DUPLICATE KEY UPDATE proficiency = VALUES(proficiency);

INSERT INTO developer_projects (user_id, title, tag, description, technologies, github_url, live_url, image_url, featured)
VALUES
(1, 'AYushMan', 'Personal Website', 'A personal website combining academic records, daily tracking, entertainment, and interactive components.', '["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MySQL", "GSAP"]', 'https://github.com/Aayushman-debug/ayushman-os', 'https://ayushman-os.vercel.app', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop', TRUE),
(1, 'Mithila Art Heritage Platform', 'Full-Stack E-Commerce & Cultural Archive', 'Platform preserving and exhibiting traditional Madhubani/Mithila artworks with secure transactions, artist profiles, and catalog management.', '["React", "Node.js", "Express", "Tailwind", "Vercel", "Render"]', 'https://github.com/Aayushman-debug/mithila-art', '#', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop', TRUE),
(1, 'CampusConnect University Portal', 'Academic & Social Collaboration Engine', 'Campus management system connecting students, faculty, timetables, and resource sharing with role-based access.', '["React", "Node.js", "MySQL", "Tailwind"]', 'https://github.com/Aayushman-debug/CampusConnect', '#', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop', TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title);
