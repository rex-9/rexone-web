// src/assets/index.ts

// ============================================================
// IMPORT ASSETS
// ============================================================

// Images
import banner from "./images/banner.png";

// Icons (Asset files like SVG)
import instagramIcon from "./icons/instagram.svg";
import googleIcon from "./icons/google.svg";

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
  ArrowPathIcon,
  MinusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  Bars3Icon,
  BellIcon,
  ArrowRightStartOnRectangleIcon,
  CheckIcon,
  XMarkIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  InboxStackIcon,
  KeyIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
}from "@heroicons/react/24/outline";

// Videos
import sampleVideo from "./videos/sample.mp4";

// Sounds
import noteSound from "./sounds/note.mp3";

// ============================================================
// IMAGE ASSETS (for Asset component)
// ============================================================

export const images = {
  banner: { src: banner, alt: "Banner image", title: "Rexone Banner" },
} as const;

// ============================================================
// ICON ASSETS (for Asset component)
// ============================================================

export const icons = {
  instagram: { src: instagramIcon, alt: "Instagram icon", title: "Instagram" },
  google: { src: googleIcon, alt: "Google icon", title: "Google" },
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
  arrowPath: ArrowPathIcon,
  minusCircle:MinusCircleIcon,
  pencilSquare:PencilSquareIcon,
  trash:TrashIcon,
  plus:PlusIcon,
  bar3: Bars3Icon,
  bell: BellIcon,
  logout: ArrowRightStartOnRectangleIcon,
  checkr : CheckIcon,
  xmark : XMarkIcon,
  bellAlert :  BellAlertIcon,
  chatBubbleLeftRight:ChatBubbleLeftRightIcon,
  cube:CubeIcon,
  inboxStack:InboxStackIcon,
  key:KeyIcon,
  userGroup:UserGroupIcon,
  archiveBox : ArchiveBoxIcon
} as const;
