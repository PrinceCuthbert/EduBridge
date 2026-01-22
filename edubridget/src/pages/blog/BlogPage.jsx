import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogs = [
  {
    id: 1,
    title: "10 Tips for a Successful Visa Interview",
    category: "Visa Guide",
    date: "Jan 15, 2024",
    author: "Visa Team",
    excerpt: "Preparing for your student visa interview? Here are the top 10 tips to ensure you make a great impression and secure your visa.",
    image: "https://images.unsplash.com/photo-1576267423445-807c4d3d8551?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    title: "Top 5 Scholarships for African Students in 2024",
    category: "Scholarships",
    date: "Jan 10, 2024",
    author: "Scholarship Desk",
    excerpt: "Discover the most prestigious and fully funded scholarships available for African students looking to study abroad this year.",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    title: "Life in South Korea: A Student's Perspective",
    category: "Student Life",
    date: "Jan 05, 2024",
    author: "Sarah M.",
    excerpt: "Sarah shares her experience of adapting to Korean culture, food, and university life as an international student.",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&auto=format&fit=crop&q=60"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-primary-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog & News</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Latest updates, guides, and student stories to keep you informed.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden border-slate-200 hover:shadow-lg transition-shadow bg-white flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                      {blog.category}
                    </Badge>
                    <span className="text-slate-400 text-xs flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {blog.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <Button variant="ghost" className="mt-auto px-0 text-primary hover:text-primary-dark hover:bg-transparent justify-start w-fit">
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
