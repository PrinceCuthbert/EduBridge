import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const partners = [
  { name: 'University of Oxford', type: 'University', country: 'UK', logo: '🏛️' },
  { name: 'Stanford University', type: 'University', country: 'USA', logo: '🌲' },
  { name: 'University of Toronto', type: 'University', country: 'Canada', logo: '🍁' },
  { name: 'University of Melbourne', type: 'University', country: 'Australia', logo: '🦘' },
  { name: 'Seoul National University', type: 'University', country: 'South Korea', logo: '🇰🇷' },
  { name: 'British Council', type: 'Organization', country: 'Global', logo: '🌍' },
  { name: 'DAAD', type: 'Organization', country: 'Germany', logo: '🇩🇪' },
  { name: 'Fulbright', type: ' Scholarship', country: 'USA', logo: '🎓' },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-primary-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Partners</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Collaborating with world-class institutions to bring you the best opportunities.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-40 flex flex-col items-center justify-center hover:shadow-lg transition-shadow border-slate-200 cursor-pointer">
                  <div className="text-5xl mb-4 grayscale hover:grayscale-0 transition-all duration-300">
                    {partner.logo}
                  </div>
                  <h3 className="font-semibold text-center text-slate-800 px-4">{partner.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{partner.country}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
