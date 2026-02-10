import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Calendar, DollarSign, Globe, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "@/config/api";
import { useTranslation } from "react-i18next";

import AnimatedCounter from "@/components/AnimatedCounter";

const ScholarshipsPage = () => {
  const { t } = useTranslation();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/scholarships`);
        if (!res.ok) throw new Error("Failed to load scholarships");
        const data = await res.json();
        setScholarships(data);
      } catch (error) {
        console.error("Error loading scholarships:", error);
        toast.error("Failed to load scholarships");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero */}
        <section className="py-16 md:py-20" style={{ backgroundColor: '#1e3a8a' }}>
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {t('scholarships_page.hero_title')}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                {t('scholarships_page.hero_subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Info Stats */}
        <section className="py-8 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
              
                  <AnimatedCounter end={200} suffix="+"/>
                <p className="text-sm text-slate-500">{t('scholarships_page.stats.awarded')}</p>
              </div>
              <div>
                <AnimatedCounter end={20} suffix="+"/>
                <p className="text-sm text-slate-500">{t('scholarships_page.stats.students_funded')}</p>
              </div>
              <div>
                <AnimatedCounter end={10} suffix="+"/>
                <p className="text-sm text-slate-500">{t('scholarships_page.stats.partners')}</p>
              </div>
              <div>
                <AnimatedCounter end={100} suffix="%"/>
                <p className="text-sm text-slate-500">{t('scholarships_page.stats.guidance')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Scholarships List */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            {loading ? (
                <div className="flex justify-center p-12">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                   <span className="sr-only">{t('scholarships_page.loading')}</span>
                </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-slate-200 shadow-sm hover:shadow-lg transition-all bg-white flex flex-col">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {scholarship.type}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-slate-900 mb-2">
                        {scholarship.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 flex-grow">
                        {scholarship.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-700">{scholarship.amount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Globe className="h-4 w-4 text-primary" />
                          <span>{scholarship.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{t('scholarships_page.deadline_prefix')}{scholarship.deadline}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {scholarship.tags.map(tag => (
                          <span key={tag} className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button variant="outline" className="w-full mt-auto border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
                        {t('scholarships_page.view_details')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            )}
            
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
                <BookOpen className="mr-2 h-4 w-4" />
                {t('scholarships_page.view_all')}
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t('scholarships_page.cta_title')}
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              {t('scholarships_page.cta_desc')}
            </p>
            <Link to="/branches">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                {t('scholarships_page.cta_button')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ScholarshipsPage;
