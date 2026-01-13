import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLightbulb,
  faPenNib,
  faBook,
  faEye,
  faHeart,
  faComment,
  faBookmark,
  faShare,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { studyTips, guestArticles, academicResources,localNews } from "../../data/blogData.js";

function BlogAndNewsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Simulate async data loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const allBlogPosts = [...studyTips, ...guestArticles, ...academicResources,...localNews];

  // Filter posts
  const filteredPosts = allBlogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const featuredPost = filteredPosts.find((post) => post.featured);
  const regularPosts = currentPosts.filter((post) => !post.featured);

  const categories = [
    { id: "All", label: "All", icon: faSearch },
    { id: "Study Tips", label: "Study Tips", icon: faLightbulb },
    { id: "Guest Articles", label: "Guest Articles", icon: faPenNib },
    { id: "Academic Resources", label: "Academic Resources", icon: faBook },
    // { id: "Local News", label: "Local News", icon: faBook }
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Blog & Educational News
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Stay updated with the latest education trends, study tips, and expert insights.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="mb-12">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search articles, tips, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary/30 hover:bg-slate-50"
                }`}
              >
                <FontAwesomeIcon icon={category.icon} className="text-sm" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-8">
          {/* Featured skeleton */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-slate-200 rounded-lg w-32"></div>
                <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
                <div className="h-4 bg-slate-200 rounded-lg w-2/3"></div>
              </div>
              <div className="w-full md:w-96 h-64 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>

          {/* Grid skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-100 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-t-[2rem]"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
                  <div className="h-4 bg-slate-200 rounded-lg w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featuredPost && currentPage === 1 && (
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 mb-12">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Text Content */}
                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                    ⭐ Featured Article
                  </span>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-serif">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                    <span className="font-medium text-slate-700">{featuredPost.author}</span>
                    {featuredPost.authorTitle && (
                      <>
                        <span>•</span>
                        <span>{featuredPost.authorTitle}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEye} />
                      {featuredPost.views}
                    </span>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faHeart} />
                      {featuredPost.likes}
                    </span>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faComment} />
                      {featuredPost.comments}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-primary text-white hover:bg-primary-dark font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
                      Read Full Article
                    </button>
                    <button className="px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl transition-all flex items-center gap-2">
                      <FontAwesomeIcon icon={faShare} />
                      Share
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="w-full md:w-96 h-64 md:h-auto rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000"
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {regularPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-[2rem] border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col overflow-hidden"
              >
                {/* Image with Overlays */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${
                      post.id % 3 === 0 
                        ? "1454165833767-027469550d8b" 
                        : post.id % 3 === 1 
                        ? "1522202176988-66273c2fd55f" 
                        : "1516321318423-f06f85e504b3"
                    }?auto=format&fit=crop&q=80&w=1000`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Badge - Top Left */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-lg ${
                      post.category === "Study Tips"
                        ? "bg-blue-500 text-white"
                        : post.category === "Guest Articles"
                        ? "bg-purple-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Difficulty Badge - Top Right */}
                  {post.difficulty && (
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-lg ${
                        post.difficulty === "Beginner"
                          ? "bg-green-500 text-white"
                          : post.difficulty === "Intermediate"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      }`}>
                        {post.difficulty}
                      </span>
                    </div>
                  )}

                  {/* Downloadable Badge - Bottom Right */}
                  {post.downloadable && (
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Downloadable
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="text-xs text-slate-500 mb-4">
                    <div className="font-medium text-slate-700 mb-1">{post.author}</div>
                    <div className="flex items-center gap-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faEye} />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faHeart} />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faComment} />
                      {post.comments}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full px-4 py-2 bg-primary/5 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all border border-primary/20">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  currentPage === 1
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary"
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === pageNumber
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  currentPage === totalPages
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary"
                }`}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faLightbulb} className="text-2xl text-blue-600" />
              </div>
              <p className="text-3xl font-extrabold text-blue-600 mb-1">{studyTips.length}</p>
              <p className="text-sm font-medium text-slate-600">Study Tips</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faPenNib} className="text-2xl text-purple-600" />
              </div>
              <p className="text-3xl font-extrabold text-purple-600 mb-1">{guestArticles.length}</p>
              <p className="text-sm font-medium text-slate-600">Guest Articles</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faBook} className="text-2xl text-orange-600" />
              </div>
              <p className="text-3xl font-extrabold text-orange-600 mb-1">{academicResources.length}</p>
              <p className="text-sm font-medium text-slate-600">Academic Resources</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faBookmark} className="text-2xl text-slate-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-600 mb-1">0</p>
              <p className="text-sm font-medium text-slate-600">Bookmarked</p>
            </div>
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faSearch} className="text-4xl text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
              <p className="text-slate-600">Try adjusting your search terms or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BlogAndNewsTab;
