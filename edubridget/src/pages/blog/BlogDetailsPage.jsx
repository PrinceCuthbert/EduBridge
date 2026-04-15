import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Loader2,
} from "lucide-react";
import { useBlogs } from "../../hooks/useBlogs";
import DOMPurify from "dompurify";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  const { data: blogs = [], isLoading } = useBlogs();

  useEffect(() => {
    // Firestore ids are strings
    const foundBlog = blogs.find((b) => b.id === id);
    if (foundBlog) {
      setBlog(foundBlog);
    } else if (!isLoading && blogs.length > 0) {
      navigate("/blogs");
    }
    // Scroll to top when loading a new blog
    window.scrollTo(0, 0);
  }, [id, navigate, blogs, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Loading article...</p>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Blog Header / Hero */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <Link to="/blogs">
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 mb-6 pl-0"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>

            <Badge className="bg-primary text-white hover:bg-primary-dark border-none mb-4 w-fit">
              {blog.category}
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-4xl leading-tight font-serif">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <span className="flex items-center">
                <User className="mr-2 h-4 w-4 text-primary" /> {blog.author}
              </span>
              <span className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" /> {blog.date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Article Content */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200">
            {/* Render HTML content safely - in a real app, sanitize this! */}
            <div
              className="prose prose-lg prose-slate max-w-none 
                prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 
                prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  blog.content ||
                    `<p>${blog.excerpt}</p><p>More content would go here...</p>`,
                ),
              }}
            />

            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
              <div className="text-slate-500 text-sm">
                Tagged:{" "}
                <span className="text-slate-900 font-medium">
                  {blog.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
