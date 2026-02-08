import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Search, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_LIBRARY_RESOURCES } from '@/data/mockData';

export default function DigitalLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'E-books', count: 2500, icon: <BookOpen className="h-6 w-6" /> },
    { name: 'Academic Journals', count: 1800, icon: <FileText className="h-6 w-6" /> },
    { name: 'Research Papers', count: 3200, icon: <FileText className="h-6 w-6" /> },
    { name: 'Thesis & Dissertations', count: 950, icon: <FileText className="h-6 w-6" /> },
    { name: 'Past Exam Papers', count: 5600, icon: <FileText className="h-6 w-6" /> },
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Digital Library</h1>
          <p className="text-xl text-white/90 mb-8">
            Access thousands of academic resources at your fingertips
          </p>
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for books, journals, papers..."
                className="pl-10 h-12 bg-white text-gray-900 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-slate-900">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-gradient rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-1 text-slate-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count.toLocaleString()} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-slate-900">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_LIBRARY_RESOURCES.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-slate-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 font-medium border-0">{resource.type}</Badge>
                    <Badge variant="outline" className="text-slate-600">{resource.category}</Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">{resource.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>Author: {resource.author}</p>
                    <p>Year: {resource.year} | Pages: {resource.pages}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        if (resource.link) window.open(resource.link, '_blank');
                        else if (resource.fileUrl) window.open(resource.fileUrl, '_blank');
                        else toast.info('Preview not available');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary hover:bg-primary-dark"
                      onClick={() => {
                         if (resource.link) window.open(resource.link, '_blank');
                         else if (resource.fileUrl) {
                            const link = document.createElement('a');
                            link.href = resource.fileUrl;
                            link.download = resource.title;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                         } else {
                            toast.info('Download not available');
                         }
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
