// src/assets/index.ts

// ============================================================
// IMPORT ASSETS
// ============================================================

// Images
import banner from "./images/banner.png";

// Icons (Asset files like SVG)
import instagramIcon from "./icons/instagram.svg";

// Icons (Library components - Heroicons, Lucide, etc.)
import {
  MoonIcon,
  SunIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  HeartIcon,
  LanguageIcon,
  UserIcon,
  HomeIcon,
} from "./icons";

// Videos
import sampleVideo from "./videos/sample.mp4";

// Sounds
import noteSound from "./sounds/note.mp3";

// ============================================================
// IMAGE ASSETS (for Asset component)
// ============================================================

export const images = {
  banner: { src: banner, alt: "Banner image", title: "Meritbox Banner" },
} as const;

// ============================================================
// ICON ASSETS (for Asset component)
// ============================================================

export const icons = {
  instagram: { src: instagramIcon, alt: "Instagram icon", title: "Instagram" },
} as const;

// ============================================================
// VIDEO ASSETS (for VideoPlayer component)
// ============================================================

export const videos = {
  sample: { src: sampleVideo, alt: "Sample video", title: "Sample Video" },
} as const;

// ============================================================
// SOUND ASSETS
// ============================================================

export const sounds = {
  note: { src: noteSound, alt: "Note sound", title: "Note" },
} as const;

// ============================================================
// ICON LIBRARY COMPONENTS (for direct use)
// ============================================================

export const iconsLib = {
  sun: SunIcon,
  moon: MoonIcon,
  check: CheckCircleIcon,
  warning: ExclamationCircleIcon,
  error: XCircleIcon,
  heart: HeartIcon,
  language: LanguageIcon,
  user: UserIcon,
  home: HomeIcon,
} as const;
