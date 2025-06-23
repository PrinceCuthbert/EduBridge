import React, { useState } from "react";
import "../../css/ResourcesPage/blog&news.css";

function BlogNewsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const studyTips = [
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
      image: "./public/istockphoto-2094337676-1024x1024.jpg",
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
      image: "./public/istockphoto-2094337676-1024x1024.jpg",
      tags: ["memory", "techniques", "learning"],
    },
  ];

  const guestArticles = [
    {
      id: 4,
      title: "From Street Vendor to PhD: My Journey Through Education",
      excerpt:
        "A personal story of overcoming adversity and the transformative power of education in Rwanda...",
      author: "Grace Uwimana",
      authorTitle: "PhD in Economics, University of Rwanda",
      date: "Nov 29, 2024",
      category: "Guest Articles",
      readTime: "12 min read",
      views: 3400,
      likes: 450,
      comments: 89,
      featured: true,
      image: "./public/istockphoto-2094337676-1024x1024.jpg",
      tags: ["inspiration", "success-story", "perseverance"],
    },
  ];

  const academicResources = [
    {
      id: 7,
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
      image: "./public/istockphoto-2094337676-1024x1024.jpg",
      tags: ["citation", "writing", "academic"],
    },
  ];

  const allBlogPosts = [...studyTips, ...guestArticles, ...academicResources];

  const filteredPosts = allBlogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "level beginner";
      case "Intermediate":
        return "level intermediate";
      case "Advanced":
        return "level advanced";
      default:
        return "level";
    }
  };

  return (
    <>
      <div className="container blog-news">
        <h1>Blog & Educational News</h1>
        <p className="subtext">
          Stay updated with the latest education trends, study tips, and expert
          insights.
        </p>
        {/* Search + Filters */}
        <div className="blog-controls">
          <input
            type="text"
            placeholder="Search articles, tips, or topics..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filters">
            <button
              className={`filter ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}>
              All
            </button>
            <button
              className={`filter ${
                selectedCategory === "Study Tips" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("Study Tips")}>
              💡 Study Tips
            </button>
            <button
              className={`filter ${
                selectedCategory === "Guest Articles" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("Guest Articles")}>
              ✍️ Guest Articles
            </button>
            <button
              className={`filter ${
                selectedCategory === "Academic Resources" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("Academic Resources")}>
              📚 Academic Resources
            </button>
          </div>
        </div>
        {/* Featured Article */}
        {filteredPosts.some((post) => post.featured) && (
          <div className="featured-article card">
            {filteredPosts
              .filter((post) => post.featured)
              .map((post) => (
                <div key={post.id} className="card-content">
                  <div className="text">
                    <span className="badge">⭐ Featured Article</span>
                    <h2>{post.title}</h2>
                    <p
                      className="excerpt"
                      style={{ fontSize: "1.6rem", marginRight: "1rem" }}>
                      {post.excerpt}
                    </p>
                    <div className="details">
                      <div className="meta">
                        <span>{post.author}</span>
                        {"authorTitle" in post && (
                          <span
                            style={{
                              display: "inline-block",
                              minWidth: "200px",
                            }}>
                            {post.authorTitle}
                          </span>
                        )}
                        <span>{post.date}</span>
                        <span
                          style={{
                            marginLeft: "12px",
                          }}>
                          {post.readTime}
                        </span>
                      </div>
                    </div>

                    <div className="engagement">
                      <p>👁️ {post.views} &nbsp;</p>
                      <p>❤️ {post.likes} &nbsp;</p>
                      <p>💬 {post.comments}</p>
                    </div>
                    <div className="actions">
                      <button className="btn primary">Read Full Article</button>
                      <button className="btn outline">🔗 Share</button>
                    </div>
                  </div>

                  <div className="image">
                    <img src={post.image} alt={post.title} />
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="articles-grid">
          {filteredPosts
            .filter((post) => !post.featured)
            .map((post) => (
              <div key={post.id} className="article-card card">
                <div className="card-image">
                  <img src={post.image} alt={post.title} />
                  <div className="tags-overlay">
                    <div
                      className={`tag ${
                        post.category === "Study Tips"
                          ? "study-tips"
                          : post.category === "Academic Resources"
                          ? "resources"
                          : "guest"
                      }`}>
                      {post.category}
                    </div>
                    {post.difficulty && (
                      <div
                        className={`tag ${getDifficultyClass(
                          post.difficulty
                        )}`}>
                        {post.difficulty}
                      </div>
                    )}
                    {post.downloadable && (
                      <div className="tag downloadable">📥 Download</div>
                    )}
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>{post.title}</h3>
                    <button
                      className="bookmark-btn"
                      onClick={() => toggleBookmark(post.id)}>
                      {bookmarkedPosts.includes(post.id) ? "🔖" : "📌"}
                    </button>
                  </div>
                  <p className="excerpt">{post.excerpt}</p>
                  <div className="meta">
                    ✍️ {post.author}{" "}
                    {post.authorTitle && (
                      <span className="author-title">• {post.authorTitle}</span>
                    )}
                    <br />
                    📅 {post.date} • ⏱️ {post.readTime}
                  </div>
                  <div className="engagement">
                    👁️ {post.views} &nbsp; ❤️ {post.likes} &nbsp; 💬{" "}
                    {post.comments}
                  </div>
                  <div className="tags">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag-small">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <button className="btn primary small">Read More</button>
                    {post.downloadable && (
                      <button className="btn outline small">📥</button>
                    )}
                    <button className="btn outline small">🔗</button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-icon">🧠</div>
            <strong>{studyTips.length}</strong>
            <p>Study Tips</p>
          </div>
          <div className="stat-box">
            <div className="stat-icon">✍️</div>
            <strong>{guestArticles.length}</strong>
            <p>Guest Articles</p>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📚</div>
            <strong>{academicResources.length}</strong>
            <p>Academic Resources</p>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🔖</div>
            <strong>{bookmarkedPosts.length}</strong>
            <p>Bookmarked</p>
          </div>
        </div>
        {/* No results message */}
        {filteredPosts.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No articles found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </>
  );
}

export default BlogNewsTab;
