import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_BLOGS as blogs } from '../../data/mockData';

const ITEMS_PER_PAGE = 6;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="text-white py-16" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Blog & News</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Latest updates, guides, and student stories to keep you informed.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentBlogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden border-slate-200 hover:shadow-lg transition-shadow bg-white flex flex-col group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none">
                      {blog.category}
                    </Badge>
                    <span className="text-slate-400 text-xs flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {blog.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {blog.excerpt}
                  </p>
                  <Link to={`/blogs/${blog.id}`}>
                    <Button variant="ghost" className="mt-auto px-0 text-primary hover:text-primary-dark hover:bg-transparent justify-start w-fit group/btn">
                      Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full w-10 h-10 border-slate-200 hover:bg-slate-100 hover:text-primary disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  className={`rounded-full w-10 h-10 font-medium transition-all ${
                    currentPage === page 
                      ? "bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20" 
                      : "border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-primary"
                  }`}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full w-10 h-10 border-slate-200 hover:bg-slate-100 hover:text-primary disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
