import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, User, ChevronRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import { branches } from "@/data/branches";
import { useTranslation } from "react-i18next";

const BranchesPage = () => {
  const { t } = useTranslation();
  // State to track selected branch for the map
  const [selectedBranch, setSelectedBranch] = useState(branches[0]); // Default to Rwanda (Head Office)

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
                {t('branches_page.hero_title')}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                {t('branches_page.hero_subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Find Us Map - Interactive Multi-Location */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-serif">
                {t('branches_page.find_us.title')}
              </h2>
              <p className="text-slate-600">{t('branches_page.find_us.subtitle')}</p>
            </div>

            {/* Branch Tabs */}
            <div className="max-w-5xl mx-auto mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {branches.map((branch) => (
                  <button
                    key={branch.country}
                    onClick={() => setSelectedBranch(branch)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedBranch.country === branch.country
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {branch.flag} {branch.city}
                    {branch.isHeadOffice && (
                      <Building2 className="inline-block h-4 w-4 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Info Card */}
            <div className="max-w-5xl mx-auto mb-6 bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 rounded-2xl border border-slate-200 shadow-soft">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-1">
                    {selectedBranch.country} - {selectedBranch.city}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">{selectedBranch.address}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-primary" />
                      {selectedBranch.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-primary" />
                      {selectedBranch.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {selectedBranch.hours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Leaflet Map - Landscape on mobile */}
            <div className="max-w-5xl mx-auto">
              <InteractiveMap 
                branches={branches}
                selectedBranch={selectedBranch}
                onMarkerClick={setSelectedBranch}
                className="h-[400px] md:h-[500px] lg:h-[550px]"
              />
            </div>
          </div>
        </section>

        {/* Branches Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.country}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-shadow bg-white ${branch.isHeadOffice ? "border-primary ring-1 ring-primary/20" : ""}`}>
                    {branch.isHeadOffice && (
                      <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                        🏢 {t('branches_page.head_office_badge')}
                      </div>
                    )}
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${branch.image})` }}
                    />
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{branch.flag}</span>
                        <h3 className="font-bold text-lg text-slate-900">
                          {branch.country}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <p className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          {branch.address}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                          {branch.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                          {branch.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
                          {branch.hours}
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4 flex-shrink-0 text-primary" />
                          {branch.manager}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {branch.services.slice(0, 3).map((service) => (
                          <span key={service} className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                            {service}
                          </span>
                        ))}
                      </div>

                      <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 hover:text-primary" size="sm">
                        {t('branches_page.contact_branch_button')}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t('branches_page.cta.title')}
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              {t('branches_page.cta.description')}
            </p>
            <Link to="/visa-consultation">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
                {t('branches_page.cta.button')}
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BranchesPage;
