import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Quote, X, MapPin } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    studentName: "Sarah Mitesio",
    university: "University of Toronto",
    country: "Canada",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop",
    testimony: "EduBridge made my dream of studying in Canada a reality. The visa process was smooth, and they guided me every step of the way.",
    program: "Computer Science"
  },
  {
    id: 2,
    studentName: "John Doe",
    university: "University of Melbourne",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop",
    testimony: "I never thought I could get a scholarship to study in Australia. The team at EduBridge helped me find the perfect opportunity.",
    program: "Business Administration"
  },
  {
    id: 3,
    studentName: "Emily Davis",
    university: "Seoul National University",
    country: "South Korea",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1449&auto=format&fit=crop",
    testimony: "Studying in Korea has been an amazing cultural experience. Thank you EduBridge for the support!",
    program: "International Relations"
  },
   {
    id: 4,
    studentName: "Michael Brown",
    university: "Technical University of Munich",
    country: "Germany",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop",
    testimony: "The guidance on German student visas was invaluable. I'm now pursuing my Masters in Engineering at a top university.",
    program: "Mechanical Engineering"
  },
  {
    id: 5,
    studentName: "Lisa Wang",
    university: "University of Manchester",
    country: "UK",
    image: "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=1470&auto=format&fit=crop",
    testimony: "From application to arrival, EduBridge was there. The pre-departure orientation really helped me prepare for life in the UK.",
    program: "Psychology"
  },
  {
    id: 6,
    studentName: "David Kim",
    university: "University of Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1590012314607-6da99daace58?q=80&w=1470&auto=format&fit=crop",
    testimony: "Highly recommend EduBridge for anyone looking to study in Asia. They have great connections and knowledge.",
    program: "Robotics"
  }
];

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-primary-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Success Stories</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            See where our students are studying and hear about their journey with EduBridge.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <Card className="overflow-hidden border-slate-200 hover:shadow-xl transition-shadow bg-white h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.studentName} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{item.studentName}</h3>
                        <p className="text-white/90 text-sm flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {item.university}, {item.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <div className="mb-4">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-2">
                        {item.program}
                      </Badge>
                      <p className="text-slate-600 italic line-clamp-3 text-sm">"{item.testimony}"</p>
                    </div>
                    <Button variant="link" className="mt-auto px-0 text-primary">
                      Read more
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-full relative">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.studentName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedItem.studentName}</h2>
                    <p className="text-primary font-medium text-lg mb-2">{selectedItem.university}</p>
                    <div className="flex items-center text-slate-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" /> {selectedItem.country}
                    </div>
                  </div>
                  
                  <div className="relative pl-8 mb-6">
                    <Quote className="absolute top-0 left-0 h-6 w-6 text-primary/20" />
                    <p className="text-slate-600 text-lg leading-relaxed italic">
                      {selectedItem.testimony}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Program</p>
                    <Badge variant="outline" className="text-base py-1 px-3 border-primary/20 bg-primary/5 text-primary">
                      {selectedItem.program}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
