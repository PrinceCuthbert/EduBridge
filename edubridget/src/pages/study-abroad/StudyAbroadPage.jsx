import React, { useState, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Plane, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROGRAMS } from '../../data/mockData';

const DESTINATIONS = [
  {
    name: 'Australia',
    description: 'World-class education with work opportunities',
    tuition: '$20,000 - $45,000/year',
    living: '$18,000 - $24,000/year',
    features: ['Post-study work visa', 'High quality of life', 'Multicultural environment'],
    image: 'https://images.unsplash.com/photo-1540448051910-09cfadd5df61?auto=format&fit=crop&w=600&q=80' // Sydney Opera House
  },
  {
    name: 'United States',
    description: 'Top-ranked universities and research opportunities',
    tuition: '$25,000 - $55,000/year',
    living: '$15,000 - $25,000/year',
    features: ['Flexible education system', 'Diverse programs', 'Innovation hub'],
    image: 'https://images.unsplash.com/photo-1543783207-c13fad267277?q=80&w=1470&auto=format&fit=crop' // Statue of Liberty
  },
  {
    name: 'Canada',
    description: 'Affordable education with immigration pathways',
    tuition: '$15,000 - $35,000/year',
    living: '$12,000 - $18,000/year',
    features: ['Post-graduation work permit', 'Safe and welcoming', 'Quality education'],
    image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=600&q=80' // CN Tower
  },
  {
    name: 'Europe',
    description: 'Affordable/free education with cultural diversity',
    tuition: '€0 - €20,000/year',
    living: '€8,000 - €15,000/year',
    features: ['Many programs in English', 'Cultural experience', 'Travel opportunities'],
    image: 'https://images.unsplash.com/photo-1511739001486-9608275626ba?auto=format&fit=crop&w=600&q=80' // Eiffel Tower
  },
  {
    name: 'South Korea',
    description: 'Advanced technology with scholarship opportunities',
    tuition: '$3,000 - $10,000/year',
    living: '$8,000 - $12,000/year',
    features: ['KGSP scholarships', 'Tech industry', 'Dynamic culture'],
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80' // Gyeongbokgung Palace
  },
  {
    name: 'Japan',
    description: 'Cutting-edge technology and traditional culture',
    tuition: '$5,000 - $12,000/year',
    living: '$10,000 - $15,000/year',
    features: ['MEXT scholarships', 'Advanced technology', 'Safe environment'],
    image: 'https://images.unsplash.com/photo-1490806843928-2666d632c318?auto=format&fit=crop&w=600&q=80' // Mt Fuji
  },
];

const LOADING_PROP = "lazy";

const UniversityCard = React.memo(({ university }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/study-abroad/${university.id}`)}
      className="flex-shrink-0 w-48 flex flex-col items-center group cursor-pointer p-2"
    >
      <div className="w-24 h-24 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-4 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all">
         <img 
          src={university.logo || `https://ui-avatars.com/api/?name=${university.visaType}&background=random&color=fff&size=128&font-size=0.33`} 
          alt={university.universityName} 
          loading={LOADING_PROP}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center w-full">
        <div className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wider">{university.visaType}</div>
        <h3 className="font-bold text-xs text-slate-900 mb-2 line-clamp-2 min-h-[32px] px-1 leading-tight">
          {university.universityName}
        </h3>
        
        <div className="flex flex-col gap-1 items-center mt-1">
           {university.tags?.map((tag, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className={`
                  text-[10px] px-2 py-0.5 h-5
                  ${tag === 'BEST' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
                  ${tag === 'NEW' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
                  ${tag === 'ON SALE' ? 'bg-rose-500 text-white hover:bg-rose-600' : ''}
                `}
              >
                {tag}
              </Badge>
           ))}
        </div>
      </div>
    </div>
  );
});

const UniversitySection = React.memo(({ title, visaType, universities, subtitle }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-12">
       <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {title} 
            <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200 font-semibold">{visaType}</span>
          </h2>
       </div>
       <p className="text-sm text-slate-500 mb-6">{subtitle}</p>

       <div className="relative group/section">
          {/* Scroll Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all opacity-0 group-hover/section:opacity-100 disabled:opacity-0"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all opacity-0 group-hover/section:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>

          {/* List */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {universities.map((uni, i) => (
              <UniversityCard key={i} university={uni} />
            ))}
          </div>
       </div>
    </div>
  );
});

export default function StudyAbroadPage() {
  const d2Programs = useMemo(() => MOCK_PROGRAMS.filter(p => p.visaType === 'D-2'), []);
  const d4Programs = useMemo(() => MOCK_PROGRAMS.filter(p => p.visaType === 'D-4'), []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="text-white py-16" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Study Abroad Programs</h1>
          <p className="text-xl text-white/90">
            Your gateway to international education - self-sponsored and scholarship opportunities
          </p>
        </div>
      </div>

      {/* Available Universities Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <UniversitySection 
            title="D-2" 
            visaType="VISA" 
            subtitle="Available Universities (Degree Program)" 
            universities={d2Programs} 
          />
          
          <div className="w-full h-px bg-slate-100 my-8"></div>

          <UniversitySection 
            title="D-4" 
            visaType="VISA" 
            subtitle="List of Universities Offering Korean & English Programs" 
            universities={d4Programs} 
          />

        </div>
      </section>

      {/* Study Destinations */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Popular Study Destinations</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explore top countries for international students with detailed cost estimates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DESTINATIONS.map((destination, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-slate-200 bg-white overflow-hidden group">
                <div className="h-48 overflow-hidden relative">
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                   <img 
                      src={destination.image} 
                      alt={destination.name} 
                      loading={LOADING_PROP}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                   />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">{destination.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{destination.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Tuition Fees</div>
                        <div className="text-sm text-slate-600">{destination.tuition}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Living Costs</div>
                        <div className="text-sm text-slate-600">{destination.living}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-slate-900">Key Features:</h4>
                    <ul className="space-y-1">
                      {destination.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary-dark">
                    <Plane className="mr-2 h-4 w-4" /> Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Application Process</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We guide you through every step of your study abroad journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Consultation', desc: 'Free consultation to understand your goals' },
              { step: '2', title: 'University Search', desc: 'Find the best match for your profile' },
              { step: '3', title: 'Application', desc: 'Complete application support and document preparation' },
              { step: '4', title: 'Visa & Travel', desc: 'Visa guidance and pre-departure orientation' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
