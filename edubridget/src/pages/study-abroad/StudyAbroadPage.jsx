import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, DollarSign, Plane, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StudyAbroadPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const universities_d2 = [
    { name: 'TRƯỜNG ĐẠI HỌC YEWON ( D2 - D2-3)', code: 'D2', category: 'BEST', logo: '🏛️', country: 'South Korea' },
    { name: '동명대학교 (Tongmyong University)', code: 'D-2', category: 'NEW', logo: '🎓', country: 'South Korea' },
    { name: '서울여자대학교', code: 'D-2', category: 'NEW', logo: '🏫', country: 'South Korea' },
    { name: '충북보건과학대학교', code: 'D-2', category: 'NEW', logo: '🏥', country: 'South Korea' },
    { name: '경일대학교', code: 'D-2', category: 'NEW', logo: '🎯', country: 'South Korea' },
    { name: '경성대학교 KYUNGSANG UNIVERSITY', code: 'D-2', category: 'NEW', logo: '📚', country: 'South Korea' },
    { name: '가톨릭대대학교 CATHOLIC UNIVERSITY', code: 'D-2', category: 'NEW', logo: '⛪', country: 'South Korea' },
    { name: '서울신학대학교 Seoul Theological University', code: 'D-2', category: 'NEW', logo: '✝️', country: 'South Korea' },
  ];

  const universities_d4 = [
    { name: '동명대학교 (Tongmyong University)', code: 'D4-1', category: 'NEW', logo: '🎓', country: 'South Korea' },
    { name: '서울여자대학교 (Tongmyong University)', code: 'D4-1', category: 'NEW', logo: '🏫', country: 'South Korea' },
    { name: '충북보건과학대학교', code: 'D4-1', category: 'NEW', logo: '🏥', country: 'South Korea' },
    { name: '서울기독신학대학교 (STU)', code: 'D4-1', category: 'NEW', logo: '⛪', country: 'South Korea' },
    { name: '서울여자대학교', code: 'D4-1', category: 'NEW', logo: '🎯', country: 'South Korea' },
    { name: 'Truong dai hoc Paewon (D2)', code: 'D4-1', category: 'NEW', logo: '🏛️', country: 'South Korea' },
    { name: '대전대학교', code: 'D4-1', category: 'NEW', logo: '📚', country: 'South Korea' },
    { name: 'Korean Language Institute', code: 'D4-1', category: 'NEW', logo: '🗣️', country: 'South Korea' },
  ];

  const destinations = [
    {
      name: 'Australia',
      description: 'World-class education with work opportunities',
      tuition: '$20,000 - $45,000/year',
      living: '$18,000 - $24,000/year',
      features: ['Post-study work visa', 'High quality of life', 'Multicultural environment'],
      image: '🦘'
    },
    {
      name: 'United States',
      description: 'Top-ranked universities and research opportunities',
      tuition: '$25,000 - $55,000/year',
      living: '$15,000 - $25,000/year',
      features: ['Flexible education system', 'Diverse programs', 'Innovation hub'],
      image: '🗽'
    },
    {
      name: 'Canada',
      description: 'Affordable education with immigration pathways',
      tuition: '$15,000 - $35,000/year',
      living: '$12,000 - $18,000/year',
      features: ['Post-graduation work permit', 'Safe and welcoming', 'Quality education'],
      image: '🍁'
    },
    {
      name: 'Europe',
      description: 'Affordable/free education with cultural diversity',
      tuition: '€0 - €20,000/year',
      living: '€8,000 - €15,000/year',
      features: ['Many programs in English', 'Cultural experience', 'Travel opportunities'],
      image: '🏰'
    },
    {
      name: 'South Korea',
      description: 'Advanced technology with scholarship opportunities',
      tuition: '$3,000 - $10,000/year',
      living: '$8,000 - $12,000/year',
      features: ['KGSP scholarships', 'Tech industry', 'Dynamic culture'],
      image: '🇰🇷'
    },
    {
      name: 'Japan',
      description: 'Cutting-edge technology and traditional culture',
      tuition: '$5,000 - $12,000/year',
      living: '$10,000 - $15,000/year',
      features: ['MEXT scholarships', 'Advanced technology', 'Safe environment'],
      image: '🗾'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-primary-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Study Abroad Programs</h1>
          <p className="text-xl text-white/90">
            Your gateway to international education - self-sponsored and scholarship opportunities
          </p>
        </div>
      </div>

      {/* Available Universities Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="d2" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList className="bg-slate-100 p-1 rounded-lg">
                <TabsTrigger value="d2" className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Available Universities (D-2)
                </TabsTrigger>
                <TabsTrigger value="d4" className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Available Universities (D-4-1)
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(currentPage + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="d2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {universities_d2.map((university, index) => (
                  <div key={index} className="flex flex-col items-center group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center mb-3 text-4xl group-hover:border-primary transition-all shadow-sm group-hover:shadow-md">
                      {university.logo}
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-primary font-semibold mb-1">{university.code}</div>
                      <h3 className="font-medium text-xs text-slate-900 mb-2 line-clamp-3 px-2">
                        {university.name}
                      </h3>
                      <Badge variant="secondary" className="bg-secondary text-white hover:bg-secondary-dark text-xs">
                        {university.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="d4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {universities_d4.map((university, index) => (
                  <div key={index} className="flex flex-col items-center group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center mb-3 text-4xl group-hover:border-primary transition-all shadow-sm group-hover:shadow-md">
                      {university.logo}
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-primary font-semibold mb-1">{university.code}</div>
                      <h3 className="font-medium text-xs text-slate-900 mb-2 line-clamp-3 px-2">
                        {university.name}
                      </h3>
                      <Badge variant="secondary" className="bg-secondary text-white hover:bg-secondary-dark text-xs">
                        {university.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
            {destinations.map((destination, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-slate-200 bg-white">
                <CardContent className="p-6">
                  <div className="text-6xl text-center mb-4">{destination.image}</div>
                  <h3 className="text-2xl font-bold text-center mb-2 text-slate-900">{destination.name}</h3>
                  <p className="text-slate-600 text-center text-sm mb-4">{destination.description}</p>
                  
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
