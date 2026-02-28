// ── Types ────────────────────────────────────────────────────────────
export interface Freelancer {
  id: string;
  name: string;
  username: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  maxPrice: number;
  priceLabel: string;
  deliveryDays: number;
  deliveryLabel: string;
  tags: string[];
  bio: string;
  avatar: string;
  gradientFrom: string;
  gradientTo: string;
  badges: string[];
  subcategorySlugs: string[];
  jobsDone: number;
}

export type SortOption = "relevance" | "rating-desc" | "price-asc" | "price-desc" | "fastest" | "jobs-done-desc";

export interface FreelancerFilters {
  minPrice?: number;
  maxPrice?: number;
  delivery?: string;
  badges?: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────
function applyFilters(list: Freelancer[], f: FreelancerFilters): Freelancer[] {
  let out = list;
  if (f.minPrice !== undefined) out = out.filter((x) => x.price >= f.minPrice!);
  if (f.maxPrice !== undefined) out = out.filter((x) => x.price <= f.maxPrice!);
  if (f.delivery === "24h") out = out.filter((x) => x.deliveryDays <= 1);
  else if (f.delivery === "2-3d") out = out.filter((x) => x.deliveryDays >= 2 && x.deliveryDays <= 3);
  else if (f.delivery === "4d+") out = out.filter((x) => x.deliveryDays >= 4);
  if (f.badges?.length) out = out.filter((x) => f.badges!.some((b) => x.badges.includes(b)));
  return out;
}

function applySort(list: Freelancer[], sort: SortOption): Freelancer[] {
  const copy = [...list];
  switch (sort) {
    case "rating-desc": return copy.sort((a, b) => b.rating - a.rating);
    case "price-asc": return copy.sort((a, b) => a.price - b.price);
    case "price-desc": return copy.sort((a, b) => b.price - a.price);
    case "fastest": return copy.sort((a, b) => a.deliveryDays - b.deliveryDays);
    case "jobs-done-desc": return copy.sort((a, b) => b.jobsDone - a.jobsDone);
    default: return copy;
  }
}

export function getFreelancersBySubcategory(
  subSlug: string, sort: SortOption = "relevance", filters: FreelancerFilters = {}, offset = 0, limit = 10
): { freelancers: Freelancer[]; total: number } {
  let filtered = mockFreelancers.filter((f) => f.subcategorySlugs.includes(subSlug));
  filtered = applyFilters(filtered, filters);
  filtered = applySort(filtered, sort);
  return { freelancers: filtered.slice(offset, offset + limit), total: filtered.length };
}

export function getFreelancersByCategory(
  catSlug: string, sort: SortOption = "relevance", filters: FreelancerFilters = {}, offset = 0, limit = 10
): { freelancers: Freelancer[]; total: number } {
  const catSubSlugs: Record<string, string[]> = {
    "short-form-content": ["reels-shorts-editing","hook-optimization","subtitle-animations","long-video-to-shorts","batch-shorts-editing","trend-based-editing"],
    "ai-video-animation": ["script-to-ai-video","ai-avatar-creation","ai-reacting-characters","photo-to-ai-video","faceless-channel-automation","ai-ugc-promo-videos","ai-audio-voiceover","ai-image-generation"],
    "long-form-podcast-editing": ["vlog-editing","roast-comedy-editing","podcast-interview-editing","retention-style-editing","storytelling-documentary","gaming-commentary-editing","audio-cleanup-mastering"],
    "thumbnails-graphics-logos": ["youtube-thumbnails","gaming-thumbnails","reels-shorts-covers","instagram-carousel-posts","logo-branding","channel-art-banners","social-media-posters","end-screens-cards"],
    "script-writing-ideas": ["youtube-long-form-scripts","reels-shorts-scripts","kids-stories-scripts","storyboarding-shot-lists","content-ideas-research","viral-title-hook-writing","content-calendar-planning"],
    "ugc-on-camera-talent": ["human-ugc-acting","local-regional-actor","kid-child-actor","skits-comedy-acting","ugc-video-editing"],
    "voiceover-narration": ["gaming-commentary-voiceover","kids-cartoon-voiceover","hindi-regional-narration","english-neutral-voiceover","podcast-storytelling-voiceover","ai-voiceover-integration"],
    "gaming-streaming": ["gameplay-editing","montage-highlight-reels","stream-highlights","gaming-thumbnails-overlays","facecam-gameplay-sync","stream-intro-outro"],
    "growth-branding": ["channel-audit-growth","youtube-seo","ctr-retention-analysis","competitor-research","media-kits-sponsorship","social-media-management","logo-branding-kit"],
  };
  const slugs = catSubSlugs[catSlug] || [];
  let filtered = mockFreelancers.filter((f) => f.subcategorySlugs.some((s) => slugs.includes(s)));
  filtered = applyFilters(filtered, filters);
  filtered = applySort(filtered, sort);
  return { freelancers: filtered.slice(offset, offset + limit), total: filtered.length };
}

// ── Mock Data ────────────────────────────────────────────────────────
// Helper to make entries concise
const f = (id: number, name: string, username: string, role: string, loc: string, rating: number, reviews: number, price: number, maxP: number, pLabel: string, dDays: number, dLabel: string, tags: string[], bio: string, avatar: string, gFrom: string, gTo: string, badges: string[], subs: string[], jobs: number = 0): Freelancer => ({
  id: `fl-${id}`, name, username, role, location: loc, rating, reviews, price, maxPrice: maxP, priceLabel: pLabel, deliveryDays: dDays, deliveryLabel: dLabel, tags, bio, avatar, gradientFrom: gFrom, gradientTo: gTo, badges, subcategorySlugs: subs, jobsDone: jobs,
});

export const mockFreelancers: Freelancer[] = [
  // ── Short-Form Content (cat 1) ─────────────────────────────────
  f(1,"Rohan Kapoor","rohanedits","Reels Editor","Mumbai",4.8,145,600,2500,"₹600",1,"24 Hours",["Reels","Shorts","Trending"],"Edited 80+ Reels for fitness and lifestyle brands. Hook-first style...","RK","#E11D48","#F43F5E",["Beginner-Friendly"],["reels-shorts-editing","hook-optimization","trend-based-editing"],23),
  f(2,"Arjun Menon","arjuncuts","Short-Form Pro","Mumbai",4.9,127,1200,3500,"₹1,200",2,"2 Days",["YouTube","Shorts","Montage"],"YouTube Shorts specialist focused on montage and retention editing...","AM","#D97706","#F59E0B",["Retainer Available"],["reels-shorts-editing","subtitle-animations","long-video-to-shorts"],29),
  f(3,"Aman Tiwari","amanbatch","Batch Editor","Indore",4.7,82,500,1800,"₹500",2,"2 Days",["Batch","Shorts","Budget"],"Batch editing specialist for creators who need consistent volume...","AT","#9333EA","#A855F7",["Beginner-Friendly"],["batch-shorts-editing","reels-shorts-editing","trend-based-editing"],15),
  f(4,"Priya Sharma","priyahooks","Hook Specialist","Delhi",4.9,203,800,800,"₹800",1,"24 Hours",["Hooks","Captions","Viral"],"Former copywriter turned hook specialist. 70%+ watch time consistently...","PS","#E11D48","#FB7185",[],["hook-optimization","subtitle-animations","reels-shorts-editing"],41),
  f(5,"Karan Patel","karanshorts","Shorts Creator","Ahmedabad",4.6,98,450,450,"₹450",1,"24 Hours",["Reels","TikTok","Quick"],"Quick turnaround Shorts editor. TikTok and Reels format specialist...","KP","#F43F5E","#FB923C",["Beginner-Friendly"],["reels-shorts-editing","trend-based-editing"],8),
  f(6,"Neha Verma","nehakinetic","Motion Designer","Pune",4.8,156,1500,4000,"₹1,500",3,"3 Days",["Kinetic","Typography","Motion"],"Motion designer creating kinetic typography and animated captions...","NV","#EC4899","#F472B6",[],["subtitle-animations","reels-shorts-editing"],22),
  f(7,"Vikash Singh","vikashrepurpose","Repurpose Expert","Lucknow",4.5,67,700,700,"₹700",2,"2 Days",["Repurpose","Clips","Long-to-Short"],"Turn 1 long video into 10 viral Shorts. Content multiplication.","VS","#E11D48","#BE185D",["Retainer Available"],["long-video-to-shorts","batch-shorts-editing"],24),
  f(8,"Deepika Nair","deepikareels","Trend Chaser","Kochi",4.7,112,650,650,"₹650",1,"24 Hours",["Trends","Effects","Sounds"],"I track viral trends daily and edit content to ride trending sounds...","DN","#F43F5E","#E11D48",[],["trend-based-editing","reels-shorts-editing","hook-optimization"],18),
  f(9,"Siddharth Rao","sidshorts","Content Editor","Bangalore",4.8,178,900,2800,"₹900",2,"2 Days",["Reels","Subtitles","Professional"],"Full content editor handling Reels, subtitles, and post-production...","SR","#E11D48","#9333EA",["Retainer Available"],["reels-shorts-editing","subtitle-animations","batch-shorts-editing"],37),

  // ── AI Video & Animation (cat 2) ───────────────────────────────
  f(10,"Meera Joshi","meeraai","AI Video Creator","Hyderabad",4.9,189,2000,2000,"₹2,000",3,"3 Days",["AI Video","Automation","Scripts"],"Script-to-video in 48 hrs. AI workflows that look human-made.","MJ","#D97706","#F59E0B",[],["script-to-ai-video","faceless-channel-automation","ai-ugc-promo-videos"],29),
  f(11,"Raj Kumar","rajaiart","AI Artist","Delhi",4.7,134,1800,1800,"₹1,800",4,"4 Days",["AI Avatars","Characters","Consistent"],"Consistent AI characters that your audience recognizes. Brand-safe.","RK","#D97706","#FBBF24",["Retainer Available"],["ai-avatar-creation","ai-reacting-characters","ai-image-generation"],30),
  f(12,"Sneha Gupta","snehamagic","AI Animator","Pune",4.8,156,1500,1500,"₹1,500",2,"2 Days",["Photo-to-Video","Animation","AI"],"Static images → cinematic motion. Your photos, brought to life.","SG","#F59E0B","#D97706",[],["photo-to-ai-video","ai-avatar-creation","script-to-ai-video"],32),
  f(13,"Aditya Prakash","adityafaceless","Faceless Creator","Chennai",4.6,91,1000,1000,"₹1,000",3,"3 Days",["Faceless","Top 10","Automation"],"Fully automated faceless channels. Script → upload, hands-free.","AP","#D97706","#92400E",["Beginner-Friendly"],["faceless-channel-automation","script-to-ai-video"],34),
  f(14,"Tarun Bose","tarunugcai","AI UGC Pro","Kolkata",4.7,103,2500,2500,"₹2,500",3,"3 Days",["UGC","Product","Promo"],"AI-generated UGC that converts. Product promos at scale.","TB","#FBBF24","#D97706",[],["ai-ugc-promo-videos","ai-reacting-characters"],35),
  f(15,"Pooja Reddy","poojavoiceai","AI Voice Expert","Hyderabad",4.8,88,800,800,"₹800",1,"24 Hours",["Voiceover","AI Audio","Lip-sync"],"AI voices that sound real. Custom cloning + lip-sync integration.","PR","#D97706","#F59E0B",[],["ai-audio-voiceover","ai-voiceover-integration"],37),
  f(16,"Kunal Desai","kunalimgai","AI Image Creator","Surat",4.5,72,600,600,"₹600",1,"24 Hours",["AI Images","Thumbnails","Assets"],"AI-powered thumbnails and visual assets. Fast and stunning.","KD","#FBBF24","#F59E0B",["Beginner-Friendly"],["ai-image-generation","ai-avatar-creation"],38),
  f(17,"Nisha Pillai","nishaaichar","AI Character Pro","Trivandrum",4.9,167,3000,3000,"₹3,000",4,"4 Days",["Reacting","Commentary","Avatar"],"Commentary avatars with personality. Your AI alter ego.","NP","#D97706","#B45309",[],["ai-reacting-characters","ai-avatar-creation","photo-to-ai-video"],40),

  // ── Long-Form & Podcast Editing (cat 3) ────────────────────────
  f(18,"Sameer Khan","sameervlogs","Vlog Editor","Mumbai",4.8,192,1200,1200,"₹1,200",3,"3 Days",["Vlogs","Lifestyle","Cinematic"],"Vlogs that feel like mini movies. Cinematic cuts + color grading.","SK","#2563EB","#3B82F6",[],["vlog-editing","retention-style-editing"],42),
  f(19,"Ananya Das","ananyaroast","Comedy Editor","Kolkata",4.9,178,1500,1500,"₹1,500",2,"2 Days",["Roast","Comedy","Timing"],"Perfect comedic timing in every cut. Roast videos that hit different.","AD","#2563EB","#60A5FA",["Retainer Available"],["roast-comedy-editing","retention-style-editing"],43),
  f(20,"Dev Sharma","devpodcast","Podcast Editor","Delhi",4.7,145,2000,2000,"₹2,000",4,"4 Days",["Podcast","Interview","Multi-cam"],"Premium podcast editing. Multi-cam sync + audio perfection.","DS","#3B82F6","#2563EB",[],["podcast-interview-editing","audio-cleanup-mastering"],5),
  f(21,"Ritika Bajaj","ritikaretention","Retention Expert","Jaipur",4.8,136,1800,1800,"₹1,800",3,"3 Days",["Retention","Analytics","Edits"],"Data-driven editing. I study your analytics, then edit for watch-time.","RB","#2563EB","#1D4ED8",[],["retention-style-editing","vlog-editing"],6),
  f(22,"Arnav Mishra","arnavstory","Documentary Editor","Lucknow",4.9,112,2500,2500,"₹2,500",5,"5 Days",["Documentary","Story","Cinematic"],"Long-form storytelling that rivets attention. Film-school trained.","AM","#1D4ED8","#2563EB",[],["storytelling-documentary","vlog-editing"],8),
  f(23,"Ishita Ghosh","ishitagaming","Gaming Editor","Bangalore",4.6,89,800,800,"₹800",2,"2 Days",["Gaming","Commentary","Edits"],"Fast gaming edits with perfect commentary sync. Engaging every second.","IG","#3B82F6","#60A5FA",["Beginner-Friendly"],["gaming-commentary-editing","retention-style-editing"],10),
  f(24,"Manoj Pillai","manojaudio","Audio Engineer","Chennai",4.8,167,1000,1000,"₹1,000",2,"2 Days",["Audio","Mastering","Cleanup"],"Crystal-clear audio. Noise removal, EQ, mastering — studio quality.","MP","#2563EB","#3B82F6",[],["audio-cleanup-mastering","podcast-interview-editing"],11),
  f(25,"Tanvi Shah","tanvipod","Podcast Pro","Ahmedabad",4.7,98,1400,1400,"₹1,400",3,"3 Days",["Podcast","Editing","Branding"],"End-to-end podcast production. Editing, mastering, show notes.","TS","#60A5FA","#2563EB",["Retainer Available"],["podcast-interview-editing","audio-cleanup-mastering","storytelling-documentary"],13),

  // ── Thumbnails, Graphics & Logos (cat 4) ────────────────────────
  f(26,"Ravi Deshmukh","ravidesigns","Thumbnail Artist","Nagpur",4.9,234,400,400,"₹400",1,"24 Hours",["Thumbnails","CTR","Design"],"10%+ CTR guaranteed. Thumbnails that demand clicks.","RD","#DB2777","#EC4899",[],["youtube-thumbnails","gaming-thumbnails"],14),
  f(27,"Simran Kaur","simrangfx","Graphic Designer","Chandigarh",4.8,189,600,600,"₹600",1,"24 Hours",["Logos","Branding","Design"],"Logos that creators actually love. Minimal, bold, memorable.","SK","#DB2777","#F472B6",["Retainer Available"],["logo-branding","channel-art-banners","social-media-posters"],16),
  f(28,"Aakash Jain","aakashcovers","Cover Artist","Jaipur",4.7,123,350,350,"₹350",1,"24 Hours",["Covers","Reels","Shorts"],"Scroll-stopping covers for your Reels and Shorts. Eye candy.","AJ","#EC4899","#DB2777",["Beginner-Friendly"],["reels-shorts-covers","youtube-thumbnails"],18),
  f(29,"Divya Menon","divyacarousel","Carousel Designer","Kochi",4.8,156,500,500,"₹500",2,"2 Days",["Carousel","Instagram","Posts"],"Carousels that get saved and shared. Swipe-worthy, every time.","DM","#DB2777","#BE185D",[],["instagram-carousel-posts","social-media-posters"],19),
  f(30,"Nikhil Verma","nikhilbanners","Banner Designer","Delhi",4.6,87,300,300,"₹300",1,"24 Hours",["Banners","Watermarks","Channel"],"Complete channel branding in a day. Banner + watermark + logo.","NV","#F472B6","#DB2777",["Beginner-Friendly"],["channel-art-banners","end-screens-cards"],21),
  f(31,"Kavita Iyer","kavitaposters","Poster Designer","Mumbai",4.7,134,450,450,"₹450",2,"2 Days",["Posters","Templates","Social"],"Templates you can reuse forever. Professional poster packs.","KI","#DB2777","#EC4899",[],["social-media-posters","instagram-carousel-posts","reels-shorts-covers"],22),
  f(32,"Harish Patel","harishgaming","Gaming GFX","Ahmedabad",4.8,178,550,550,"₹550",1,"24 Hours",["Gaming","Thumbnails","GFX"],"Gaming thumbnails that pop. Fortnite, Valorant, BGMI — you name it.","HP","#EC4899","#DB2777",[],["gaming-thumbnails","youtube-thumbnails","gaming-thumbnails-overlays"],24),
  f(33,"Sonal Thakkar","sonalendscreens","End Screen Pro","Surat",4.5,65,250,250,"₹250",1,"24 Hours",["End Screens","Cards","YouTube"],"Professional end screens and cards. More subs from every video.","ST","#DB2777","#F472B6",["Beginner-Friendly"],["end-screens-cards","channel-art-banners"],26),

  // ── Script Writing & Ideas (cat 5) ─────────────────────────────
  f(34,"Anjali Nair","anjaliscripts","Scriptwriter","Kochi",4.9,198,1500,1500,"₹1,500",3,"3 Days",["Scripts","YouTube","Long-form"],"Scripts that keep viewers till the end. Story structure + hooks.","AN","#059669","#10B981",[],["youtube-long-form-scripts","viral-title-hook-writing"],27),
  f(35,"Rohit Chauhan","rohithooks","Hook Writer","Bhopal",4.8,145,400,400,"₹400",1,"24 Hours",["Hooks","Reels","Scripts"],"Script and hook writer combining data-driven structures with Indian...","RC","#059669","#34D399",["Retainer Available"],["reels-shorts-scripts","viral-title-hook-writing","hook-optimization"],34),
  f(36,"Megha Kulkarni","meghakids","Kids Content Writer","Pune",4.7,89,800,800,"₹800",3,"3 Days",["Kids","Stories","Nursery"],"Stories kids beg to hear again. Nursery rhymes that teach + entertain.","MK","#10B981","#059669",[],["kids-stories-scripts","youtube-long-form-scripts"],30),
  f(37,"Varun Shetty","varunboard","Storyboard Artist","Bangalore",4.8,112,2000,2000,"₹2,000",4,"4 Days",["Storyboard","Shots","Visual"],"Visual planning that saves you hours on set. Frame-by-frame clarity.","VS","#059669","#047857",[],["storyboarding-shot-lists","content-ideas-research"],32),
  f(38,"Tanya Oberoi","tanyaideas","Content Strategist","Delhi",4.9,167,1200,1200,"₹1,200",2,"2 Days",["Ideas","Research","Strategy"],"Never run out of content ideas. Trend-backed research + ideation.","TO","#34D399","#059669",[],["content-ideas-research","content-calendar-planning","viral-title-hook-writing"],34),
  f(39,"Gaurav Pandey","gauravtitles","Title Expert","Varanasi",4.6,78,300,300,"₹300",1,"24 Hours",["Titles","SEO","Clicks"],"Titles that YouTube recommends. SEO-optimized, curiosity-driven.","GP","#059669","#10B981",["Beginner-Friendly"],["viral-title-hook-writing","youtube-seo"],35),
  f(40,"Lakshmi Rajan","lakshmiplanner","Content Planner","Chennai",4.7,123,1000,1000,"₹1,000",3,"3 Days",["Calendar","Planning","Series"],"30-day content calendars with topic research. Stay consistent.","LR","#10B981","#059669",["Retainer Available"],["content-calendar-planning","content-ideas-research"],37),
  f(41,"Shivam Malik","shivamscripts","Script Pro","Noida",4.8,156,900,900,"₹900",2,"2 Days",["Scripts","Reels","Shorts"],"Short-form scripts that convert. Hook → value → CTA, every time.","SM","#059669","#34D399",[],["reels-shorts-scripts","youtube-long-form-scripts","viral-title-hook-writing"],38),

  // ── UGC & On-Camera Talent (cat 6) ─────────────────────────────
  f(42,"Palak Gupta","palakugc","UGC Creator","Mumbai",4.9,212,2000,2000,"₹2,000",3,"3 Days",["UGC","Product","Review"],"Authentic product reviews that sell. 50+ brands served.","PG","#B45309","#D97706",[],["human-ugc-acting","ugc-video-editing"],40),
  f(43,"Vishal Tomar","vishallocalactor","Local Actor","Jaipur",4.7,98,1500,1500,"₹1,500",2,"2 Days",["Acting","Regional","Shoots"],"Hindi-belt shoots. Relatable, regional, real. City-specific talent.","VT","#D97706","#B45309",["Beginner-Friendly"],["local-regional-actor","human-ugc-acting"],42),
  f(44,"Swati Bhatt","swatikids","Kids Actor Mom","Ahmedabad",4.8,134,1800,1800,"₹1,800",4,"4 Days",["Kids","Family","Child"],"Professional child talent management. Kid-safe, parent-approved.","SB","#B45309","#92400E",[],["kid-child-actor","human-ugc-acting"],43),
  f(45,"Rishi Kapoor","rishicomedy","Comedy Actor","Delhi",4.9,178,2500,2500,"₹2,500",2,"2 Days",["Comedy","Skits","Roast"],"Comedy that goes viral. Roast videos, skits, and sketches.","RK","#D97706","#F59E0B",["Retainer Available"],["skits-comedy-acting","human-ugc-acting"],5),
  f(46,"Nidhi Agarwal","nidhiugced","UGC Editor","Pune",4.6,76,800,800,"₹800",2,"2 Days",["Editing","UGC","Polish"],"Raw UGC → polished perfection. Color grade + sound + captions.","NA","#B45309","#D97706",["Beginner-Friendly"],["ugc-video-editing","human-ugc-acting"],6),
  f(47,"Amit Saxena","amitactor","Versatile Actor","Lucknow",4.7,112,1200,1200,"₹1,200",3,"3 Days",["Acting","UGC","Skits"],"Natural acting for brands. Product demos, testimonials, skits.","AS","#D97706","#B45309",[],["human-ugc-acting","local-regional-actor","skits-comedy-acting"],8),
  f(48,"Prerna Jha","prernakid","Child Actor Agent","Mumbai",4.8,89,2200,2200,"₹2,200",5,"5 Days",["Kids","Casting","Professional"],"Top child talent in Mumbai. Portfolio shoots + brand collaborations.","PJ","#B45309","#92400E",[],["kid-child-actor","local-regional-actor"],10),

  // ── Voiceover & Narration (cat 7) ──────────────────────────────
  f(49,"Gaurav Nath","gauravvo","Gaming VO","Kolkata",4.8,167,600,600,"₹600",1,"24 Hours",["Gaming","Commentary","Energy"],"High-energy gaming commentary. Hype moments that pop.","GN","#16A34A","#22C55E",[],["gaming-commentary-voiceover","english-neutral-voiceover"],11),
  f(50,"Shriya Das","shriyakids","Kids VO Artist","Bangalore",4.9,145,800,800,"₹800",2,"2 Days",["Kids","Cartoon","Fun"],"Voices kids love. Cartoon characters, narration, nursery rhymes.","SD","#22C55E","#16A34A",[],["kids-cartoon-voiceover","hindi-regional-narration"],13),
  f(51,"Rajesh Iyer","rajeshhindi","Hindi Narrator","Chennai",4.7,134,500,500,"₹500",1,"24 Hours",["Hindi","Narration","Professional"],"Deep, engaging Hindi narration. Documentaries, explainers, ads.","RI","#16A34A","#15803D",[],["hindi-regional-narration","podcast-storytelling-voiceover"],14),
  f(52,"Alina Thomas","alinaenglish","English VO","Goa",4.8,189,1200,1200,"₹1,200",2,"2 Days",["English","Neutral","Clean"],"Crystal-clear English narration. Neutral accent, global appeal.","AT","#22C55E","#16A34A",["Retainer Available"],["english-neutral-voiceover","podcast-storytelling-voiceover"],16),
  f(53,"Prakash Nair","prakashpod","Podcast VO","Trivandrum",4.6,78,400,400,"₹400",1,"24 Hours",["Podcast","Intro","Storytelling"],"Podcast intros that hook listeners. Warm, inviting voice.","PN","#16A34A","#22C55E",["Beginner-Friendly"],["podcast-storytelling-voiceover","english-neutral-voiceover"],17),
  f(54,"Jaya Mishra","jayaaivo","AI Voice Expert","Noida",4.9,112,1500,1500,"₹1,500",2,"2 Days",["AI Voice","Cloning","Setup"],"AI voiceover setup + integration. Custom voice clones that work.","JM","#22C55E","#16A34A",[],["ai-voiceover-integration","ai-audio-voiceover"],19),
  f(55,"Mohit Sinha","mohitregional","Regional VO","Patna",4.7,98,350,350,"₹350",1,"24 Hours",["Regional","Bhojpuri","Hindi"],"Regional language VO — Hindi, Bhojpuri, Maithili. Authentic tones.","MS","#16A34A","#15803D",["Beginner-Friendly"],["hindi-regional-narration","gaming-commentary-voiceover"],21),
  f(56,"Diya Kapoor","diyavo","Versatile VO","Mumbai",4.8,156,900,900,"₹900",2,"2 Days",["Versatile","Multi-accent","Pro"],"Multiple voices, one artist. Ads, narration, characters.","DK","#22C55E","#16A34A",[],["english-neutral-voiceover","kids-cartoon-voiceover","podcast-storytelling-voiceover"],22),

  // ── Gaming & Streaming (cat 8) ─────────────────────────────────
  f(57,"Yash Tandon","yashgaming","Gaming Editor","Delhi",4.9,212,1500,1500,"₹1,500",2,"2 Days",["Gaming","Montage","Highlights"],"Montages that get millions. Valorant, BGMI, GTA — cinematic kills.","YT","#9333EA","#A855F7",[],["gameplay-editing","montage-highlight-reels","facecam-gameplay-sync"],24),
  f(58,"Sahil Mehra","sahilstream","Stream Editor","Mumbai",4.7,145,800,800,"₹800",2,"2 Days",["Streams","Highlights","Clips"],"Stream → viral clips. Best moments, perfectly cut and branded.","SM","#A855F7","#9333EA",["Retainer Available"],["stream-highlights","gameplay-editing"],25),
  f(59,"Pranav Joshi","pranavoverlay","Overlay Designer","Pune",4.8,167,1000,1000,"₹1,000",3,"3 Days",["Overlays","Thumbnails","Stream"],"Custom stream packages. Overlays, alerts, panels — full kit.","PJ","#9333EA","#7C3AED",[],["gaming-thumbnails-overlays","stream-intro-outro"],27),
  f(60,"Nikita Sharma","nikitafacecam","Facecam Editor","Bangalore",4.6,89,600,600,"₹600",1,"24 Hours",["Facecam","Sync","Gaming"],"Facecam + gameplay perfectly synced. Clean transitions, zero lag.","NS","#A855F7","#9333EA",["Beginner-Friendly"],["facecam-gameplay-sync","gameplay-editing"],29),
  f(61,"Harsh Agarwal","harshintro","Intro Animator","Noida",4.8,134,1200,1200,"₹1,200",4,"4 Days",["Intro","Outro","Animation"],"3D animated intros that give your channel instant credibility.","HA","#9333EA","#A855F7",[],["stream-intro-outro","gaming-thumbnails-overlays"],30),
  f(62,"Ankit Bhardwaj","ankitmontage","Montage King","Jaipur",4.9,198,2000,2000,"₹2,000",3,"3 Days",["Montage","Cinematic","Pro"],"The montage guy. 200+ gaming montages delivered. Epic every time.","AB","#7C3AED","#9333EA",[],["montage-highlight-reels","gameplay-editing","stream-highlights"],32),
  f(63,"Raghav Chauhan","raghavedits","Gaming Content","Lucknow",4.5,67,500,500,"₹500",2,"2 Days",["Gaming","Edits","Budget"],"Affordable gaming edits. Clean cuts, effects, and sound design.","RC","#9333EA","#A855F7",["Beginner-Friendly"],["gameplay-editing","facecam-gameplay-sync","stream-highlights"],33),

  // ── Growth & Branding (cat 9) ──────────────────────────────────
  f(64,"Naveen Reddy","naveenseo","SEO Expert","Hyderabad",4.9,234,2000,2000,"₹2,000",3,"3 Days",["SEO","YouTube","Growth"],"YouTube SEO that ranks. Titles, tags, descriptions — all optimized.","NR","#0891B2","#06B6D4",[],["youtube-seo","channel-audit-growth","ctr-retention-analysis"],35),
  f(65,"Mansi Goyal","mansigrowth","Growth Strategist","Delhi",4.8,178,3000,3000,"₹3,000",5,"5 Days",["Growth","Audit","Strategy"],"Full channel audits that 10x your growth. Data-backed roadmaps.","MG","#06B6D4","#0891B2",["Retainer Available"],["channel-audit-growth","ctr-retention-analysis","competitor-research"],37),
  f(66,"Suresh Babu","sureshctr","CTR Analyst","Chennai",4.7,123,1500,1500,"₹1,500",3,"3 Days",["CTR","Retention","Data"],"Improve CTR by 3-5%. Thumbnail A/B testing + retention analytics.","SB","#0891B2","#0E7490",[],["ctr-retention-analysis","youtube-seo"],38),
  f(67,"Anushka Sen","anushkamedia","Media Kit Pro","Mumbai",4.8,156,1200,1200,"₹1,200",2,"2 Days",["Media Kit","Sponsorship","Deck"],"Media kits that land brand deals. Professional, impressive, ready.","AS","#06B6D4","#0891B2",[],["media-kits-sponsorship","logo-branding-kit"],40),
  f(68,"Kartik Jain","kartikcompetitor","Research Analyst","Bangalore",4.6,89,800,800,"₹800",3,"3 Days",["Research","Competitor","Niche"],"Know your competitors inside out. Gap analysis + content strategy.","KJ","#0891B2","#06B6D4",["Beginner-Friendly"],["competitor-research","content-ideas-research"],41),
  f(69,"Rashmi Devi","rashmisocial","Social Manager","Jaipur",4.7,112,600,600,"₹600",1,"24 Hours",["Social","Posting","Community"],"Consistent posting + community engagement. Your social media, handled.","RD","#06B6D4","#0891B2",["Retainer Available"],["social-media-management","content-calendar-planning"],43),
  f(70,"Farhan Ali","farhanlogo","Brand Designer","Lucknow",4.9,145,1800,1800,"₹1,800",4,"4 Days",["Logo","Branding","Kit"],"Complete branding kits. Logo + colors + fonts + templates.","FA","#0891B2","#0E7490",[],["logo-branding-kit","logo-branding","channel-art-banners"],5),
  f(71,"Preeti Mahajan","preetiaudit","Channel Auditor","Chandigarh",4.8,98,2500,2500,"₹2,500",5,"5 Days",["Audit","Growth","Plan"],"Detailed 20-page audits with actionable growth roadmaps.","PM","#06B6D4","#0891B2",[],["channel-audit-growth","youtube-seo","ctr-retention-analysis"],6),

  // ── Cross-category specialists (extras) ────────────────────────
  f(72,"Aryan Malhotra","aryanall","Full-Stack Creator","Mumbai",4.9,267,3000,8000,"₹3,000",4,"4 Days",["Full-Stack","Scripts","Editing"],"Full-stack creator editor. Scripts, edits, and captions all in one...","AM","#E11D48","#2563EB",["Retainer Available"],["reels-shorts-editing","youtube-long-form-scripts","youtube-thumbnails","youtube-seo"],61),
  f(73,"Komal Bhatt","komalcontent","Content Swiss Knife","Ahmedabad",4.8,189,1500,1500,"₹1,500",3,"3 Days",["Multi-skill","Content","Creator"],"Editing, scripts, thumbnails, voiceover — I do it all.","KB","#059669","#DB2777",[],["vlog-editing","reels-shorts-scripts","reels-shorts-covers","english-neutral-voiceover"],9),
  f(74,"Dhruv Patel","dhruvtech","Tech Creator Editor","Surat",4.7,134,1200,1200,"₹1,200",2,"2 Days",["Tech","Reviews","Editing"],"Tech review specialist. Unboxings, comparisons, how-tos.","DP","#2563EB","#9333EA",[],["vlog-editing","retention-style-editing","youtube-thumbnails","subtitle-animations"],11),
  f(75,"Sakshi Mehta","sakshiai","AI + Design Pro","Pune",4.8,156,2000,2000,"₹2,000",3,"3 Days",["AI","Design","Creative"],"AI-powered design workflows. Thumbnails + AI video + branding.","SM","#D97706","#DB2777",[],["ai-image-generation","youtube-thumbnails","logo-branding","script-to-ai-video"],13),
  f(76,"Rajat Verma","rajatgamer","Gaming All-Rounder","Delhi",4.7,112,1000,1000,"₹1,000",2,"2 Days",["Gaming","Full-service","Edit"],"Gaming content A-Z. Edit, thumbnail, overlay, montage.","RV","#9333EA","#E11D48",[],["gameplay-editing","gaming-thumbnails","gaming-thumbnails-overlays","montage-highlight-reels","gaming-commentary-voiceover"],14),
  f(77,"Zara Khan","zaracreator","UGC + Script Pro","Mumbai",4.9,198,1800,1800,"₹1,800",3,"3 Days",["UGC","Scripts","Authentic"],"On-camera UGC creator shooting authentic product reviews in Mumbai...","ZK","#B45309","#059669",[],["human-ugc-acting","reels-shorts-scripts","ugc-video-editing","hook-optimization"],52),
  f(78,"Vivek Sharma","vivekpodpro","Podcast Specialist","Bangalore",4.8,167,2200,2200,"₹2,200",3,"3 Days",["Podcast","Full-service","Audio"],"Full podcast production. Recording guidance → edit → master → publish.","VS","#2563EB","#16A34A",[],["podcast-interview-editing","audio-cleanup-mastering","podcast-storytelling-voiceover","content-calendar-planning"],17),
  f(79,"Kriti Sood","kritibrand","Brand Strategist","Delhi",4.8,145,2800,2800,"₹2,800",5,"5 Days",["Branding","Strategy","Growth"],"End-to-end creator branding. Logo + content strategy + media kit.","KS","#0891B2","#DB2777",[],["logo-branding-kit","channel-audit-growth","media-kits-sponsorship","social-media-posters"],19),
  f(80,"Arun Nambiar","aruncinema","Cinematic Editor","Kochi",4.9,223,3500,3500,"₹3,500",5,"5 Days",["Cinematic","Premium","Film"],"Film-quality edits for creators who want the best. Award-winning.","AN","#2563EB","#059669",[],["storytelling-documentary","vlog-editing","retention-style-editing","youtube-long-form-scripts"],21),


  // ── More Short-Form Content ─────────────────────────────────
  f(101,"Rahul Das","rahulviral","Shorts Editor","Kolkata",4.7,76,550,550,"₹550",1,"24 Hours",["Shorts","Hooks"],"3 years editing YouTube Shorts for local channels. Affordable rates...","RD","#FB7185","#F43F5E",[],["reels-shorts-editing","hook-optimization"],11),
  f(102,"Sneha Iyer","snehacuts","Reels Specialist","Chennai",4.8,134,950,950,"₹950",2,"2 Days",["Instagram","Reels"],"Instagram Reels specialist focused on saves and shares growth...","SI","#9333EA","#C084FC",["Retainer Available"],["reels-shorts-editing","subtitle-animations"],19),
  f(103,"Harshit Gupta","harshitbatch","Bulk Shorts Editor","Delhi",4.6,52,400,400,"₹400",2,"2 Days",["Bulk","Shorts"],"Creators who post daily love working with me.","HG","#F97316","#FB923C",["Beginner-Friendly"],["batch-shorts-editing","long-video-to-shorts"],17),

  // ── More AI Video & Animation ───────────────────────────────
  f(120,"Aditya Kulkarni","adikreate","AI Video Creator","Pune",4.9,210,2200,2200,"₹2,200",3,"3 Days",["AI","Video"],"Script to full AI video production.","AK","#6366F1","#8B5CF6",["Retainer Available"],["script-to-ai-video","ai-avatar-creation"],44),
  f(121,"Maya Fernandes","mayaai","AI Animator","Goa",4.7,88,1800,1800,"₹1,800",3,"3 Days",["AI","Animation"],"Photo to cinematic AI video animation.","MF","#EC4899","#F472B6",[],["photo-to-ai-video","ai-image-generation"],6),
  f(122,"Ritesh Jha","riteshgen","GenAI Creator","Patna",4.6,63,1600,1600,"₹1,600",2,"2 Days",["GenAI","Creator"],"AI UGC ads and product promos.","RJ","#8B5CF6","#6366F1",[],["ai-ugc-promo-videos","ai-avatar-creation"],8),

  // ── Long Form & Podcast Editing ─────────────────────────────
  f(140,"Kabir Arora","kabiredits","Podcast Editor","Delhi",4.8,190,2000,2000,"₹2,000",3,"3 Days",["Podcast","Audio"],"Professional podcast cleanup and editing.","KA","#22C55E","#4ADE80",["Retainer Available"],["podcast-interview-editing","audio-cleanup-mastering"],36),
  f(141,"Nitin Bansal","nitinvlogs","Vlog Editor","Jaipur",4.7,122,1500,1500,"₹1,500",3,"3 Days",["Vlog","YouTube"],"Travel vlog storytelling edits.","NB","#0EA5E9","#38BDF8",[],["vlog-editing","storytelling-documentary"],38),
  f(142,"Dev Malhotra","devgaming","Gaming Editor","Chandigarh",4.6,89,1300,1300,"₹1,300",2,"2 Days",["Gaming","YouTube"],"High energy gaming edits and commentary pacing.","DM","#6366F1","#818CF8",[],["gaming-commentary-editing"],39),

  // ── Thumbnails / Graphics ───────────────────────────────────
  f(160,"Aakash Jain","thumbpro","Thumbnail Designer","Indore",4.9,310,700,700,"₹700",1,"24 Hours",["Thumbnails","CTR"],"High CTR YouTube thumbnails.","AJ","#F59E0B","#FBBF24",["Beginner-Friendly"],["youtube-thumbnails","gaming-thumbnails"],28),
  f(161,"Tanya Dsouza","designbytanya","Graphic Designer","Mumbai",4.8,211,1200,1200,"₹1,200",2,"2 Days",["Branding","Social"],"Modern social media design packs.","TD","#EC4899","#F472B6",["Retainer Available"],["instagram-carousel-posts","social-media-posters"],30),
  f(162,"Rohit Sethi","logomaster","Logo Designer","Delhi",4.7,156,1800,1800,"₹1,800",3,"3 Days",["Logos","Brand"],"Minimalist brand identity and logos.","RS","#8B5CF6","#A78BFA",[],["logo-branding","channel-art-banners"],31),

  // ── Script Writing ──────────────────────────────────────────
  f(180,"Ankit Mishra","ankitscripts","YouTube Scriptwriter","Lucknow",4.8,142,1000,1000,"₹1,000",2,"2 Days",["Script","YouTube"],"Retention optimized storytelling scripts.","AM","#14B8A6","#2DD4BF",[],["youtube-long-form-scripts","viral-title-hook-writing"],20),
  f(181,"Sara Khan","sarawrites","Content Writer","Bhopal",4.7,91,850,850,"₹850",2,"2 Days",["Ideas","Content"],"Viral content ideas and hooks.","SK","#06B6D4","#67E8F9",[],["content-ideas-research","content-calendar-planning"],22),

  // ── Voiceover ───────────────────────────────────────────────
  f(200,"Imran Sheikh","voiceimran","Voice Artist","Mumbai",4.9,320,900,900,"₹900",1,"24 Hours",["Voice","Narration"],"Deep professional voiceovers.","IS","#F43F5E","#FB7185",["Retainer Available"],["english-neutral-voiceover","podcast-storytelling-voiceover"],12),
  f(201,"Riya Bose","riyavoice","Narrator","Kolkata",4.8,205,850,850,"₹850",1,"24 Hours",["Voice","Kids"],"Warm storytelling narration.","RB","#22C55E","#4ADE80",[],["kids-cartoon-voiceover","hindi-regional-narration"],14),

  // ── Growth / Branding ───────────────────────────────────────
  f(220,"Saurabh Mehta","ytgrowth","YouTube Strategist","Gurgaon",4.9,410,3000,3000,"₹3,000",4,"4 Days",["SEO","Growth"],"Channel growth strategist.","SM","#6366F1","#4F46E5",["Retainer Available"],["youtube-seo","ctr-retention-analysis"],44),
  f(221,"Pooja Kulshreshtha","brandpooja","Brand Consultant","Delhi",4.7,144,2500,2500,"₹2,500",3,"3 Days",["Brand","Strategy"],"Creator branding and sponsorship decks.","PK","#F59E0B","#FBBF24",[],["media-kits-sponsorship","channel-audit-growth"],5),
];
