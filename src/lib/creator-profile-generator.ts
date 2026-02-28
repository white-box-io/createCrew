import { mockCreators, type Creator } from "./mock-creators";

export interface CreatorVideo {
  id: string;
  title: string;
  views: string;
  timeAgo: string;
  duration: string;
  color: string;
}

export interface CreatorPost {
  id: string;
  color: string;
}

export interface CreatorFact {
  label: string;
  value: string;
}

export interface GeneratedCreatorProfile {
  creator: Creator;
  vision: string;
  aboutChannel: string;
  facts: CreatorFact[];
  videos: CreatorVideo[];
  posts: CreatorPost[];
}

function cyrb128(str: string) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

function getSeededRandom(seed: string) {
  const seedArr = cyrb128(seed);
  return sfc32(seedArr[0], seedArr[1], seedArr[2], seedArr[3]);
}

const PASTEL_COLORS = [
  "bg-red-100", "bg-orange-100", "bg-amber-100", "bg-yellow-100",
  "bg-lime-100", "bg-green-100", "bg-emerald-100", "bg-teal-100",
  "bg-cyan-100", "bg-blue-100", "bg-indigo-100", "bg-violet-100",
  "bg-purple-100", "bg-fuchsia-100", "bg-pink-100", "bg-rose-100",
];

const VIDEO_TITLES = [
  "I Built a ₹50,000 Gaming Setup — Worth It?",
  "iPhone 17 Pro Max — Full Review After 30 Days",
  "Best Budget Phones Under ₹15,000 in 2026",
  "Apple vs Samsung: The ULTIMATE Comparison",
  "This ₹999 Gadget Changed My Life",
  "Why I'm Switching to Android in 2026",
  "React vs Next.js — What Should You Learn?",
  "10 ChatGPT Hacks You Didn't Know Existed",
  "My Honest Opinion on the New MacBook Pro",
  "I Survived 50 Hours in the World's Hottest Desert",
  "We Tried Every Street Food in Old Delhi",
  "Building a Cabin in the Woods from Scratch",
];

const VIEWS = ["1.2M", "2.4M", "980K", "3.1M", "1.5M", "4.2M", "850K", "5.1M"];
const TIMES = ["3 days ago", "1 week ago", "2 weeks ago", "1 month ago", "2 months ago", "3 weeks ago"];
const DURATIONS = ["14:22", "11:05", "18:30", "22:15", "9:45", "16:08", "8:12", "12:50"];

export function generateCreatorProfile(username: string): GeneratedCreatorProfile | null {
  const creator = mockCreators.find((c) => c.username === username);
  if (!creator) return null;

  const rand = getSeededRandom(username);
  const getRand = (arr: any[]) => arr[Math.floor(rand() * arr.length)];

  const videos: CreatorVideo[] = [];
  const numVideos = Math.floor(rand() * 3) + 4; // 4 to 6 videos
  for (let i = 0; i < numVideos; i++) {
    videos.push({
      id: `v-${i}`,
      title: getRand(VIDEO_TITLES),
      views: getRand(VIEWS),
      timeAgo: getRand(TIMES),
      duration: getRand(DURATIONS),
      color: getRand(PASTEL_COLORS),
    });
  }

  const posts: CreatorPost[] = [];
  for (let i = 0; i < 8; i++) {
    posts.push({
      id: `p-${i}`,
      color: getRand(PASTEL_COLORS),
    });
  }

  const facts: CreatorFact[] = [
    { label: "Upload Schedule", value: "3 videos/week (Tue, Thu, Sat)" },
    { label: "Niche", value: creator.niche },
    { label: "Team Size", value: `${Math.floor(rand() * 5) + 2} people` },
  ];

  return {
    creator,
    vision: `To become India's most trusted voice in ${creator.niche.toLowerCase()} and help millions make smarter decisions.`,
    aboutChannel: "We're a fast-paced channel focused on honest opinions. Our editing style is retention-heavy with fast cuts, memes, and pop-culture references. We value creativity and speed.",
    facts,
    videos,
    posts,
  };
}
