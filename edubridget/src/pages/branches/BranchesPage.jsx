import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, User, ChevronRight } from "lucide-react";
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
  },
];

const BranchesPage = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our Branches
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Visit any of our offices across East Africa for in-person consultation and support.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Map Placeholder */}
        {/* Find Us Map */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-serif">
                Find Us
              </h2>
              <p className="text-slate-600">Visit our headquarters in Kigali, Rwanda</p>
            </div>

            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5160815956!2d30.058480315!3d-1.9440726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xe9b1d4d3b1d4d3b1!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
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
