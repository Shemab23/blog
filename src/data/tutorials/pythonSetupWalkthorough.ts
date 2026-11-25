import { registerTutorial } from "../TutorialRegistry";

registerTutorial({
  id: "tut-001",
  title: "Python Memory Model & Primitive Types Explained Visually",
  youtubeUrl: "https://youtube.com",
  thumbnailUrl: "/images/cover.jpg",
  duration: "14:20",
  publishedDate: "2026/07",
  tags: ["#Python", "#Fundamentals"],
  whatToExpect: [
    "How Python binds variable names to heap objects",
    "Memory address inspection using id() and type()",
    "Common type-casting pitfalls when handling user input",
  ],
  relatedBlogSlug: "python-basics",
});
