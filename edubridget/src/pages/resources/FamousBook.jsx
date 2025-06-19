import React from "react";
import "../../css/ResourcesPage/famousBooks.css"; // Make sure this path matches your project

function FamousBooksTab() {
  const books = [
    {
      category: "Literature",
      items: [
        {
          title: "Things Fall Apart",
          author: "Chinua Achebe",
          premium: false,
          link: "https://drive.google.com/file/d/0B2qpuUPi6u33NTI5NTIwYjEtYjE5NC00MDBlLThlMmUtZjAxMzE0M2MwNTZj/view?resourcekey=0-elOOetvKsSCDaL8uBkuJmQ",
        },
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          premium: false,
          link: "https://freeditorial.com/en/books/the-great-gatsby",
        },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          premium: true,
          link: null,
        },
      ],
    },
    {
      category: "Science & Math",
      items: [
        {
          title: "Calculus Early Transcendentals",
          author: "James Stewart",
          premium: true,
          link: null,
        },
        {
          title: "Physics for Scientists",
          author: "Serway & Jewett",
          premium: true,
          link: null,
        },
        {
          title: "Organic Chemistry",
          author: "David Klein",
          premium: true,
          link: null,
        },
      ],
    },
    {
      category: "Programming",
      items: [
        {
          title: "Clean Code",
          author: "Robert C. Martin",
          premium: true,
          link: null,
        },
        {
          title: "You Don't Know JS (Yet)",
          author: "Kyle Simpson",
          premium: false,
          link: "https://www.goodreads.com/book/show/20901022-you-don-t-know-js",
        },
        {
          title: "The Pragmatic Programmer",
          author: "Andrew Hunt & David Thomas",
          premium: true,
          link: null,
        },
      ],
    },
  ];

  return (
    <div className="books-tab-container">
      <h1 className="books-title">Famous Books & Solutions</h1>
      <p className="books-subtitle">
        Access renowned textbooks with comprehensive solutions and explanations.
      </p>

      {books.map((section, index) => (
        <div key={index} className="book-section">
          <h2 className="section-title">{section.category}</h2>
          <div className="book-grid">
            {section.items.map((book, idx) => (
              <div key={idx} className="book-card">
                <div className="book-header">
                  <h3>{book.title}</h3>
                  {book.premium && <span className="lock-icon">🔒</span>}
                </div>
                <p className="book-author">by {book.author}</p>
                <p className="solutions">Solutions Available ✅</p>
                {book.premium ? (
                  <button className="book-btn disabled" disabled>
                    🔒 Premium Required
                  </button>
                ) : (
                  <a href={book.link} className="book-btn" target="_blank">
                    📖 Access Book
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FamousBooksTab;
