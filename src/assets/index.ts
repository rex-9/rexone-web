// Import images
import banner from "./images/banner.png";

// Import videos
import sample from "./videos/sample.mp4";

// Import icons
import insta from "./icons/instagram.svg"; // Asset icons
import {
  MoonIcon,
  SunIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  HeartIcon,
} from "./icons"; // Lib icons

// Import sounds
// ANAPANA MODULE
import note from "./sounds/note.mp3";

// Define TypeScript interfaces
interface AssetProps {
  src: string;
  alt: string;
  title: string;
}

// Add images and icons here
const images: Record<string, AssetProps> = {
  banner: {
    src: banner,
    alt: "banner image alt",
    title: "banner image title",
  },
};

const icons: {
  asset: Record<string, AssetProps>;
  lib: Record<string, React.ComponentType>;
} = {
  asset: {
    insta: {
      src: insta,
      alt: "instagram icon alt",
      title: "instagram icon title",
    },
  },
  lib: {
    sun: SunIcon,
    moon: MoonIcon,
    checkCircle: CheckCircleIcon,
    exclamationCircle: ExclamationCircleIcon,
    xCircle: XCircleIcon,
    heart: HeartIcon,
  },
};

const videos: Record<string, AssetProps> = {
  sample: {
    src: sample,
    alt: "sample video alt",
    title: "sample video title",
  },
};

const sounds: Record<string, AssetProps> = {
  note: {
    src: note,
    alt: "note sound alt",
    title: "note sound title",
  },
};

export default { images, icons, videos, sounds };
