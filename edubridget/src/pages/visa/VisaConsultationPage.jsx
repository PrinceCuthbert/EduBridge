import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCheck, MapPin, CheckCircle, Phone, Mail } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const services = [
  {
    title: "Student Visa Consultation",
    price: "$50",
    duration: "45 min",
    features: ["Visa eligibility assessment", "Document checklist", "Application review", "Interview prep tips"],
  },
  {
    title: "Full Application Support",
    price: "$200",
    duration: "Full support",
    features: ["Complete document preparation", "Application submission", "Embassy coordination", "Visa interview coaching"],
  },
  {
    title: "Premium Package",
    price: "$350",
    duration: "End-to-end",
    features: ["Everything in Full Support", "University application help", "Scholarship assistance", "Pre-departure orientation"],
  },
];

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Japan", "South Korea", "Netherlands", "Other"
];

const VisaConsultationPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    destination: "",
    service: "",
    message: "",
    preferredDate: "",
    consultationType: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button[type="submit"]');
    if (button) button.disabled = true;

    // Simulate network delay
    setTimeout(() => {
      console.log("Form submitted:", formData);
      toast.success("Thank you! We'll contact you within 24 hours to confirm your appointment.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        destination: "",
        service: "",
        message: "",
        preferredDate: "",
        consultationType: "",
      });
      if (button) button.disabled = false;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero */}
        <section className="py-16 md:py-20" style={{ backgroundColor: '#1e3a8a' }}>
          <div className="container mx-auto px-4 md:px-8">
            <div
              data-aos="fade-up"
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Visa & Migration Consultation
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Expert guidance for student visas, work permits, and migration. 95% visa success rate.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">95%</p>
                <p className="text-sm text-slate-500">Visa Success Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">2,500+</p>
                <p className="text-sm text-slate-500">Visas Processed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">25+</p>
                <p className="text-sm text-slate-500">Countries Covered</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">10+</p>
                <p className="text-sm text-slate-500">Years Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div
              data-aos="fade-up"
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Our Services
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Card className={`h-full border-slate-200 shadow-sm transition-all hover:shadow-md bg-white ${index === 1 ? "border-primary ring-1 ring-primary/20" : ""}`}>
                    {index === 1 && (
                      <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl text-slate-900 mb-2">
                        {service.title}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-primary">{service.price}</span>
                        <span className="text-slate-500">/ {service.duration}</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={index === 1 ? "w-full bg-primary hover:bg-primary-dark" : "w-full"} 
                        variant={index === 1 ? "default" : "outline"}
                      >
                        Select Package
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div
               data-aos="fade-right"
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Book a Consultation
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Your Country *</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, country: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rwanda">Rwanda</SelectItem>
                          <SelectItem value="uganda">Uganda</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="tanzania">Tanzania</SelectItem>
                          <SelectItem value="burundi">Burundi</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination Country *</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, destination: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c} value={c.toLowerCase().replace(" ", "-")}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationType">Consultation Type *</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, consultationType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online (Video Call)</SelectItem>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date & Time</Label>
                    <Input
                      id="preferredDate"
                      type="datetime-local"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your situation and goals..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-dark">
                    Book Appointment
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div
                data-aos="fade-left"
                className="space-y-6"
              >
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-900">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <p className="font-medium text-slate-900">+250 788 123 456</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-medium text-slate-900">visa@edubridge.africa</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Office</p>
                          <p className="font-medium text-slate-900">Kigali, Rwanda (Head Office)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-900">Required Documents Checklist</h3>
                    <ul className="space-y-3">
                      {[
                        "Valid Passport (6+ months validity)",
                        "Academic Transcripts & Certificates",
                        "Proof of English Proficiency (IELTS/TOEFL)",
                        "Bank Statements (3-6 months)",
                        "Admission Letter from University",
                        "Passport-sized Photographs",
                        "Statement of Purpose",
                        "Recommendation Letters",
                      ].map((doc) => (
                        <li key={doc} className="flex items-center gap-2 text-sm text-slate-600">
                          <FileCheck className="h-4 w-4 text-emerald-500" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VisaConsultationPage;
