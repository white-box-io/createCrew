import { mockCreators } from "./mock-creators";
import { mockFreelancers } from "./mock-freelancers";

export interface ChatParticipant {
  id: string; // The username or unique identifier
  name: string;
  avatar: string;
  role: "creator" | "freelancer";
}

export interface Message {
  id: string;
  senderId: string; // matches a ChatParticipant.id
  text: string;
  timestamp: string; // ISO string or human-readable for mockup
  status?: "sent" | "delivered" | "read";
}

export interface Conversation {
  id: string;
  participants: ChatParticipant[];
  relatedJobId?: string;
  lastMessage: string;
  lastUpdated: string;
  unreadCount: number;
  messages: Message[];
}

// Ensure these match existing mock data usernames
const tb = mockCreators.find((c) => c.username === "techburner")!;
const gv = mockCreators.find((c) => c.username === "gameverse")!;
const meera = mockFreelancers.find((f) => f.username === "meeraai")!;
const rahul = mockFreelancers.find((f) => f.username === "rahulviral")!;
const arjun = mockFreelancers.find((f) => f.username === "arjuncuts")!;
const craftclips = mockCreators.find((c) => c.username === "craftclips")!;

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [
      { id: tb.username, name: tb.name, avatar: tb.avatar, role: "creator" },
      { id: meera.username, name: meera.name, avatar: meera.avatar, role: "freelancer" },
    ],
    relatedJobId: "job-1", // Reference to a job
    lastMessage: "I can deliver the thumbnail drafts by Thursday.",
    lastUpdated: "10:45 AM",
    unreadCount: 2,
    messages: [
      {
        id: "m-101",
        senderId: tb.username,
        text: "Hi Meera, loved your portfolio! We're looking for someone to design 3 thumbnails a week for our main channel. Are you currently taking new clients?",
        timestamp: "Yesterday, 3:30 PM",
        status: "read",
      },
      {
        id: "m-102",
        senderId: meera.username,
        text: "Hi TechBurner! Thank you so much. Yes, I have open capacity starting next week.",
        timestamp: "Yesterday, 4:15 PM",
        status: "read",
      },
      {
        id: "m-103",
        senderId: tb.username,
        text: "Awesome. I've sent over the references. When can you start the first batch?",
        timestamp: "Today, 10:10 AM",
        status: "read",
      },
      {
        id: "m-104",
        senderId: meera.username,
        text: "I've received them! I'll review the assets today.",
        timestamp: "Today, 10:42 AM",
      },
      {
        id: "m-105",
        senderId: meera.username,
        text: "I can deliver the thumbnail drafts by Thursday.",
        timestamp: "Today, 10:45 AM",
      },
    ],
  },
  {
    id: "conv-2",
    participants: [
      { id: gv.username, name: gv.name, avatar: gv.avatar, role: "creator" },
      { id: rahul.username, name: rahul.name, avatar: rahul.avatar, role: "freelancer" },
    ],
    relatedJobId: "job-2",
    lastMessage: "Sounds like a plan. Let's start the milestone.",
    lastUpdated: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m-201",
        senderId: rahul.username,
        text: "Hey GameVerse, following up on the After Effects tracking issue we discussed.",
        timestamp: "Tuesday, 1:00 PM",
        status: "read",
      },
      {
        id: "m-202",
        senderId: gv.username,
        text: "Thanks Rahul. Were you able to fix the masking glitch?",
        timestamp: "Yesterday, 9:20 AM",
        status: "read",
      },
      {
        id: "m-203",
        senderId: rahul.username,
        text: "Yes, I completely rebuilt the comp. It renders perfectly now.",
        timestamp: "Yesterday, 11:45 AM",
        status: "read",
      },
      {
        id: "m-204",
        senderId: gv.username,
        text: "Sounds like a plan. Let's start the milestone.",
        timestamp: "Yesterday, 2:30 PM",
        status: "read",
      },
    ],
  },
  {
    id: "conv-3",
    participants: [
      { id: "pixelpundit", name: "PixelPundit", avatar: "PP", role: "creator" },
      { id: arjun.username, name: arjun.name, avatar: arjun.avatar, role: "freelancer" },
    ],
    lastMessage: "Could you share the Figma link again? It expired.",
    lastUpdated: "Mon",
    unreadCount: 1,
    messages: [
      {
        id: "m-301",
        senderId: arjun.username,
        text: "Hello PixelPundit, I'm reaching out regarding your open UI/UX Designer role.",
        timestamp: "Monday, 9:00 AM",
        status: "read",
      },
      {
        id: "m-302",
        senderId: "pixelpundit",
        text: "Could you share the Figma link again? It expired.",
        timestamp: "Monday, 11:15 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv-4",
    participants: [
      { id: craftclips.username, name: craftclips.name, avatar: craftclips.avatar, role: "creator" },
      { id: rahul.username, name: rahul.name, avatar: rahul.avatar, role: "freelancer" },
    ],
    relatedJobId: "job-3",
    lastMessage: "Sounds great! The raw files are in the Google Drive folder.",
    lastUpdated: "10:20 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m-401",
        senderId: rahul.username,
        text: "Hi Craft Clips! Would love to help you edit your podcast clips.",
        timestamp: "Yesterday, 2:00 PM",
        status: "read",
      },
      {
        id: "m-402",
        senderId: craftclips.username,
        text: "Thanks Rahul. We are looking for someone to edit our long-form podcast into 5-6 Shorts.",
        timestamp: "Yesterday, 4:00 PM",
        status: "read",
      },
      {
        id: "m-403",
        senderId: rahul.username,
        text: "I specialize in shorts. Standard rate is ₹800 per short. Let me know when I can start!",
        timestamp: "Today, 9:00 AM",
        status: "read",
      },
      {
        id: "m-404",
        senderId: craftclips.username,
        text: "Sounds great! The raw files are in the Google Drive folder.",
        timestamp: "Today, 10:20 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv-5",
    participants: [
      { id: "some-creator", name: "StoryTime Studio", avatar: "ST", role: "creator" },
      { id: craftclips.username, name: craftclips.name, avatar: craftclips.avatar, role: "freelancer" },
    ],
    relatedJobId: "job-4",
    lastMessage: "I can deliver the edited video by next week.",
    lastUpdated: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m-501",
        senderId: "some-creator",
        text: "Hey! We loved your editing style on your main channel. Would you be willing to do some freelance editing for our documentary?",
        timestamp: "Yesterday, 10:00 AM",
        status: "read",
      },
      {
        id: "m-502",
        senderId: craftclips.username,
        text: "I can deliver the edited video by next week.",
        timestamp: "Yesterday, 11:30 AM",
        status: "read",
      },
    ],
  },
];
