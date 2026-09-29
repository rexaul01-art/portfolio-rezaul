/* ═══════════════════════════════════════════════════
   DATA STORE — Dynamic content management & API sync
═══════════════════════════════════════════════════ */

export const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: 'REZAUL KARIM',
    headline: 'DEVELOPER × DESIGNER',
    subhead: 'FULL-STACK DEVELOPER · AI DEVELOPER · ANDROID DEVELOPER · UI/UX DESIGNER',
    shortBio: "I'm a self-taught developer and designer who likes turning ideas into things people can actually use.",
    longBio: "Combining code, design, and AI to create intentional digital experiences. Dedicated to building scalable web applications, native Android apps, and creative technological solutions.",
    location: 'Assam, India',
    availability: 'Available for Freelance & Full-time Roles',
    avatarUrl: '/rezaullogo.png',
    currentFocus: 'Building AI-driven full-stack tools and modern Android applications.',
    specialization: 'Code × Design × Artificial Intelligence',
  },
  about: {
    title: "HEY.<br>I'M REZAUL.",
    label: "01 / HELLO",
    intro: "I'm a self-taught developer and designer who likes turning ideas into things people can actually use.",
    paragraphs: [
      "I build high-performance web applications, modern mobile apps, and intelligent AI tools with a focus on bold design, clean architecture, and delightful user experience."
    ],
    stickers: ['SELF-TAUGHT', 'BUILDER', 'DESIGNER'],
  },
  skills: [
    { id: 'sk-1', name: 'Web Development', category: 'WEB', description: 'Building scalable, responsive websites and web applications using modern frameworks and technologies.', icon: 'code', order: 1 },
    { id: 'sk-2', name: 'AI (Artificial Intelligence)', category: 'AI', description: 'Developing intelligent solutions, from machine learning models to natural language processing.', icon: 'brain', order: 2 },
    { id: 'sk-3', name: 'UI/UX Design', category: 'DESIGN', description: 'Crafting intuitive and visually appealing user interfaces that prioritize user experience.', icon: 'design', order: 3 },
    { id: 'sk-4', name: 'Android Development', category: 'MOBILE', description: 'Creating native Android applications that are robust, efficient, and user-friendly.', icon: 'smartphone', order: 4 }
  ],
  socials: {
    email: 'contact@rezaulkarim.dev',
    whatsapp: '919000000000',
    instagram: 'https://instagram.com/rezaulkarim.dev',
    github: 'https://github.com/rezaulkarim',
  },
  contact: {
    heading: "LET'S TALK",
    subheading: "Have an idea? Let's make it real.",
    availabilityText: 'Currently accepting new projects and creative collaborations.',
    ctaText: "LET'S WORK →",
  },
  siteSettings: {
    siteTitle: 'REZAUL KARIM — Developer × Designer',
    metaDescription: 'Rezaul Karim is a developer and designer building digital experiences with code, design and AI.',
    copyrightText: '© 2026 REZAUL KARIM. All Rights Reserved.',
    creditText: 'WEBSITE MADE BY REZAUL KARIM',
  },
  projects: [
    {
      id: 'proj-1',
      title: 'Assam Techno School',
      category: 'WEB DESIGN × DEVELOPMENT',
      description: 'The Assam Techno School project modernizes the institution\'s digital presence. Built to showcase academic programs, streamline admissions, and foster better communication with students, parents, and faculty.',
      buildDetails: 'Leveraging a modern stack with React for the frontend, Node.js for the backend, and a headless CMS for easy content management. Features dynamic course catalogs, application portals, and interactive event calendars.',
      year: '2025',
      technologies: ['React', 'Node.js', 'Headless CMS', 'Tailwind CSS'],
      image: '',
      gallery: [],
      liveUrl: 'https://assamtechnoschool.com',
      codeUrl: 'https://github.com/rezaulkarim/assam-techno-school',
      featured: true,
      order: 1,
    },
    {
      id: 'proj-2',
      title: 'AI Smart Assistant & Vision App',
      category: 'MOBILE × AI DEVELOPMENT',
      description: 'Native Android application integrating machine learning models for real-time visual recognition, document scanning, and automated response generation.',
      buildDetails: 'Architected with Kotlin and Jetpack Compose on Android, backed by Python FastAPI services and custom AI APIs for real-time inference and processing.',
      year: '2025',
      technologies: ['Kotlin', 'Android Studio', 'Python', 'AI APIs', 'FastAPI'],
      image: '',
      gallery: [],
      liveUrl: '',
      codeUrl: 'https://github.com/rezaulkarim/ai-vision-android',
      featured: true,
      order: 2,
    }
  ],
  journey: [
    {
      id: 'j-2022',
      year: '2022',
      title: 'FIRST EXPERIMENT',
      subtitle: 'Class 8 Venture',
      description: 'In class 8, I launched my first venture — a custom T-shirt printing business. It was a hands-on lesson in design, production, and customer service. It taught me more about failure than success, building my entrepreneurial foundation.',
      technologies: ['Design', 'Production', 'Customer Service'],
      order: 1,
    },
    {
      id: 'j-2023',
      year: '2023',
      title: 'TRYING AGAIN',
      subtitle: 'E-commerce & Marketing',
      description: 'Shifting gears, I explored dropshipping and digital marketing. I experimented with various niches, analyzing trends and user behavior — building my instinct for what people actually want.',
      technologies: ['Dropshipping', 'E-commerce', 'Analytics'],
      order: 2,
    },
    {
      id: 'j-2024',
      year: '2024',
      title: 'GOING DEEPER',
      subtitle: 'Coding & Fundamentals',
      description: 'I started getting serious about building real software. Learning the core fundamentals of programming, exploring design tools, and understanding modern web architecture.',
      technologies: ['JavaScript', 'HTML/CSS', 'UI Design'],
      order: 3,
    },
    {
      id: 'j-2025',
      year: '2025',
      title: 'THE TECH SHIFT',
      subtitle: 'Full-Stack, AI & Android',
      description: 'Mastering modern full-stack development, native Android with Kotlin, and AI integration. Building real production tools and client solutions.',
      technologies: ['Python', 'JavaScript', 'React', 'Kotlin', 'AI', 'UI/UX'],
      order: 4,
    },
    {
      id: 'j-2026',
      year: '2026',
      title: 'NOW & FORWARD',
      subtitle: 'Creative Technologist',
      description: 'Building real products for real people. Combining code, design, and artificial intelligence to build software experiences that stand out.',
      technologies: ['Full-Stack', 'AI', 'Android', 'Freelance'],
      order: 5,
    }
  ],
  tools: [
    { id: 't-1', name: 'PYTHON', color: 'cyan', rotation: '-2deg', order: 1 },
    { id: 't-2', name: 'REACT', color: 'pink', rotation: '1deg', order: 2 },
    { id: 't-3', name: 'KOTLIN', color: 'yellow', rotation: '-1deg', order: 3 },
    { id: 't-4', name: 'FIGMA', color: 'black', rotation: '2deg', order: 4 },
    { id: 't-5', name: 'NODE.JS', color: 'cyan', rotation: '1deg', order: 5 },
    { id: 't-6', name: 'AI APIs', color: 'black', rotation: '-3deg', order: 6 },
    { id: 't-7', name: 'JAVASCRIPT', color: 'yellow', rotation: '2deg', order: 7 },
    { id: 't-8', name: 'DJANGO', color: 'pink', rotation: '-1deg', order: 8 },
    { id: 't-9', name: 'FIREBASE', color: 'cyan', rotation: '3deg', order: 9 },
    { id: 't-10', name: 'ANDROID STUDIO', color: 'black', rotation: '-2deg', order: 10 },
    { id: 't-11', name: 'GIT', color: 'yellow', rotation: '1deg', order: 11 },
    { id: 't-12', name: 'TAILWIND', color: 'pink', rotation: '-3deg', order: 12 }
  ]
};

let portfolioData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
let listeners = [];

const LOCAL_STORAGE_KEY = 'rezaul_portfolio_data_v4';

export function getPortfolioData() {
  return portfolioData;
}

export function subscribeToStore(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => fn(portfolioData));
}

export function saveLocalData(newData) {
  portfolioData = { ...portfolioData, ...newData };
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolioData));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  notifyListeners();
}

export async function loadPortfolioData() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      portfolioData = { ...DEFAULT_PORTFOLIO_DATA, ...parsed };
      if (!portfolioData.profile.avatarUrl || portfolioData.profile.avatarUrl === '/assets/rezaul-portrait.png') {
        portfolioData.profile.avatarUrl = '/rezaullogo.png';
      }
    }
  } catch (e) {}

  try {
    const res = await fetch('/api/content', { headers: { 'Cache-Control': 'no-cache' } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.profile) {
        portfolioData = { ...DEFAULT_PORTFOLIO_DATA, ...data };
        if (!portfolioData.profile.avatarUrl || portfolioData.profile.avatarUrl === '/assets/rezaul-portrait.png') {
          portfolioData.profile.avatarUrl = '/rezaullogo.png';
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolioData));
        notifyListeners();
      }
    }
  } catch (err) {}

  return portfolioData;
}

export function getWhatsAppUrl(phoneOrLink) {
  if (!phoneOrLink) return '#';
  const clean = String(phoneOrLink).trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  const numOnly = clean.replace(/[^\d]/g, '');
  return `https://wa.me/${numOnly}`;
}
