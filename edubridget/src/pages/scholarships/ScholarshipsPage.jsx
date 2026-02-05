import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Calendar, DollarSign, Globe, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const scholarships = [
  {
    title: "Global Excellence Scholarship",
    amount: "Up to $10,000",
    deadline: "March 31, 2024",
    location: "Global",
    type: "Merit-based",
    description: "Awarded to high-achieving international students demonstrating academic excellence.",
    tags: ["Undergraduate", "Postgraduate"]
  },
  {
    title: "STEM Future Leaders",
    amount: "Full Tuition",
    deadline: "April 15, 2024",
    location: "USA, UK, Canada",
    type: "Subject-specific",
    description: "Supporting the next generation of leaders in Science, Technology, Engineering, and Math.",
    tags: ["Masters", "PhD", "research"]
  },
  {
    title: "Women in Tech Grant",
    amount: "$5,000",
    deadline: "May 1, 2024",
    location: "Europe",
    type: "Diversity",
    description: "Encouraging diversity in technology fields through financial support for female students.",
    tags: ["Undergraduate", "Computer Science"]
  },
  {
    title: "East Africa Merit Award",
    amount: "Partial Funding",
    deadline: "June 20, 2024",
    location: "East Africa",
    type: "Regional",
    description: "Specific opportunities for students from East African community member states.",
    tags: ["Any Degree"]
  },
  {
    title: "Research Innovation Fellowship",
    amount: "$15,000 + Stipend",
    deadline: "Rolling",
    location: "South Korea",
    type: "Research",
    description: "For advanced research projects in partnership with leading Korean universities.",
    tags: ["PhD", "Post-doc"]
  },
  {
    title: "Arts & Humanities Scholarship",
    amount: "$3,000",
    deadline: "July 1, 2024",
    location: "UK",
    type: "Arts",
    description: "Supporting creative minds in pursuing degrees in arts, humanities, and social sciences.",
    tags: ["Bachelor", "Master"]
  }
];

const ScholarshipsPage = () => {
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
                Scholarships & Financial Aid
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Find funding opportunities to support your educational journey abroad.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Info Stats */}
        <section className="py-8 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">$2M+</p>
                <p className="text-sm text-slate-500">Scholarships Awarded</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-slate-500">Students Funded</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-slate-500">Partner Institutions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-slate-500">Guidance Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Scholarships List */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
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
                          <span>Deadline: {scholarship.deadline}</span>
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
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
                <BookOpen className="mr-2 h-4 w-4" />
                View All Opportunities
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Need Help Finding a Scholarship?
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Our counselors can help you identify scholarships you are eligible for and guide you through the application process.
            </p>
            <Link to="/branches">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Contact a Counselor
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
