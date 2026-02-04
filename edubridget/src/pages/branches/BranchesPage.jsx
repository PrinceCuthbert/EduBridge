import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, User, ChevronRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const branches = [
  {
    country: "Rwanda",
    flag: "🇷🇼",
    isHeadOffice: true,
    city: "Kigali",
    address: "KG 123 St, Nyarugenge, Kigali",
    phone: "+250 788 123 456",
    email: "rwanda@edubridge.africa",
    manager: "Jean Paul Habimana",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM",
    services: ["All Services", "Visa Processing", "University Applications", "LMS Support"],
    image: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=600",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127611.38674309598!2d29.919006549999998!3d-1.9440726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xe9b1d4d3b1d4d3b1!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  },
  {
    country: "Uganda",
    flag: "🇺🇬",
    isHeadOffice: false,
    city: "Kampala",
    address: "Plot 15, Kampala Road, Kampala",
    phone: "+256 772 123 456",
    email: "uganda@edubridge.africa",
    manager: "Sarah Nakato",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    services: ["Student Consultation", "Visa Support", "Study Abroad"],
    image: "https://images.unsplash.com/photo-1596005554384-d293674c91d7?w=600",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19828364513!2d32.4506142!3d0.3475964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc0f9c3e8c7d%3A0x7c7d4f8f8f8f8f8f!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  },
  {
    country: "Kenya",
    flag: "🇰🇪",
    isHeadOffice: false,
    city: "Nairobi",
    address: "Kenyatta Avenue, Nairobi CBD",
    phone: "+254 722 123 456",
    email: "kenya@edubridge.africa",
    manager: "James Ochieng",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    services: ["Student Consultation", "Visa Support", "University Applications"],
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=600",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255345.61890706765!2d36.68218655!3d-1.2920659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  },
  {
    country: "Tanzania",
    flag: "🇹🇿",
    isHeadOffice: false,
    city: "Dar es Salaam",
    address: "Samora Avenue, Dar es Salaam",
    phone: "+255 754 123 456",
    email: "tanzania@edubridge.africa",
    manager: "Grace Mwakasege",
    hours: "Mon-Fri: 8:30 AM - 5:00 PM",
    services: ["Student Consultation", "Study Abroad", "Scholarship Guidance"],
    image: "https://images.unsplash.com/photo-1577977313238-c88c1ac4b9ed?w=600",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.7282358456!2d39.160344!3d-6.792354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b8b63d1c4f3%3A0x3e3e3e3e3e3e3e3e!2sDar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  },
  {
    country: "Burundi",
    flag: "🇧🇮",
    isHeadOffice: false,
    city: "Bujumbura",
    address: "Boulevard de l'Uprona, Bujumbura",
    phone: "+257 79 123 456",
    email: "burundi@edubridge.africa",
    manager: "Pierre Ndayisaba",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    services: ["Student Consultation", "Visa Support"],
    image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126933.15475284537!2d29.286778!3d-3.361378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c18303e6b6e4a1%3A0x58c5d7fb766b5e3e!2sBujumbura%2C%20Burundi!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  },
  {
    country: "South Sudan",
    flag: "🇸🇸",
    isHeadOffice: false,
    city: "Juba",
    address: "Ministries Road, Juba",
    phone: "+211 912 123 456",
    email: "southsudan@edubridge.africa",
    manager: "John Deng",
    hours: "Mon-Fri: 9:00 AM - 4:00 PM",
    services: ["Student Consultation", "Scholarship Guidance"],
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127420.45567567!2d31.58209!3d4.8594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1771ae9da47f24f7%3A0x17be6fa46ceb7972!2sJuba%2C%20South%20Sudan!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  },
  {
    country: "Somalia",
    flag: "🇸🇴",
    isHeadOffice: false,
    city: "Mogadishu",
    address: "Makka Al-Mukarama Road, Mogadishu",
    phone: "+252 61 123 456",
    email: "somalia@edubridge.africa",
    manager: "Fatima Hassan",
    hours: "Sat-Thu: 8:00 AM - 4:00 PM",
    services: ["Student Consultation", "Online Learning Support"],
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254098.50947266!2d45.318162!3d2.046934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d58425e2edb8573%3A0x6124a93e5f5f5f5f!2sMogadishu%2C%20Somalia!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  },
];

const BranchesPage = () => {
  // State to track selected branch for the map
  const [selectedBranch, setSelectedBranch] = useState(branches[0]); // Default to Rwanda (Head Office)

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero */}
        <section className="bg-primary-gradient py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Our Branches
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Visit any of our offices across East Africa for in-person consultation and support.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Find Us Map - Interactive Multi-Location */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-serif">
                Find Us
              </h2>
              <p className="text-slate-600">Visit any of our offices across East Africa</p>
            </div>

            {/* Branch Tabs */}
            <div className="max-w-5xl mx-auto mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {branches.map((branch) => (
                  <button
                    key={branch.country}
                    onClick={() => setSelectedBranch(branch)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedBranch.country === branch.country
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {branch.flag} {branch.city}
                    {branch.isHeadOffice && (
                      <Building2 className="inline-block h-4 w-4 ml-1 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Info Card */}
            <div className="max-w-5xl mx-auto mb-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    {selectedBranch.country} - {selectedBranch.city}
                  </h3>
                  <p className="text-slate-600 text-sm">{selectedBranch.address}</p>
                  <div className="flex gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {selectedBranch.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {selectedBranch.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Map */}
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
              <iframe
                key={selectedBranch.country} // Re-render when branch changes
                src={selectedBranch.mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
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
                        🏢 Head Office
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
                        Contact This Branch
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
              Can't Visit in Person?
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Book an online consultation and get the same expert guidance from anywhere.
            </p>
            <Link to="/visa-consultation">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
                Book Online Consultation
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BranchesPage;
