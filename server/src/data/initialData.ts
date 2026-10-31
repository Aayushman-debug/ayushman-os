export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  fatherName: string;
  collegeName: string;
  branch: string;
  university: string;
  rollNo: string;
  enrollmentNo: string;
  bio: string;
  role: string;
  avatarUrl: string;
}

export const initialUser: UserProfile = {
  id: 1,
  username: 'ayushman',
  email: 'pathakaayushman57@gmail.com',
  fullName: 'AYushMan',
  fatherName: 'Sanjay Kumar Pathak',
  collegeName: 'Arya College of Engineering & Information Technology, Jaipur (Kukas)',
  branch: 'Computer Science and Engineering',
  university: 'Rajasthan Technical University, Kota',
  rollNo: '24EARCS003',
  enrollmentNo: '24E1ARCSM40P003',
  bio: 'Computer Science & Engineering student.',
  role: 'admin',
  avatarUrl: '/assets/profile/ayushman.jpg',
};

export const initialSemesters = [
  {
    id: 1,
    semesterNumber: 1,
    academicYear: '2024-2025',
    status: 'completed',
    sgpa: 8.42,
    totalCredits: 21,
    remarks: 'PASS',
    subjects: [
      { code: '1FY1-04', title: 'Communication Skills', type: 'theory', credits: 2, midterm: 25, endterm: 40, grade: 'B' },
      { code: '1FY1-22', title: 'Language Lab', type: 'lab', credits: 1, midterm: 49, endterm: 31, grade: 'A+' },
      { code: '1FY2-01', title: 'Engineering Mathematics-I', type: 'theory', credits: 4, midterm: 24, endterm: 31, grade: 'C' },
      { code: '1FY2-02', title: 'Engineering Physics', type: 'theory', credits: 4, midterm: 27, endterm: 27, grade: 'C' },
      { code: '1FY2-20', title: 'Engineering Physics Lab', type: 'lab', credits: 1, midterm: 52, endterm: 32, grade: 'A++' },
      { code: '1FY3-06', title: 'Programming For Problem Solving', type: 'theory', credits: 3, midterm: 27, endterm: 51, grade: 'A+' },
      { code: '1FY3-08', title: 'Basic Electrical Engineering', type: 'theory', credits: 2, midterm: 25, endterm: 32, grade: 'C' },
      { code: '1FY3-24', title: 'Computer Programming Lab', type: 'lab', credits: 1.5, midterm: 56, endterm: 35, grade: 'A++' },
      { code: '1FY3-26', title: 'Basic Electrical Engineering Lab', type: 'lab', credits: 1, midterm: 53, endterm: 36, grade: 'A++' },
      { code: '1FY3-29', title: 'Computer Aided Machine Drawing', type: 'lab', credits: 1.5, midterm: 53, endterm: 35, grade: 'A++' },
      { code: 'FEC01', title: 'Sports I', type: 'sports', credits: 0.5, midterm: 0, endterm: 82, grade: 'A++' },
    ]
  },
  {
    id: 2,
    semesterNumber: 2,
    academicYear: '2024-2025',
    status: 'completed',
    sgpa: 8.55,
    totalCredits: 21,
    remarks: 'PASS',
    subjects: [
      { code: '2FY1-05', title: 'Human Values', type: 'theory', credits: 2, midterm: 25, endterm: 47, grade: 'A' },
      { code: '2FY1-23', title: 'Human Values Activities & Sports', type: 'sports', credits: 1, midterm: 55, endterm: 33, grade: 'A++' },
      { code: '2FY2-01', title: 'Engineering Mathematics-II', type: 'theory', credits: 4, midterm: 26, endterm: 33, grade: 'C+' },
      { code: '2FY2-03', title: 'Engineering Chemistry', type: 'theory', credits: 4, midterm: 24, endterm: 40, grade: 'B' },
      { code: '2FY2-21', title: 'Engineering Chemistry Lab', type: 'lab', credits: 1, midterm: 48, endterm: 32, grade: 'A+' },
      { code: '2FY3-07', title: 'Basic Mechanical Engineering', type: 'theory', credits: 2, midterm: 24, endterm: 44, grade: 'B+' },
      { code: '2FY3-09', title: 'Basic Civil Engineering', type: 'theory', credits: 2, midterm: 24, endterm: 37, grade: 'C+' },
      { code: '2FY3-25', title: 'Manufacturing Practices Workshop', type: 'lab', credits: 1.5, midterm: 49, endterm: 35, grade: 'A++' },
      { code: '2FY3-27', title: 'Basic Civil Engineering Lab', type: 'lab', credits: 1, midterm: 51, endterm: 33, grade: 'A++' },
      { code: '2FY3-28', title: 'Computer Aided Engineering Graphics', type: 'lab', credits: 1.5, midterm: 50, endterm: 30, grade: 'A+' },
      { code: 'FEC02', title: 'Sports II', type: 'sports', credits: 0.5, midterm: 0, endterm: 85, grade: 'A++' },
    ]
  },
  {
    id: 3,
    semesterNumber: 3,
    academicYear: '2025-2026',
    status: 'completed',
    sgpa: 8.28,
    totalCredits: 24,
    remarks: 'PASS',
    subjects: [
      { code: '3CS1-03', title: 'Managerial Economics & Financial Accounting', type: 'theory', credits: 2, midterm: 29, endterm: 39, grade: 'B+' },
      { code: '3CS2-01', title: 'Advanced Engineering Mathematics', type: 'theory', credits: 3, midterm: 26, endterm: 21, grade: 'D' },
      { code: '3CS3-04', title: 'Digital Electronics', type: 'theory', credits: 3, midterm: 20, endterm: 33, grade: 'D+' },
      { code: '3CS4-05', title: 'Data Structures & Algorithms', type: 'theory', credits: 3, midterm: 21, endterm: 34, grade: 'C' },
      { code: '3CS4-06', title: 'Object Oriented Programming', type: 'theory', credits: 3, midterm: 25, endterm: 57, grade: 'A++' },
      { code: '3CS4-07', title: 'Software Engineering', type: 'theory', credits: 3, midterm: 21, endterm: 43, grade: 'B' },
      { code: '3CS4-21', title: 'Data Structures & Algorithms Lab', type: 'lab', credits: 1.5, midterm: 51, endterm: 29, grade: 'A+' },
      { code: '3CS4-22', title: 'Object Oriented Programming Lab', type: 'lab', credits: 1.5, midterm: 47, endterm: 29, grade: 'A+' },
      { code: '3CS4-23', title: 'Software Engineering Lab', type: 'lab', credits: 1.5, midterm: 38, endterm: 32, grade: 'B+' },
      { code: '3CS4-24', title: 'Digital Electronics Lab', type: 'lab', credits: 1.5, midterm: 51, endterm: 29, grade: 'A+' },
      { code: '3CS7-30', title: 'Industrial Training', type: 'training', credits: 1, midterm: 49, endterm: 26, grade: 'A' },
      { code: 'FEC16', title: 'Business Communication & Presentation Skills', type: 'sports', credits: 0.5, midterm: 0, endterm: 77, grade: 'A+' },
    ]
  },
  {
    id: 4,
    semesterNumber: 4,
    academicYear: '2025-2026',
    status: 'completed',
    sgpa: 8.60,
    totalCredits: 24,
    remarks: 'PASS',
    subjects: [
      { code: '4CS1-01', title: 'Discrete Mathematical Structures', type: 'theory', credits: 3, midterm: 27, endterm: 52, grade: 'A+' },
      { code: '4CS2-02', title: 'Technical Communication', type: 'theory', credits: 2, midterm: 26, endterm: 44, grade: 'A' },
      { code: '4CS3-03', title: 'Microprocessor & Interfaces', type: 'theory', credits: 3, midterm: 24, endterm: 41, grade: 'B+' },
      { code: '4CS4-04', title: 'Database Management Systems', type: 'theory', credits: 3, midterm: 28, endterm: 58, grade: 'A++' },
      { code: '4CS4-05', title: 'Theory of Computation', type: 'theory', credits: 3, midterm: 25, endterm: 48, grade: 'A' },
      { code: '4CS4-06', title: 'Data Communication and Computer Networks', type: 'theory', credits: 3, midterm: 26, endterm: 46, grade: 'A' },
      { code: '4CS4-21', title: 'Microprocessor & Interfaces Lab', type: 'lab', credits: 1.5, midterm: 52, endterm: 32, grade: 'A++' },
      { code: '4CS4-22', title: 'Database Management Systems Lab', type: 'lab', credits: 1.5, midterm: 55, endterm: 34, grade: 'A++' },
      { code: '4CS4-23', title: 'Network Programming Lab', type: 'lab', credits: 1.5, midterm: 50, endterm: 31, grade: 'A+' },
      { code: '4CS4-24', title: 'Linux Shell Programming Lab', type: 'lab', credits: 1.5, midterm: 54, endterm: 33, grade: 'A++' },
      { code: '4CS4-25', title: 'Java Programming Lab', type: 'lab', credits: 1.5, midterm: 56, endterm: 35, grade: 'A++' },
    ]
  },
  {
    id: 5,
    semesterNumber: 5,
    academicYear: '2026-2027',
    status: 'active',
    sgpa: null,
    totalCredits: 23,
    remarks: 'CURRENT ACTIVE WORKSPACE (RTU CSE)',
    subjects: [
      {
        id: 501,
        code: '5CS3-01',
        title: 'Information Theory & Coding',
        type: 'theory',
        credits: 2,
        maxInternal: 20,
        maxEndterm: 80,
        units: [
          { unit: 1, title: 'Introduction', hours: 1, completed: true, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Introduction to information theory', hours: 5, completed: true, content: 'Uncertainty, Information and Entropy, Discrete Memoryless channels, Mutual information.' },
          { unit: 3, title: 'Source coding schemes for data compaction', hours: 5, completed: false, content: 'Prefix code, Huffman code, Shannon-Fano code, Lempel-Ziv coding, Channel capacity, Shannon limit.' },
          { unit: 4, title: 'Linear Block Code', hours: 5, completed: false, content: 'Error correcting codes, Systematic form of matrices, Minimum distance.' },
          { unit: 5, title: 'Cyclic Code', hours: 6, completed: false, content: 'Code Algebra, Galois fields (GF), Generator polynomial, Parity check polynomial.' },
          { unit: 6, title: 'Convolutional Code', hours: 6, completed: false, content: 'Trellis and state diagrams, Maximum likelihood decoding, Viterbi Algorithm.' }
        ]
      },
      {
        id: 502,
        code: '5CS4-02',
        title: 'Compiler Design',
        type: 'theory',
        credits: 3,
        maxInternal: 30,
        maxEndterm: 120,
        units: [
          { unit: 1, title: 'Introduction & Lexical Analysis', hours: 6, completed: true, content: 'Phases of compiler, Bootstrapping, Finite automata lexical analyzer, LEX generator.' },
          { unit: 2, title: 'CFG & Parsing Techniques', hours: 10, completed: true, content: 'Top-down & Bottom-up parsing, LL, LR, SLR, CLR, LALR parsing tables, Ambiguous grammars, YACC.' },
          { unit: 3, title: 'Syntax Directed Definitions & Intermediate Code', hours: 10, completed: false, content: 'Syntax trees, S-Attributed, L-Attributed, DAG, Three-address code (TAC), Triples and Quadruples.' },
          { unit: 4, title: 'Storage Organization', hours: 8, completed: false, content: 'Storage allocation, Activation records, Symbol table organization, Data structures.' },
          { unit: 5, title: 'Code Optimization & Generation', hours: 7, completed: false, content: 'Basic blocks, Control Flow Graphs, Loop optimization, Peephole optimization, Code generation from DAG.' }
        ]
      },
      {
        id: 503,
        code: '5CS4-03',
        title: 'Operating System',
        type: 'theory',
        credits: 3,
        maxInternal: 30,
        maxEndterm: 120,
        units: [
          { unit: 1, title: 'Structure & Processor Management', hours: 4, completed: true, content: 'Processes and files, IPC, Mutual exclusion, Semaphores, Scheduling algorithms, Threads.' },
          { unit: 2, title: 'Memory Management', hours: 5, completed: true, content: 'Contiguous allocation, Virtual memory, Paging, Page replacement policies, Thrashing, Segmentation.' },
          { unit: 3, title: 'Deadlock & Device Management', hours: 15, completed: false, content: 'Resource allocation, Deadlock detection, avoidance (Banker\'s), prevention, Disk scheduling.' },
          { unit: 4, title: 'File Management', hours: 7, completed: false, content: 'File concept, Directory structure, Access methods, File security, Authentication.' },
          { unit: 5, title: 'Case Studies: UNIX, Linux, Mobile OS', hours: 8, completed: false, content: 'UNIX and Linux internals, Real-time OS, Mobile OS architecture.' }
        ]
      },
      {
        id: 504,
        code: '5CS4-04',
        title: 'Computer Graphics & Multimedia',
        type: 'theory',
        credits: 3,
        maxInternal: 30,
        maxEndterm: 120,
        units: [
          { unit: 1, title: 'Basics & Display Devices', hours: 6, completed: true, content: 'Raster and Random scan systems, Graphics input devices, Software standards.' },
          { unit: 2, title: 'Graphics Primitives & Scan Conversion', hours: 7, completed: true, content: 'Points, Lines, Circles, Ellipses, DDA & Mid-point circle, Polygon filling, Aliasing.' },
          { unit: 3, title: 'Two-Dimensional Graphics', hours: 8, completed: false, content: 'Transformations, Homogeneous coordinates, Viewing pipeline, Clipping (Cohen-Sutherland, Liang-Barsky).' },
          { unit: 4, title: 'Three-Dimensional Graphics', hours: 8, completed: false, content: '3D displays, Polygon surfaces, Splines, Bezier curves, 3D transformations, Parallel & Perspective projections.' },
          { unit: 5, title: 'Illumination & Colour Models', hours: 6, completed: false, content: 'Light sources, Halftone patterns, RGB, YIQ, CMY, HSV colour models, Colour selection.' },
          { unit: 6, title: 'Animation & Realism', hours: 6, completed: false, content: 'Key frame systems, Morphing, Tweening, Fractals (Koch, C curves, Dragons), Ray tracing.' }
        ]
      },
      {
        id: 505,
        code: '5CS4-05',
        title: 'Analysis of Algorithms',
        type: 'theory',
        credits: 3,
        maxInternal: 30,
        maxEndterm: 120,
        units: [
          { unit: 1, title: 'Algorithm Analysis & Divide and Conquer', hours: 6, completed: true, content: 'Complexity notations, Binary Search, Merge Sort, Quick Sort, Strassen\'s matrix multiplication.' },
          { unit: 2, title: 'Greedy Method & Dynamic Programming', hours: 10, completed: true, content: 'Knapsack, Job Sequencing, MST (Kruskal, Prim), Matrix Chain Multiplication, Longest Common Subsequence.' },
          { unit: 3, title: 'Branch and Bound, Backtracking & Pattern Matching', hours: 8, completed: false, content: 'TSP, N-Queens problem, Naive, Rabin-Karp, KMP, Boyer Moore.' },
          { unit: 4, title: 'Assignment & Randomized Algorithms', hours: 8, completed: false, content: 'Assignment Problem, Las Vegas, Monte Carlo, Min-Cut, 2-SAT, Flow shop scheduling.' },
          { unit: 5, title: 'P, NP, NP-Hard & NP-Complete', hours: 8, completed: false, content: 'Definitions, Cook\'s Theorem, Satisfiability, Vertex Cover, Approximation algorithms.' }
        ]
      },
      {
        id: 506,
        code: '5CS5-11',
        title: 'Wireless Communication',
        type: 'elective',
        credits: 2,
        maxInternal: 20,
        maxEndterm: 80,
        units: [
          { unit: 1, title: 'Wireless Channels & Path Loss', hours: 6, completed: true, content: 'Free space models, Small scale fading, Doppler spread, Multipath spread.' },
          { unit: 2, title: 'Cellular Architecture', hours: 5, completed: false, content: 'FDMA, TDMA, CDMA, Capacity calculations, Frequency reuse, Hand-off.' },
          { unit: 3, title: 'Digital Signaling for Fading Channels', hours: 5, completed: false, content: 'Offset-QPSK, MSK, GMSK, OFDM principle, Cyclic prefix.' },
          { unit: 4, title: 'Multipath Mitigation & Diversity', hours: 6, completed: false, content: 'Equalisation, Zero forcing, LMS, Micro/Macrodiversity, Rake receiver.' },
          { unit: 5, title: 'Multiple Antenna Techniques (MIMO)', hours: 5, completed: false, content: 'Spatial multiplexing, Beam forming, Transmitter and Receiver diversity.' }
        ]
      },
      {
        id: 507,
        code: '5CS4-21',
        title: 'Computer Graphics & Multimedia Lab',
        type: 'lab',
        credits: 1,
        maxInternal: 30,
        maxEndterm: 20,
        units: [
          { unit: 1, title: 'Line, Circle & Ellipse Attributes', hours: 2, completed: true, content: 'Implementation of Line, Circle and ellipse attributes.' },
          { unit: 2, title: 'Pixel Plotting on Screen', hours: 2, completed: true, content: 'To plot a point (pixel) on the screen.' },
          { unit: 3, title: 'DDA Line Drawing Algorithm', hours: 2, completed: true, content: 'To draw a straight line using DDA Algorithm.' },
          { unit: 4, title: 'Mid-point Circle Algorithm', hours: 2, completed: false, content: 'Implementation of mid-point circle generating Algorithm.' },
          { unit: 5, title: 'Ellipse Generating Algorithm', hours: 2, completed: false, content: 'Implementation of ellipse generating Algorithm.' },
          { unit: 6, title: '2D Geometric Transformations', hours: 2, completed: false, content: 'Two Dimensional transformations - Translation, Rotation, Scaling, Reflection, Shear.' },
          { unit: 7, title: 'Composite 2D Transformations', hours: 2, completed: false, content: 'Implementation of composite 2D transformations.' },
          { unit: 8, title: 'Cohen-Sutherland Line Clipping', hours: 2, completed: false, content: 'Cohen Sutherland 2D line clipping and Windowing.' },
          { unit: 9, title: 'Sutherland-Hodgeman Polygon Clipping', hours: 2, completed: false, content: 'Sutherland – Hodgeman Polygon clipping Algorithm.' },
          { unit: 10, title: '3D Transformations', hours: 2, completed: false, content: 'Three dimensional transformations - Translation, Rotation, Scaling.' },
          { unit: 11, title: 'Composite 3D Transformations', hours: 2, completed: false, content: 'Composite 3D transformations.' },
          { unit: 12, title: '3D Objects & Scenes Rendering', hours: 2, completed: false, content: 'Drawing three dimensional objects and Scenes.' },
          { unit: 13, title: 'Fractal Image Generation', hours: 2, completed: false, content: 'Generating Fractal images.' }
        ]
      },
      {
        id: 508,
        code: '5CS4-22',
        title: 'Compiler Design Lab',
        type: 'lab',
        credits: 1,
        maxInternal: 30,
        maxEndterm: 20,
        units: [
          { unit: 1, title: 'Introduction & Course Objectives', hours: 2, completed: true, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Keyword Identifier Program', hours: 2, completed: true, content: 'To identify whether given string is keyword or not.' },
          { unit: 3, title: 'Keyword Counter in Source File', hours: 2, completed: true, content: 'Count total no. of keywords in a file. [Taking file from user]' },
          { unit: 4, title: 'Operator Counter in Source File', hours: 2, completed: false, content: 'Count total no of operators in a file. [Taking file from user]' },
          { unit: 5, title: 'Character Frequency Analyzer', hours: 2, completed: false, content: 'Count total occurrence of each character in a given file. [Taking file from user]' },
          { unit: 6, title: 'Symbol Table C Implementation', hours: 2, completed: false, content: 'Write a C program to insert, delete and display entries in Symbol Table.' },
          { unit: 7, title: 'LEX Pattern Recognizer', hours: 2, completed: false, content: 'Write a LEX program to identify: Valid mobile number, URL, identifier, date (dd/mm/yyyy), time (hh:mm:ss).' },
          { unit: 8, title: 'LEX Whitespace & Word Counter', hours: 2, completed: false, content: 'Write a lex program to count blank spaces, words, lines in a given file.' },
          { unit: 9, title: 'LEX Vowel & Consonant Counter', hours: 2, completed: false, content: 'Write a lex program to count no. of vowels and consonants in a C file.' },
          { unit: 10, title: 'YACC a^n b^n Parser', hours: 2, completed: false, content: 'Write a YACC program to recognize strings aaab, abbb using a^n b^n, where b>=0.' },
          { unit: 11, title: 'YACC Arithmetic Evaluator', hours: 2, completed: false, content: 'Write a YACC program to evaluate arithmetic expressions (+, -, *, /).' },
          { unit: 12, title: 'YACC Grammar Validator', hours: 2, completed: false, content: 'Write a YACC program to check validity of strings using a^n b^n c^m d^m, where n,m>0.' },
          { unit: 13, title: 'First Function in Grammar (C)', hours: 2, completed: false, content: 'Write a C program to find FIRST of any grammar.' }
        ]
      },
      {
        id: 509,
        code: '5CS4-23',
        title: 'Analysis of Algorithms Lab',
        type: 'lab',
        credits: 1,
        maxInternal: 30,
        maxEndterm: 20,
        units: [
          { unit: 1, title: 'Quicksort Empirical Complexity Analysis', hours: 2, completed: true, content: 'Sort a given set of elements using Quicksort and plot time taken vs n.' },
          { unit: 2, title: 'Parallelized Merge Sort Analysis', hours: 2, completed: true, content: 'Implement parallelized Merge Sort and plot time taken vs n.' },
          { unit: 3, title: 'Topological Sort & Warshall Algorithm', hours: 2, completed: false, content: 'Obtain Topological ordering in digraph and transitive closure using Warshall.' },
          { unit: 4, title: '0/1 Knapsack (Dynamic Programming)', hours: 2, completed: false, content: 'Implement 0/1 Knapsack problem using Dynamic Programming.' },
          { unit: 5, title: 'Dijkstra Shortest Path Algorithm', hours: 2, completed: false, content: 'Find shortest paths from given vertex in weighted graph using Dijkstra.' },
          { unit: 6, title: 'Kruskal Minimum Spanning Tree', hours: 2, completed: false, content: 'Find Minimum Cost Spanning Tree of undirected graph using Kruskal algorithm.' },
          { unit: 7, title: 'BFS Reachability & DFS Connectivity', hours: 2, completed: false, content: 'Print reachable nodes using BFS and check graph connectivity using DFS.' },
          { unit: 8, title: 'Prim Minimum Spanning Tree', hours: 2, completed: false, content: 'Find Minimum Cost Spanning Tree of undirected graph using Prim algorithm.' },
          { unit: 9, title: 'Floyd All-Pairs Shortest Path', hours: 2, completed: false, content: 'Implement All-Pairs Shortest Paths Problem using Floyd algorithm.' },
          { unit: 10, title: 'N-Queens Problem (Backtracking)', hours: 2, completed: false, content: 'Implement N Queen problem using Backtracking.' }
        ]
      },
      {
        id: 510,
        code: '5CS4-24',
        title: 'Advance Java Lab',
        type: 'lab',
        credits: 1,
        maxInternal: 30,
        maxEndterm: 20,
        units: [
          { unit: 1, title: 'Java Swing GUI & MVC Architecture', hours: 2, completed: true, content: 'Swing components: Text Fields, Buttons, Checkboxes, Radio Buttons with MVC.' },
          { unit: 2, title: 'JDBC Database & Network Programming', hours: 2, completed: false, content: 'java.sql JDBC driver, Network Programming with java.net, Client/Server programs.' },
          { unit: 3, title: 'RMI Distributed Architecture & JNDI', hours: 2, completed: false, content: 'RMI architecture, RMI registry, Naming services, JNDI, Object serialization.' },
          { unit: 4, title: 'J2EE Tiered Web Application Concepts', hours: 2, completed: false, content: 'Enterprise application concepts, J2EE platform, HTTP protocol, Web containers.' },
          { unit: 5, title: 'Java Servlets Lifecycle & Session Handling', hours: 2, completed: false, content: 'Servlet API, lifecycle, Request/Response, Session handling, Filters.' },
          { unit: 6, title: 'JSP Architecture, JSTL & Tag Handlers', hours: 2, completed: false, content: 'JSP lifecycle, Expression Language, Tag Extensions, JSTL, XML & SQL tag library.' }
        ]
      }
    ]
  },
  {
    id: 6,
    semesterNumber: 6,
    academicYear: '2026-2027',
    status: 'upcoming',
    sgpa: null,
    totalCredits: 23,
    remarks: 'UPCOMING WORKSPACE (RTU CSE)',
    subjects: [
      {
        id: 601,
        code: '6CS3-01',
        title: 'Digital Image Processing',
        type: 'theory',
        credits: 2,
        maxInternal: 20,
        maxEndterm: 80,
        units: [
          { unit: 1, title: 'Introduction & Course Scope', hours: 1, completed: false, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Digital Image Fundamentals', hours: 4, completed: false, content: 'Digital Image representation, Sampling & Quantization, Steps in image Processing, Image acquisition, color image representation.' },
          { unit: 3, title: 'Image Transformation & Filtering', hours: 6, completed: false, content: 'Intensity transform functions, histogram processing, Spatial filtering, Fourier transforms, frequency domain filters, colour models, Wavelet Transforms.' },
          { unit: 4, title: 'Image Restoration & Degradation Models', hours: 7, completed: false, content: 'Noise Models, Noise Filters, degradation function, Inverse Filtering, Homomorphism Filtering.' },
          { unit: 5, title: 'Image Compression Techniques', hours: 5, completed: false, content: 'Coding redundancy, Psychovisual redundancy, Huffman Coding, Arithmetic coding, Lossy compression, JPEG.' },
          { unit: 6, title: 'Image Segmentation & Representation', hours: 5, completed: false, content: 'Point, Line and Edge Detection, Thresholding, Edge linking, Hough transforms, Region Based Segmentation, Boundary Descriptors.' }
        ]
      },
      {
        id: 602,
        code: '6CS4-02',
        title: 'Machine Learning',
        type: 'theory',
        credits: 3,
        maxInternal: 30,
        maxEndterm: 120,
        units: [
          { unit: 1, title: 'Introduction to Machine Learning', hours: 1, completed: false, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Supervised Learning Algorithms', hours: 9, completed: false, content: 'Linear Regression, Naive Bayes, Decision Tree, KNN, Logistic Regression, Support Vector Machine, Random Forest.' },
          { unit: 3, title: 'Unsupervised Learning & Clustering', hours: 8, completed: false, content: 'K-Means clustering, Hierarchical Clustering, Probabilistic clustering, Association rule mining, Apriori Algorithm, FP-Growth, GMM.' },
          { unit: 4, title: 'Statistical Learning Theory & PCA', hours: 8, completed: false, content: 'PCA, Singular Value Decomposition, Feature selection (filter, wrapper, embedded), Evaluating ML algorithms.' },
          { unit: 5, title: 'Reinforcement Learning & MDP', hours: 8, completed: false, content: 'Markov Decision Process, Bellman equations, Monte Carlo, Policy/Value iteration, Q-Learning, SARSA.' },
          { unit: 6, title: 'Recommender Systems & Deep Learning', hours: 8, completed: false, content: 'Collaborative filtering, Content-based filtering, Artificial Neural Networks, Perceptron, Backpropagation, Deep learning.' }
        ]
      },
      {
        id: 603,
        code: '6CS4-03',
        title: 'Information Security System',
        type: 'theory',
        credits: 2,
        maxInternal: 20,
        maxEndterm: 80,
        units: [
          { unit: 1, title: 'Introduction to Security', hours: 1, completed: false, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Security Attacks & Classical Ciphers', hours: 6, completed: false, content: 'Services and mechanisms, substitution and transposition ciphers, cryptanalysis, stream and block ciphers.' },
          { unit: 3, title: 'Modern Block Ciphers: DES & AES', hours: 6, completed: false, content: 'DES, Triple DES, AES structure, transformation functions, Cipher modes (ECB, CBC, CFB, OFB, CTR).' },
          { unit: 4, title: 'Public Key Cryptosystems', hours: 6, completed: false, content: 'RSA cryptosystem, Rabin cryptosystem, Elgamal cryptosystem, Elliptic curve cryptosystem.' },
          { unit: 5, title: 'Cryptographic Hash Functions & Signatures', hours: 5, completed: false, content: 'SHA, MACs, Digital Signatures (Elgamal, Schnorr, NIST DSA).' },
          { unit: 6, title: 'Key Distribution & Web Security', hours: 4, completed: false, content: 'X.509 certificates, PKI, Kerberos, SSL/TLS architecture, HTTPS, SSH.' }
        ]
      },
      {
        id: 604,
        code: '6CS4-04',
        title: 'Computer Architecture and Organization',
        type: 'theory',
        credits: 3,
        maxInternal: 30,
        maxEndterm: 120,
        units: [
          { unit: 1, title: 'Introduction to Computer Organization', hours: 1, completed: false, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Data Representation & Micro-operations', hours: 10, completed: false, content: 'Floating point, Register Transfer language, Bus and Memory transfers, Arithmetic/Logic/Shift micro-operations, Accumulator Unit.' },
          { unit: 3, title: 'Programming The Basic Computer', hours: 7, completed: false, content: 'Machine Language, Assembly, subroutines, Microprogrammed Control, Control Memory, Address sequencing.' },
          { unit: 4, title: 'CPU Architecture & Pipelining', hours: 8, completed: false, content: 'General Register Organization, Stack, Addressing Modes, RISC Pipeline, Flynn taxonomy, Vector Processing.' },
          { unit: 5, title: 'Computer Arithmetic & I/O Organization', hours: 8, completed: false, content: 'Booth Multiplication, Division, Floating point arithmetic, Asynchronous data transfer, Interrupts, DMA, IOP.' },
          { unit: 6, title: 'Memory Hierarchy & Multiprocessors', hours: 8, completed: false, content: 'Cache Memory, Virtual Memory, Multiprocessors, Interconnection structures, Cache Coherence.' }
        ]
      },
      {
        id: 605,
        code: '6CS4-05',
        title: 'Artificial Intelligence',
        type: 'theory',
        credits: 2,
        maxInternal: 20,
        maxEndterm: 80,
        units: [
          { unit: 1, title: 'Introduction to AI', hours: 1, completed: false, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Intelligent Agents & Search Strategies', hours: 3, completed: false, content: 'BFS, DFS, Iterative deepening, Hill climbing, Heuristic search, A*, AO*, CSP.' },
          { unit: 3, title: 'Game Playing Algorithms', hours: 6, completed: false, content: 'Minimax, Alpha-beta pruning, Jug problem, Chess problem, 8-puzzle tiles problem.' },
          { unit: 4, title: 'Knowledge Representation & Reasoning', hours: 6, completed: false, content: 'Propositional logic, First Order Logic, Situation calculus, Planning, Bayesian Networks.' },
          { unit: 5, title: 'Learning Methods', hours: 7, completed: false, content: 'Decision Trees, SVM, Unsupervised learning, Market Basket Analysis, Neural Networks.' },
          { unit: 6, title: 'Natural Language Processing & Robotics', hours: 5, completed: false, content: 'NLP issues, Expert Systems, Robotics foundations.' }
        ]
      },
      {
        id: 606,
        code: '6CS4-06',
        title: 'Cloud Computing',
        type: 'theory',
        credits: 3,
        maxInternal: 30,
        maxEndterm: 120,
        units: [
          { unit: 1, title: 'Introduction to Cloud Computing', hours: 1, completed: false, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Cloud Paradigms & IoT Ubiquity', hours: 6, completed: false, content: 'Historical development, Vision, Cloud Migration challenges, IoT and Networking support.' },
          { unit: 3, title: 'Cloud Architecture & Programming Models', hours: 10, completed: false, content: 'Cloud Reference Model, MapReduce, Hadoop, High-level Cloud languages, Google App Engine.' },
          { unit: 4, title: 'Virtualization Technologies', hours: 10, completed: false, content: 'Hypervisors (VMware, KVM, Xen), Virtualization of CPU/Memory/IO/Server/Data-center.' },
          { unit: 5, title: 'Cloud Security & SLA Management', hours: 8, completed: false, content: 'Cloud security fundamentals, Policy implementation, Disaster Recovery, SLAs, Trust management.' },
          { unit: 6, title: 'Industry Cloud Platforms', hours: 7, completed: false, content: 'AWS, Google AppEngine, Microsoft Azure, Aneka Cloud Platform, Cloud Applications.' }
        ]
      },
      {
        id: 607,
        code: '6CS5-11',
        title: 'Distributed System (Elective)',
        type: 'elective',
        credits: 2,
        maxInternal: 20,
        maxEndterm: 80,
        units: [
          { unit: 1, title: 'Introduction to Distributed Systems', hours: 1, completed: false, content: 'Objective, scope and outcome of the course.' },
          { unit: 2, title: 'Architectures & Clocks', hours: 6, completed: false, content: 'Distributed operating systems, DCE, Notions of time and state, Lamport clocks, event precedence.' },
          { unit: 3, title: 'Concurrent Processes & RPC/RMI', hours: 5, completed: false, content: 'Threads, Client/Server model, Synchronization, Message Passing, RPC and RMI case studies.' },
          { unit: 4, title: 'Distributed Scheduling & File Systems', hours: 6, completed: false, content: 'Load sharing, DFS design, Concurrency control, NFS, AFS, Coda File System.' },
          { unit: 5, title: 'Distributed Shared Memory & Consensus', hours: 6, completed: false, content: 'NUMA architectures, DSM systems, Distributed Mutual Exclusion, Election, Deadlock handling.' },
          { unit: 6, title: 'Distributed Agreement & CORBA', hours: 5, completed: false, content: 'Byzantine Faults, Consensus impossibility, Replicated Data, CORBA architecture.' }
        ]
      },
      {
        id: 608,
        code: '6CS4-21',
        title: 'Digital Image Processing Lab',
        type: 'lab',
        credits: 1.5,
        maxInternal: 45,
        maxEndterm: 30,
        units: [
          { unit: 1, title: 'Point-to-point Transformation & Histogram Equalization', hours: 2, completed: false, content: 'Thresholding an image, histogram evaluation, histogram equalization.' },
          { unit: 2, title: 'Geometric Transformations & 2D Fourier Transform', hours: 2, completed: false, content: 'Image rotation, scaling, translation, 2D Fourier transform.' },
          { unit: 3, title: 'Linear Convolution Filtering', hours: 2, completed: false, content: 'Linear filtering using convolution, highly selective filters.' },
          { unit: 4, title: 'Frequency Domain & Edge Detection', hours: 2, completed: false, content: 'Ideal filters in frequency domain, non-linear convolutional masks, edge detectors.' },
          { unit: 5, title: 'Morphological Operations on Binary Images', hours: 2, completed: false, content: 'Erosion, dilation, opening, closing, open-close, close-open with structuring elements.' }
        ]
      },
      {
        id: 609,
        code: '6CS4-22',
        title: 'Machine Learning Lab',
        type: 'lab',
        credits: 1.5,
        maxInternal: 45,
        maxEndterm: 30,
        units: [
          { unit: 1, title: 'FIND-S Algorithm for Specific Hypothesis', hours: 2, completed: false, content: 'Implement FIND-S algorithm reading training data from CSV file.' },
          { unit: 2, title: 'Candidate-Elimination Algorithm', hours: 2, completed: false, content: 'Implement Candidate-Elimination algorithm outputting consistent hypotheses.' },
          { unit: 3, title: 'ID3 Decision Tree Algorithm', hours: 2, completed: false, content: 'Build decision tree using ID3 algorithm and classify new sample.' },
          { unit: 4, title: 'Backpropagation Neural Network', hours: 2, completed: false, content: 'Build ANN with Backpropagation algorithm and test using datasets.' },
          { unit: 5, title: 'Naive Bayesian Classifier', hours: 2, completed: false, content: 'Implement Naive Bayes classifier on CSV data and compute accuracy.' },
          { unit: 6, title: 'Document Classification with Naive Bayes', hours: 2, completed: false, content: 'Calculate accuracy, precision, and recall for text document classification.' },
          { unit: 7, title: 'Bayesian Network Medical Diagnosis', hours: 2, completed: false, content: 'Diagnose heart patients using Bayesian network and Heart Disease dataset.' },
          { unit: 8, title: 'EM vs K-Means Clustering on CSV Data', hours: 2, completed: false, content: 'Apply EM algorithm and K-Means clustering, comparing quality.' },
          { unit: 9, title: 'K-Nearest Neighbour (KNN) on Iris Dataset', hours: 2, completed: false, content: 'Classify Iris dataset with KNN and print correct/wrong predictions.' },
          { unit: 10, title: 'Locally Weighted Regression Algorithm', hours: 2, completed: false, content: 'Implement non-parametric Locally Weighted Regression and draw fit graphs.' }
        ]
      },
      {
        id: 610,
        code: '6CS4-23',
        title: 'Python Lab',
        type: 'lab',
        credits: 1.5,
        maxInternal: 45,
        maxEndterm: 30,
        units: [
          { unit: 1, title: 'Basic Data Types & Command-line Scripts', hours: 2, completed: false, content: 'Demonstrate basic data types, compute distance between points, command-line add.py.' },
          { unit: 2, title: 'Loops, Decimals & Sequences', hours: 2, completed: false, content: 'Even/odd check, loop for decimal equivalents 1/2..1/10, sequence countdown.' },
          { unit: 3, title: 'Lists, Tuples & Primes below 2 Million', hours: 2, completed: false, content: 'List/tuple demonstration, sum of primes below 2M, even Fibonacci terms.' },
          { unit: 4, title: 'Dictionaries, Strings & Birthday Tracing', hours: 2, completed: false, content: 'Character counts in string with dict, split/join methods, birthday tracer.' },
          { unit: 5, title: 'File Handling & Character Frequency', hours: 2, completed: false, content: 'Frequency analysis to detect Python vs C vs text files.' },
          { unit: 6, title: 'Reverse File Printing & Word/Line Counters', hours: 2, completed: false, content: 'Print lines in reverse order, count characters, words and lines.' },
          { unit: 7, title: 'Nearly Equal String Mutations & One-line GCD/LCM', hours: 2, completed: false, content: 'Test if strings nearly equal by single mutation, one-line GCD and LCM.' },
          { unit: 8, title: 'Sorting Implementations: Merge, Selection & Insertion', hours: 2, completed: false, content: 'Write programs implementing Merge sort, Selection sort, Insertion sort.' }
        ]
      },
      {
        id: 611,
        code: '6CS4-24',
        title: 'Mobile Application Development Lab',
        type: 'lab',
        credits: 1.5,
        maxInternal: 45,
        maxEndterm: 30,
        units: [
          { unit: 1, title: 'Android Studio Setup & Hello World', hours: 2, completed: false, content: 'Android Studio installation and first Hello World app.' },
          { unit: 2, title: 'Activity, Intent & Login Module', hours: 2, completed: false, content: 'Understand Activity, Intent, Create sample app with login module.' },
          { unit: 3, title: 'GUI Calculator with Activity & Intents', hours: 2, completed: false, content: 'Design simple GUI calculator with activities and intents.' },
          { unit: 4, title: 'RSS Feed Reader Application', hours: 2, completed: false, content: 'Develop application that makes use of RSS Feed.' },
          { unit: 5, title: 'Screen Drawing & Graphical Primitives', hours: 2, completed: false, content: 'Draw basic graphical primitives on mobile screen.' },
          { unit: 6, title: 'SQLite Database Android Application', hours: 2, completed: false, content: 'Create Android app with SQLite database persistence.' },
          { unit: 7, title: 'GPS Location Services Native App', hours: 2, completed: false, content: 'Develop native application utilizing GPS location information.' },
          { unit: 8, title: 'SD Card Data Writing & Gaming App', hours: 2, completed: false, content: 'Write data to storage, design gaming application.' },
          { unit: 9, title: 'Media Manager: Image & Video Sizing', hours: 2, completed: false, content: 'Handle images and videos according to display size.' }
        ]
      }
    ]
  },
  {
    id: 7,
    semesterNumber: 7,
    academicYear: '2027-2028',
    status: 'upcoming',
    sgpa: null,
    totalCredits: null,
    remarks: 'Data not yet entered',
    subjects: []
  },
  {
    id: 8,
    semesterNumber: 8,
    academicYear: '2028',
    status: 'upcoming',
    sgpa: null,
    totalCredits: null,
    remarks: 'Data not yet entered',
    subjects: []
  }
];

export const initialCheckins = [
  {
    id: 1,
    date: '2026-10-12',
    studyHours: 7.0,
    topicsCompleted: 'Compiler Design: LL(1) and SLR(1) parsing tables; Algorithms: DP Matrix Chain Multiplication',
    questionsSolved: 9,
    tasksCompleted: 6,
    mood: 'Peak Energy',
    energyLevel: 9,
    sleepHours: 7.5,
    journalEntry: 'Built the foundational architecture for the website. Connecting real RTU marksheets and syllabus makes this feel exceptionally authentic.',
    tomorrowPriorities: 'Complete OS Deadlock Bankers algorithm notes and wire up Spotify playback widget.'
  },
  {
    id: 2,
    date: '2026-10-11',
    studyHours: 6.0,
    topicsCompleted: 'Operating Systems: Demand paging and LRU page replacement algorithm',
    questionsSolved: 6,
    tasksCompleted: 4,
    mood: 'Productive',
    energyLevel: 8,
    sleepHours: 8.0,
    journalEntry: 'Good session on virtual memory. Refactored DSA linked lists & tree problems in C++.',
    tomorrowPriorities: 'Review compiler bootstrapping and lexical analysis.'
  }
];

export const initialHabits = [
  { id: 1, title: 'LeetCode / DSA Daily Practice', category: 'Coding', streak: 26, targetFrequency: 'Daily' },
  { id: 2, title: 'RTU CSE Core Coursework', category: 'Academics', streak: 19, targetFrequency: 'Daily' },
  { id: 3, title: 'Personal Website Development', category: 'Dev Project', streak: 14, targetFrequency: 'Daily' },
  { id: 4, title: 'Physical Workout & Fitness', category: 'Health', streak: 15, targetFrequency: '5x/week' }
];

export const initialTasks = [
  { id: 1, title: 'Complete Compiler Design SLR & CLR parse tables', description: 'Practice 3 grammar problems from RTU previous year papers', priority: 'high', status: 'in_progress', tag: 'Academics', dueDate: '2026-10-15' },
  { id: 2, title: 'Integrate WorksWheel 3D perspective browser', description: 'Deploy interactive card drum for project showcase', priority: 'urgent', status: 'completed', tag: 'Projects', dueDate: '2026-10-12' },
  { id: 3, title: 'Solve 5 Dynamic Programming problems on LeetCode', description: 'Focus on 0/1 Knapsack variations and LCS patterns', priority: 'medium', status: 'todo', tag: 'DSA', dueDate: '2026-10-14' },
  { id: 4, title: 'Connect Spotify Web API with player embeds', description: 'Support OAuth playlists and currently playing track widget', priority: 'high', status: 'in_progress', tag: 'Music', dueDate: '2026-10-16' },
  { id: 5, title: 'Review OS Banker\'s Deadlock Avoidance algorithm', description: 'Prepare numerical solutions for Midterm II', priority: 'medium', status: 'todo', tag: 'Academics', dueDate: '2026-10-17' }
];

export const initialGoals = [
  { id: 1, title: 'Maintain 8.8+ SGPA in RTU Semester 5', description: 'Score top marks in Compiler Design and Algorithms midterms', timeHorizon: 'semester', progressPct: 65, targetDate: '2026-12-20', status: 'active' },
  { id: 2, title: 'Master 150 Classic DSA Problems in C++', description: 'Blind 75 + Striver SDE sheet core problems', timeHorizon: 'monthly', progressPct: 78, targetDate: '2026-11-30', status: 'active' },
  { id: 3, title: 'Deploy AYushMan to Vercel & Render', description: 'Complete full-stack release with MySQL storage and clean UI', timeHorizon: 'monthly', progressPct: 90, targetDate: '2026-10-25', status: 'active' }
];

export const initialAnime = [
  {
    id: 1,
    title: 'Attack on Titan (Shingeki no Kyojin)',
    anilistId: 16498,
    posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg',
    bannerUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFCOcDmneX.jpg',
    format: 'TV Series',
    totalEpisodes: 89,
    episodesWatched: 89,
    status: 'completed',
    score: 10.0,
    favoriteCharacter: 'Levi Ackerman & Eren Yeager',
    isFavorite: true,
    priority: 'High',
    completedDate: '2024',
    genres: ['Action', 'Drama', 'Mystery', 'Psychological'],
    notes: 'The peak of narrative storytelling, foreshadowing, and character arcs. Tatakae!'
  },
  {
    id: 2,
    title: 'One Piece',
    anilistId: 21,
    posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-ELSYx3yMPcKM.jpg',
    bannerUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg',
    format: 'TV Series (Big Three)',
    totalEpisodes: 1122,
    episodesWatched: 1122,
    status: 'completed',
    score: 10.0,
    favoriteCharacter: 'Monkey D. Luffy & Roronoa Zoro',
    isFavorite: true,
    priority: 'High',
    completedDate: '2026',
    genres: ['Action', 'Adventure', 'Fantasy'],
    notes: 'Part of the Big Three. Unmatched world-building, emotional peaks from Marineford to Wano & Egghead.'
  },
  {
    id: 3,
    title: 'Naruto: Shippuden',
    anilistId: 1735,
    posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-kGfVm0YqCPcu.png',
    bannerUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1735.jpg',
    format: 'TV Series (Big Three)',
    totalEpisodes: 500,
    episodesWatched: 500,
    status: 'completed',
    score: 9.7,
    favoriteCharacter: 'Itachi Uchiha & Kakashi Hatake',
    isFavorite: true,
    priority: 'High',
    completedDate: '2024',
    genres: ['Action', 'Adventure', 'Martial Arts'],
    notes: 'Part of the Big Three. Pain Assault and Fourth Shinobi World War remain iconic.'
  },
  {
    id: 4,
    title: 'Bleach',
    anilistId: 269,
    posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-d2GmRkJbMopq.png',
    bannerUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/269-08ar2HJOUAuL.jpg',
    format: 'TV Series (Big Three)',
    totalEpisodes: 366,
    episodesWatched: 366,
    status: 'completed',
    score: 9.6,
    favoriteCharacter: 'Sosuke Aizen & Ichigo Kurosaki',
    isFavorite: true,
    priority: 'High',
    completedDate: '2025',
    genres: ['Action', 'Adventure', 'Supernatural'],
    notes: 'Part of the Big Three. Soul Society arc, Hueco Mundo, and Bankai reveals have unmatched style.'
  },
  {
    id: 5,
    title: 'Jujutsu Kaisen',
    anilistId: 113415,
    posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg',
    bannerUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415-jQBSkxWAAk83.jpg',
    format: 'TV Series',
    totalEpisodes: 47,
    episodesWatched: 47,
    status: 'completed',
    score: 9.6,
    favoriteCharacter: 'Satoru Gojo',
    isFavorite: true,
    priority: 'High',
    completedDate: '2024',
    genres: ['Action', 'Supernatural', 'Dark Fantasy'],
    notes: 'Shibuya Incident arc is unparalleled in animation quality and relentless stakes.'
  },
  {
    id: 6,
    title: 'Solo Leveling (Ore dake Level Up na Ken)',
    anilistId: 151807,
    posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png',
    bannerUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-37yfQA3ym8PA.jpg',
    format: 'TV Series',
    totalEpisodes: 12,
    episodesWatched: 12,
    status: 'completed',
    score: 9.4,
    favoriteCharacter: 'Sung Jin-woo',
    isFavorite: false,
    priority: 'Medium',
    completedDate: '2025',
    genres: ['Action', 'Adventure', 'Fantasy'],
    notes: 'Incredible adaptation of the manhwa. Arise!'
  },
  {
    id: 7,
    title: 'Demon Slayer: Kimetsu no Yaiba',
    anilistId: 101922,
    posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg',
    bannerUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-33MtJGsUSxga.jpg',
    format: 'TV Series',
    totalEpisodes: 55,
    episodesWatched: 55,
    status: 'completed',
    score: 9.2,
    favoriteCharacter: 'Kyojuro Rengoku & Tanjiro Kamado',
    isFavorite: false,
    priority: 'Medium',
    completedDate: '2025',
    genres: ['Action', 'Supernatural', 'Historical'],
    notes: 'Ufotable visual masterclass. Mugen Train and Entertainment District are legendary.'
  }
];

export const initialMovies = [
  {
    id: 1,
    title: 'Interstellar',
    tmdbId: 157336,
    mediaType: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    releaseYear: 2014,
    status: 'watched',
    rating: 9.8,
    review: 'Christopher Nolan and Hans Zimmer creating the purest cinematic emotion combined with theoretical astrophysics.'
  },
  {
    id: 2,
    title: 'Oppenheimer',
    tmdbId: 872585,
    mediaType: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
    releaseYear: 2023,
    status: 'watched',
    rating: 9.5,
    review: 'Electrifying sound design, non-linear editing, and Cillian Murphy\'s haunting gaze.'
  },
  {
    id: 3,
    title: 'Inception',
    tmdbId: 27205,
    mediaType: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    releaseYear: 2010,
    status: 'watched',
    rating: 9.5,
    review: 'A brilliant exploration of dreams, memory, and architecture. Still mesmerizes on every rewatch.'
  }
];

export const spotifyUserProfile = {
  username: '31r367fhbny2hd3bdbyo5q3vvjlu',
  displayName: 'आयुष्मान (AYushMan)',
  profileUrl: 'https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu',
  avatarUrl: '/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg',
  publicPlaylistsCount: 7,
  verified: true
};

export const youtubeMusicProfile = {
  handle: '@wtfk1y0',
  displayName: 'AYushMan (@wtfk1y0)',
  profileUrl: 'https://music.youtube.com/@wtfk1y0',
  rawUrlWithSi: 'https://music.youtube.com/@wtfk1y0?si=eFI36HSD6D3rh-K4',
  verified: true,
  note: 'Canonical YouTube Music profile. Direct playback embeds are supported for public video/playlist IDs.'
};

export const initialMusic = [
  {
    id: 1,
    title: 'जीवन',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/3kVexA5RqiZJA1hrzv1eNH',
    embedId: '3kVexA5RqiZJA1hrzv1eNH',
    coverUrl: '/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg',
    mood: 'Soulful & Deep',
    trackCount: 12,
    isFavorite: true
  },
  {
    id: 2,
    title: '"PEAK"',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/1ObWCzwKcT96QEqiKbFR5U',
    embedId: '1ObWCzwKcT96QEqiKbFR5U',
    coverUrl: '/assets/music/1ObWCzwKcT96QEqiKbFR5U.jpg',
    mood: 'High Energy & Anthems',
    trackCount: 35,
    isFavorite: true
  },
  {
    id: 3,
    title: 'puhNjabi',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/6TsUQwBFT8TMKBN72Mo7Zb',
    embedId: '6TsUQwBFT8TMKBN72Mo7Zb',
    coverUrl: '/assets/music/6TsUQwBFT8TMKBN72Mo7Zb.jpg',
    mood: 'Punjabi & Folk Beats',
    trackCount: 15,
    isFavorite: true
  },
  {
    id: 4,
    title: 'एफ',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/3z97vIfs40HVfqovsgSbGn',
    embedId: '3z97vIfs40HVfqovsgSbGn',
    coverUrl: '/assets/music/3z97vIfs40HVfqovsgSbGn.jpg',
    mood: 'Chill & Atmosphere',
    trackCount: 19,
    isFavorite: false
  },
  {
    id: 5,
    title: '´⁠ε⁠｀',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/6Vpr16RnIxYihzjjqcJWqc',
    embedId: '6Vpr16RnIxYihzjjqcJWqc',
    coverUrl: '/assets/music/6Vpr16RnIxYihzjjqcJWqc.jpg',
    mood: 'Lo-Fi & Comfort',
    trackCount: 13,
    isFavorite: false
  },
  {
    id: 6,
    title: '￣⁠ ³⁠ ￣',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/75X05MAHQtndSlg17jC3dU',
    embedId: '75X05MAHQtndSlg17jC3dU',
    coverUrl: '/assets/music/75X05MAHQtndSlg17jC3dU.jpg',
    mood: 'Vibes & Ambient',
    trackCount: 19,
    isFavorite: false
  },
  {
    id: 7,
    title: 'ई',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/4YfKMO0RFIMJuvx9BYEuHx',
    embedId: '4YfKMO0RFIMJuvx9BYEuHx',
    coverUrl: '/assets/music/4YfKMO0RFIMJuvx9BYEuHx.jpg',
    mood: 'Late Night Flow',
    trackCount: 11,
    isFavorite: false
  },
  {
    id: 8,
    title: 'Synthwave & Retrowave Highway',
    provider: 'youtube',
    externalUrl: 'https://music.youtube.com/playlist?list=PLFgquLnL59alW3xmYiWRaoz0oM3HTr0e7',
    embedId: 'PLFgquLnL59alW3xmYiWRaoz0oM3HTr0e7',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop',
    mood: 'Atmospheric Retrowave',
    trackCount: 26,
    isFavorite: true
  },
  {
    id: 9,
    title: 'Lofi Hip Hop / Focus Beats',
    provider: 'youtube',
    externalUrl: 'https://music.youtube.com/@wtfk1y0',
    embedId: 'jfKfPfyJRdk',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    mood: 'Coding & Study Sessions',
    trackCount: 35,
    isFavorite: false
  }
];

export const initialSocialProfiles = [
  {
    id: 'instagram',
    platform: 'Instagram',
    category: 'social',
    displayName: 'आयुष्मान',
    username: 'wtfk1yo',
    profileUrl: 'https://www.instagram.com/wtfk1yo/',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
    bio: 'hey there! i am using instagram.',
    status: 'configured',
    integrationLevel: 'A',
    historicalStats: { posts: 17, followers: 72, following: 41 },
    accentColor: '#E1306C',
    gradient: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    isVerified: true,
    visible: true,
    order: 1
  },
  {
    id: 'spotify',
    platform: 'Spotify',
    category: 'music',
    displayName: 'आयुष्मान (AYushMan)',
    username: '31r367fhbny2hd3bdbyo5q3vvjlu',
    profileUrl: 'https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu',
    avatarUrl: '/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg',
    bio: 'Curated playlists: जीवन, "PEAK", puhNjabi, एफ, ´⁠ε⁠｀, ￣⁠ ³⁠ ￣, ई.',
    status: 'configured',
    integrationLevel: 'B',
    historicalStats: { publicPlaylists: 7, totalTracks: 124 },
    accentColor: '#1DB954',
    gradient: 'from-[#1db954] to-[#191414]',
    isVerified: true,
    visible: true,
    order: 2
  },
  {
    id: 'youtube-music',
    platform: 'YouTube Music',
    category: 'music',
    displayName: 'AYushMan',
    username: '@wtfk1y0',
    profileUrl: 'https://music.youtube.com/@wtfk1y0',
    avatarUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop',
    bio: 'Official YouTube Music profile (@wtfk1y0).',
    status: 'configured',
    integrationLevel: 'A',
    historicalStats: { handle: '@wtfk1y0', platform: 'YouTube Music' },
    accentColor: '#FF0000',
    gradient: 'from-[#FF0000] to-[#282828]',
    isVerified: true,
    visible: true,
    order: 3
  },
  {
    id: 'chess',
    platform: 'Chess.com',
    category: 'gaming',
    displayName: 'nerfedAYushhhMaN',
    username: 'nerfedayushhhman',
    profileUrl: 'https://www.chess.com/member/nerfedayushhhman',
    avatarUrl: '/assets/games/chess-com.svg',
    bio: 'Rapid: 2035 · Bullet: 2100 · Blitz: 2053',
    status: 'configured',
    integrationLevel: 'A',
    historicalStats: { rapid: 2035, bullet: 2100, blitz: 2053 },
    accentColor: '#81B64C',
    gradient: 'from-[#81B64C] to-[#1f2918]',
    isVerified: true,
    visible: true,
    order: 4
  },
  {
    id: 'github',
    platform: 'GitHub',
    category: 'developer',
    displayName: 'AYushMan',
    username: 'Aayushman-debug',
    profileUrl: 'https://github.com/Aayushman-debug',
    avatarUrl: 'https://avatars.githubusercontent.com/u/104116369?v=4',
    bio: 'Full-stack developer & CS undergrad. C++, Algorithms, React, Node.js.',
    status: 'configured',
    integrationLevel: 'A',
    historicalStats: { repositories: 3, primaryStack: 'C++ · TypeScript' },
    accentColor: '#f0f6fc',
    gradient: 'from-[#24292e] to-[#040d21]',
    isVerified: true,
    visible: true,
    order: 5
  },
  {
    id: 'bgmi',
    platform: 'BGMI (Krafton)',
    category: 'gaming',
    displayName: 'Rish Ke Papa',
    username: 'UID: 55528652768',
    profileUrl: '/gaming',
    avatarUrl: '/assets/games/bgmi.svg',
    bio: 'Displayed Name: Rish Ke Papa · Clan: HOMIES · KD: 5.63',
    status: 'configured',
    integrationLevel: 'A',
    historicalStats: { uid: '55528652768', clan: 'HOMIES', kd: '5.63' },
    accentColor: '#F59E0B',
    gradient: 'from-[#F59E0B] to-[#78350F]',
    isVerified: true,
    visible: true,
    order: 6
  },
  {
    id: 'discord',
    platform: 'Discord',
    category: 'community',
    displayName: 'Discord User',
    username: 'pareshamatcroyar (Unverified Reference)',
    profileUrl: '#',
    avatarUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=400&auto=format&fit=crop',
    bio: 'Configurable Discord Profile. Awaiting user tag / invite verification.',
    status: 'pending_verification',
    integrationLevel: 'A',
    missingInfo: 'Requires Discord User Tag / ID or permanent Server Invite link to connect.',
    accentColor: '#5865F2',
    gradient: 'from-[#5865F2] to-[#23272A]',
    isVerified: false,
    visible: true,
    order: 7
  }
];

export const initialGaming = [
  {
    id: 1,
    slug: 'clash-royale',
    gameName: 'Clash Royale',
    publisher: 'Supercell',
    genre: 'Real-Time Strategy / Card Battler',
    inGameId: 'Slur',
    uid: '',
    profileUrl: '',
    serverRegion: 'Global',
    currentRank: '10,200 Trophies',
    peakRank: '10,200 Trophies',
    clanTeam: 'Configurable',
    role: 'Ladder & Path of Legends',
    artworkUrl: '/assets/games/clash-royale.svg',
    accentColor: '#3b82f6',
    holoColor: 'rgba(59, 130, 246, 0.35)',
    gradient: 'from-blue-600/30 via-indigo-900/40 to-amber-500/20',
    badgeText: '10,200 Trophies',
    status: 'verified',
    lastUpdated: '2026-10-13',
    statsSummary: {
      'Player Name': 'Slur',
      'Trophies': '10,200',
      'Profile Link': 'Editable (Add Tag/URL)'
    },
    notes: 'Confirmed player name Slur with 10,200 trophies. Use Edit Profile to add your RoyaleAPI or player tag link.',
    isPublic: true
  },
  {
    id: 2,
    slug: 'bgmi',
    gameName: 'BGMI (Battlegrounds Mobile India)',
    publisher: 'Krafton',
    genre: 'Tactical Battle Royale',
    inGameId: 'Rish Ke Papa',
    uid: '55528652768',
    profileUrl: '',
    serverRegion: 'India',
    currentRank: '5.63 KD',
    peakRank: 'High Tier Squads',
    clanTeam: 'HOMIES',
    role: 'Assaulter / Fragger',
    artworkUrl: '/assets/games/bgmi.svg',
    accentColor: '#f59e0b',
    holoColor: 'rgba(245, 158, 11, 0.35)',
    gradient: 'from-amber-500/30 via-orange-900/40 to-red-900/25',
    badgeText: 'KD 5.63',
    status: 'verified',
    lastUpdated: '2026-10-13',
    statsSummary: {
      'Displayed Name': 'Rish Ke Papa',
      'Account UID': '55528652768',
      'Clan': 'HOMIES',
      'K/D Ratio': '5.63'
    },
    notes: 'Verified from account screenshot: UID 55528652768, displayed name Rish Ke Papa, clan HOMIES, and current KD 5.63.',
    isPublic: true
  },
  {
    id: 3,
    slug: 'chess',
    gameName: 'Chess.com',
    publisher: 'Chess.com',
    genre: 'Competitive Speed & Classical Chess',
    inGameId: 'nerfedAYushhhMaN',
    uid: 'nerfedayushhhman',
    profileUrl: 'https://www.chess.com/member/nerfedayushhhman',
    serverRegion: 'International',
    currentRank: '2100 Bullet · 2053 Blitz · 2035 Rapid',
    peakRank: '2100 Bullet',
    clanTeam: 'Individual',
    role: '2000+ Rated Tactician',
    artworkUrl: '/assets/games/chess-com.svg',
    accentColor: '#10b981',
    holoColor: 'rgba(16, 185, 129, 0.35)',
    gradient: 'from-emerald-500/30 via-teal-900/40 to-cyan-900/25',
    badgeText: '2100 Bullet',
    status: 'verified',
    lastUpdated: '2026-10-13',
    statsSummary: {
      'Rapid Rating': '2035',
      'Bullet Rating': '2100',
      'Blitz Rating': '2053',
      'Member Handle': 'nerfedAYushhhMaN'
    },
    notes: 'Ratings supplied manually (Rapid 2035, Bullet 2100, Blitz 2053). Click Open Profile to visit chess.com/member/nerfedayushhhman.',
    isPublic: true
  },
  {
    id: 4,
    slug: 'clash-of-clans',
    gameName: 'Clash of Clans',
    publisher: 'Supercell',
    genre: 'Base Strategy & Clan Wars',
    inGameId: 'TH18 Maxed Account',
    uid: '',
    profileUrl: '',
    serverRegion: 'Global',
    currentRank: 'Town Hall 18 (Maxed)',
    peakRank: 'TH 18 Maxed Out',
    clanTeam: 'Configurable',
    role: 'War Attacker & Strategist',
    artworkUrl: '/assets/games/clash-of-clans.svg',
    accentColor: '#eab308',
    holoColor: 'rgba(234, 179, 8, 0.35)',
    gradient: 'from-yellow-500/30 via-amber-900/40 to-purple-900/25',
    badgeText: 'TH 18 Maxed',
    status: 'verified',
    lastUpdated: '2026-10-13',
    statsSummary: {
      'Town Hall': 'Town Hall 18',
      'Upgrade State': 'Maxed Out',
      'Player Tag': 'Editable (Add #Tag)'
    },
    notes: 'Town Hall 18 maxed account. Use Edit Profile to add your in-game player tag (#) and war stars.',
    isPublic: true
  },
  {
    id: 5,
    slug: 'devil-may-cry',
    gameName: 'Devil May Cry',
    publisher: 'Capcom',
    genre: 'Character Action / Stylish Hack & Slash',
    inGameId: 'Editable Profile',
    uid: '',
    profileUrl: '',
    serverRegion: 'PC / Console',
    currentRank: 'Configure Style & Progress',
    peakRank: 'Configurable',
    clanTeam: 'Devil May Cry Agency',
    role: 'Dante / Vergil / Nero',
    artworkUrl: '/assets/games/devil-may-cry.svg',
    accentColor: '#ef4444',
    holoColor: 'rgba(239, 68, 68, 0.35)',
    gradient: 'from-red-600/30 via-rose-950/40 to-slate-900/30',
    badgeText: 'Editable Stats',
    status: 'editable',
    lastUpdated: '2026-10-13',
    statsSummary: {
      'Edition / Title': 'Click Edit to set (e.g. DMC 5 SE)',
      'Difficulty Cleared': 'Click Edit to set (e.g. DMD)',
      'Main Character': 'Click Edit to set'
    },
    notes: 'No stats fabricated. Click "Edit Profile" to record your Devil May Cry titles, difficulty clears, and Bloody Palace progress.',
    isPublic: true
  },
  {
    id: 6,
    slug: 'genshin-impact',
    gameName: 'Genshin Impact',
    publisher: 'HoYoverse',
    genre: 'Open-World Action RPG',
    inGameId: 'Editable Profile',
    uid: '',
    profileUrl: '',
    serverRegion: 'Configure Server (e.g. Asia)',
    currentRank: 'Configure Adventure Rank',
    peakRank: 'Configure Spiral Abyss',
    clanTeam: 'Teyvat Traveler',
    role: 'Elemental Resonance / Builds',
    artworkUrl: '/assets/games/genshin-impact.svg',
    accentColor: '#06b6d4',
    holoColor: 'rgba(6, 182, 212, 0.35)',
    gradient: 'from-cyan-500/30 via-indigo-950/40 to-purple-900/30',
    badgeText: 'Add UID & Builds',
    status: 'editable',
    lastUpdated: '2026-10-13',
    statsSummary: {
      'UID': 'Click Edit to add UID',
      'Server': 'Click Edit to set region',
      'Characters & Builds': 'Click Edit to list mains'
    },
    notes: 'No UID or builds fabricated. Click "Edit Profile" to enter your real Genshin Impact UID, Adventure Rank, and character builds.',
    isPublic: true
  },
  {
    id: 7,
    slug: 'wuthering-waves',
    gameName: 'Wuthering Waves',
    publisher: 'Kuro Games',
    genre: 'Open-World Action RPG',
    inGameId: 'Editable Profile',
    uid: '',
    profileUrl: '',
    serverRegion: 'Configure Server (e.g. SEA / Asia)',
    currentRank: 'Configure Union Level',
    peakRank: 'Configure Tower of Adversity',
    clanTeam: 'Solaris-3 Rover',
    role: 'Resonator Combat & Echo Builds',
    artworkUrl: '/assets/games/wuthering-waves.svg',
    accentColor: '#a855f7',
    holoColor: 'rgba(168, 85, 247, 0.35)',
    gradient: 'from-purple-500/30 via-violet-950/40 to-cyan-900/30',
    badgeText: 'Add UID & Builds',
    status: 'editable',
    lastUpdated: '2026-10-13',
    statsSummary: {
      'UID': 'Click Edit to add UID',
      'Server': 'Click Edit to set server',
      'Resonators & Builds': 'Click Edit to list mains'
    },
    notes: 'No UID or Resonator data fabricated. Click "Edit Profile" to enter your real Wuthering Waves UID, server, and Resonator builds.',
    isPublic: true
  }
];

export const initialSkills = [
  { id: 1, name: 'C++ & STL', category: 'language', proficiency: 92, verified: true },
  { id: 2, name: 'Python', category: 'language', proficiency: 88, verified: true },
  { id: 3, name: 'Java & J2EE', category: 'language', proficiency: 85, verified: true },
  { id: 4, name: 'MySQL & Relational Databases', category: 'database', proficiency: 90, verified: true },
  { id: 5, name: 'Data Structures & Algorithms', category: 'core_cs', proficiency: 90, verified: true },
  { id: 6, name: 'Operating Systems & Networking', category: 'core_cs', proficiency: 86, verified: true },
  { id: 7, name: 'React & TypeScript', category: 'web', proficiency: 92, verified: true },
  { id: 8, name: 'Node.js & Express API', category: 'web', proficiency: 89, verified: true },
  { id: 9, name: 'Git & Linux Workflows', category: 'tools', proficiency: 94, verified: true }
];

export const initialProjects = [
  {
    id: 1,
    title: 'AYushMan',
    tag: 'Web Platform',
    description: 'A personal website combining academic records, daily tracking, entertainment, and interactive components.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'GSAP', 'Tailwind'],
    githubUrl: 'https://github.com/Aayushman-debug/ayushman-os',
    liveUrl: '#',
    imageUrl: '/assets/projects/ayushman-os.svg',
    featured: true
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
    featured: true
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
    featured: true
  }
];

export const initialVault = [
  {
    id: 1,
    title: 'RTU B.Tech Semester I, II & III Main Examination Results',
    category: 'document',
    content: 'Official marksheet grades issued by Rajasthan Technical University, Kota for Arya College of Engg. & IT. Passed with high distinction.',
    dateOccurred: '2026-06-15',
    tags: ['RTU', 'Academic', 'Marksheets', 'Arya College'],
    isPrivate: false
  },
  {
    id: 2,
    title: 'Industrial Training Certification - Software Engineering & DSA',
    category: 'certificate',
    content: 'Completed practical industrial training module during B.Tech semester break focusing on production code standards and algorithmic complexity.',
    dateOccurred: '2026-07-20',
    tags: ['Training', 'Certification', 'Software Engineering'],
    isPrivate: false
  },
  {
    id: 3,
    title: 'Engineering Reflections',
    category: 'note',
    content: 'Building software is about compounding knowledge. AYushMan represents the bridge between engineering execution, academic discipline, and personal interests.',
    dateOccurred: '2026-10-12',
    tags: ['Philosophy', 'Vision', 'Milestone'],
    isPrivate: true
  }
];
