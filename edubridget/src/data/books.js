// Shared books data - Replace this with API calls in production
export const books = [
  {
    id: 1,
    category: "Literature",
    items: [
      {
        id: 1,
        title: "Things Fall Apart",
        author: "Chinua Achebe",
        premium: false,
        solutionsAvailable: true,
        link: "https://drive.google.com/file/d/0B2qpuUPi6u33NTI5NTIwYjEtYjE5NC00MDBlLThlMmUtZjAxMzE0M2MwNTZj/view?resourcekey=0-elOOetvKsSCDaL8uBkuJmQ",
      },
      {
        id: 2,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        premium: false,
        solutionsAvailable: true,
        link: "https://freeditorial.com/en/books/the-great-gatsby",
      },
      {
        id: 3,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        premium: true,
        solutionsAvailable: true,
        link: null,
      },
    ],
  },
  {
    id: 2,
    category: "Science & Math",
    items: [
      {
        id: 4,
        title: "Calculus Early Transcendentals",
        author: "James Stewart",
        premium: true,
        solutionsAvailable: true,
        link: null,
      },
      {
        id: 5,
        title: "Physics for Scientists",
        author: "Serway & Jewett",
        premium: true,
        solutionsAvailable: true,
        link: null,
      },
      {
        id: 6,
        title: "Organic Chemistry",
        author: "David Klein",
        premium: true,
        solutionsAvailable: true,
        link: null,
      },
    ],
  },
];
