// src/design/pages/landing.data.ts

import { icons, projectImages } from "../../assets";

export interface ISocialProfile {
  platform: string;
  username: string;
  link: string;
  iconSrc: string;
}

export interface ISkillItem {
  name: string;
  url: string;
}

export interface IProjectItem {
  id: number;
  name: string;
  image: string;
  techs: string[];
  details: string[];
  live: string | null;
  source: string | null;
}

export interface ITestimonialItem {
  name: string;
  link: string;
  recommendation: string;
}

export const LANDING_DATA = {
  cvUrl: "https://tinyurl.com/rex9-cv",
  formspreeUrl: "https://formspree.io/f/moqrrpoj",

  profiles: [
    {
      platform: "GitHub",
      username: "rex-9",
      link: "https://github.com/rex-9",
      iconSrc: icons.github.src,
    },
    {
      platform: "LinkedIn",
      username: "rex9",
      link: "https://www.linkedin.com/in/rex9",
      iconSrc: icons.linkedin.src,
    },
    {
      platform: "AngelList",
      username: "rex9",
      link: "https://angel.co/u/rex9",
      iconSrc: icons.angellist.src,
    },
    {
      platform: "Medium",
      username: "rex9",
      link: "https://medium.com/@rex9",
      iconSrc: icons.medium.src,
    },
    {
      platform: "Twitter",
      username: "htetnaing0814",
      link: "https://twitter.com/htetnaing0814",
      iconSrc: icons.twitter.src,
    },
    {
      platform: "Facebook",
      username: "htetnaing0814",
      link: "https://facebook.com/htetnaing0814",
      iconSrc: icons.facebook.src,
    },
  ] as ISocialProfile[],

  skills: {
    languages: [
      { name: "TypeScript", url: "https://www.typescriptlang.org/" },
      { name: "JavaScript", url: "https://www.javascript.com" },
      { name: "Ruby", url: "https://www.ruby-lang.org/en/" },
      { name: "Dart", url: "https://dart.dev" },
      { name: "Python", url: "https://www.python.org" },
      { name: "PHP", url: "https://www.php.net" },
    ],
    frontend: [
      { name: "ReactJS", url: "https://react.dev" },
      { name: "ReduxJS", url: "https://redux.js.org" },
      { name: "TailwindCSS", url: "https://tailwindcss.com" },
      { name: "DaisyUI", url: "https://daisyui.com" },
      { name: "Vite", url: "https://vitejs.dev" },
      { name: "VueJS", url: "https://vuejs.org" },
      { name: "Quasar", url: "https://quasar.dev/" },
      { name: "AlpineJS", url: "https://alpinejs.dev" },
      { name: "Livewire", url: "https://laravel-livewire.com" },
      { name: "Filament", url: "https://filamentphp.com/" },
      { name: "Orchid", url: "https://orchid.software/en/" },
      { name: "Flutter", url: "https://www.flutter.dev" },
    ],
    backend: [
      { name: "Ruby on Rails", url: "https://rubyonrails.org" },
      { name: "Node JS", url: "https://nodejs.org" },
      { name: "Nest JS", url: "https://nestjs.com/" },
      { name: "Next JS", url: "https://nextjs.org/" },
      { name: "Laravel", url: "https://laravel.com" },
      { name: "Flask", url: "https://flask.palletsprojects.com/" },
      { name: "Fast API", url: "https://fastapi.tiangolo.com/" },
    ],
    mobile: [
      { name: "Flutter", url: "https://flutter.dev" },
      { name: "Dart", url: "https://dart.dev" },
      { name: "GetX", url: "https://pub.dev/packages/get" },
      { name: "BLoC", url: "https://pub.dev/packages/flutter_bloc" },
      { name: "iOS", url: "https://developer.apple.com/ios/" },
      { name: "Android", url: "https://developer.android.com/" },
    ],
    database: [
      { name: "PostgreSQL", url: "https://www.postgresql.org/" },
      { name: "MySQL", url: "https://www.mysql.com/" },
      { name: "NoSQL", url: "https://en.wikipedia.org/wiki/NoSQL" },
      { name: "MongoDB", url: "https://www.mongodb.com/" },
      { name: "Firestore", url: "https://firebase.google.com/" },
      { name: "Redis", url: "https://redis.io" },
      { name: "SQL", url: "https://en.wikipedia.org/wiki/SQL" },
    ],
    tools: [
      { name: "Docker", url: "https://www.docker.com/" },
      { name: "Stripe", url: "https://stripe.com/" },
      { name: "OpenAI", url: "https://openai.com/" },
      { name: "Git / GitHub", url: "https://github.com/" },
      { name: "AWS", url: "https://aws.amazon.com/" },
      { name: "Vercel", url: "https://vercel.com/" },
      { name: "OneSignal", url: "https://onesignal.com/" },
      { name: "Cloudinary", url: "https://cloudinary.com/" },
      { name: "Bitrise CI/CD", url: "https://bitrise.io/" },
      { name: "Termius", url: "https://termius.com/" },
      { name: "Pm2", url: "https://pm2.io/" },
    ],
  } as Record<string, ISkillItem[]>,

  projects: [
    {
      id: 3,
      name: "RexOne Core",
      image: projectImages.rexoneCore.src,
      techs: [
        "Rails",
        "PostgreSQL",
        "WebSockets",
        "Sidekiq",
        "Stripe",
        "Docker",
      ],
      details: [
        "Battle-hardened foundation to rapidly build & launch any digital product",
        "Multi-tenant API core with Stripe billing, background queues & telemetry",
      ],
      live: null,
      source: "https://github.com/rex-9/rexone-core",
    },
    {
      id: 2,
      name: "RexOne Web",
      image: projectImages.rexoneWeb.src,
      techs: [
        "React",
        "TypeScript",
        "Vite",
        "TailwindCSS",
        "DaisyUI",
        "WebSockets",
        "Stripe",
      ],
      details: [
        "Production-grade SaaS client engineered for ambitious product launches",
        "Modular architecture with reactive state, ActionCable & Stripe checkout",
      ],
      live: null,
      source: "https://github.com/rex-9/rexone-web",
    },
    {
      id: 1,
      name: "RexOne Mobile",
      image: projectImages.rexoneMobile.src,
      techs: [
        "Flutter",
        "Dart",
        "GetX",
        "Clean Architecture",
        "OneSignal",
        "Stripe",
      ],
      details: [
        "Cross-platform mobile engine to launch any native iOS & Android product",
        "Layered Clean Architecture with push telemetry & biometric security",
      ],
      live: null,
      source: "https://github.com/rex-9/rexone_mobile",
    },
  ] as IProjectItem[],

  testimonials: [
    {
      name: "Alan Luqman",
      link: "https://www.linkedin.com/in/alan-luqman/",
      recommendation:
        "I highly recommend #Htet as a software developer. He is smart and friendly while working and always smile, it's my pleasure to give my recommendation to this gentleman.",
    },
    {
      name: "Dorian Urem",
      link: "https://www.linkedin.com/in/dorian-urem/",
      recommendation:
        "Htet is a fast learner and works very hard. He was often one of the quickest to finish assignments since he put in the extra hours when he could. He also has a good sense for figuring out problems which I saw when we were working on DSA together. Htet is very friendly and positive and it was always a joy working with him.",
    },
    {
      name: "Virag Kormoczy",
      link: "https://www.linkedin.com/in/virag-kormoczy/",
      recommendation:
        "I met Rex through a coffee chat and I learned that he is a very dedicated person when it comes to programming. I gave him a lot of advice about the overall Microverse journey and so far he is accomplishing many things. He listens and takes directions well, and he's a good communicator. I totally recommend him, he is a great person to work with.",
    },
    {
      name: "Asim Khan",
      link: "https://www.linkedin.com/in/asim-khan/",
      recommendation:
        "Htet Naing is a very hard working and a brilliant coder. His ability to quickly analyze and solve data structures and algorithms are amazing. He has good knowledge on HTML, JavaScript, React and Redux. I have learned a lot while collaborating with him @ Microverse.",
    },
  ] as ITestimonialItem[],
};
