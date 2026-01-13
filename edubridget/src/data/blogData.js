// Shared blog and news data - Replace this with API calls in production

export const studyTips = [
  {
    id: 1,
    title: "The Pomodoro Technique: Boost Your Focus in 25 Minutes",
    excerpt:
      "Learn how to use the scientifically-proven Pomodoro Technique to maximize your study sessions...",
    author: "Dr. Sarah Chen",
    date: "Nov 30, 2024",
    category: "Study Tips",
    readTime: "4 min read",
    views: 1250,
    likes: 89,
    comments: 23,
    difficulty: "Beginner",
    tags: ["productivity", "time-management", "focus"],
  },
  {
    id: 2,
    title: "Memory Palace: Ancient Technique for Modern Students",
    excerpt:
      "Discover how to build a memory palace and remember complex information effortlessly...",
    author: "Prof. Michael Torres",
    date: "Nov 28, 2024",
    category: "Study Tips",
    readTime: "7 min read",
    views: 982,
    likes: 156,
    comments: 34,
    difficulty: "Intermediate",
    tags: ["memory", "techniques", "learning"],
  },
];

export const guestArticles = [
  {
    id: 3,
    title: "From Street Vendor to PhD: My Journey Through Education",
    excerpt:
      "A personal story of overcoming adversity and the transformative power of education in Rwanda...",
    author: "Grace Uwimana",
    authorTitle: "PhD in Economics, University of Rwanda",
    date: "Nov 25, 2024",
    category: "Guest Articles",
    readTime: "12 min read",
    views: 3400,
    likes: 450,
    comments: 89,
    featured: true,
    tags: ["inspiration", "success-story", "perseverance"],
  },
];

export const academicResources = [
  {
    id: 4,
    title: "Complete Guide to APA 7th Edition Citation",
    excerpt:
      "Master academic writing with our comprehensive APA citation guide, including examples and common mistakes...",
    author: "Academic Writing Center",
    date: "Nov 30, 2024",
    category: "Academic Resources",
    readTime: "15 min read",
    views: 5200,
    likes: 620,
    comments: 128,
    downloadable: true,
    tags: ["citation", "writing", "academic"],
  },
];

export const localNews = [{
  id: 5,
  title: "From Street Vendor to PhD: My Journey Through Education",
  excerpt:
    "A personal story of overcoming adversity and the transformative power of education in Rwanda...",
  author: "Grace Uwimana",
  authorTitle: "PhD in Economics, University of Rwanda",
  date: "Nov 25, 2024",
  category: "Guest Articles",
  readTime: "12 min read",
  views: 3400,
  likes: 450,
  comments: 89,
  featured: true,
  tags: ["inspiration", "success-story", "perseverance"],
}]

// Combine all blog posts
export const allBlogPosts = [...studyTips, ...guestArticles, ...academicResources,...localNews];
