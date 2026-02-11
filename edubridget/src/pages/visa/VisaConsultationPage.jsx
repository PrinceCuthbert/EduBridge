import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DateTimePicker from "@/components/ui/DateTimePicker";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileCheck, MapPin, CheckCircle, Phone, Mail } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const VisaConsultationPage = () => {
  const { t } = useTranslation();

  // Move services inside component to use t()
  const services = [
    {
      title: t("visa_page.services_list.consultation.title"),
      price: "$50",
      duration: t("visa_page.services_list.consultation.duration"),
      features:
        t("visa_page.services_list.consultation.features", {
          returnObjects: true,
        }) || [],
    },
    {
      title: t("visa_page.services_list.full_support.title"),
      price: "$200",
      duration: t("visa_page.services_list.full_support.duration"),
      features:
        t("visa_page.services_list.full_support.features", {
          returnObjects: true,
        }) || [],
    },
    {
      title: t("visa_page.services_list.premium.title"),
      price: "$350",
      duration: t("visa_page.services_list.premium.duration"),
      features:
        t("visa_page.services_list.premium.features", {
          returnObjects: true,
        }) || [],
    },
  ];

  const destinationCountries = [
    "Australia",
    "United States",
    "Canada",
    "Europe",
    "South Korea",
    "Japan",
  ];

  const countries = [
    "Rwanda",
    "Uganda",
    "Kenya",
    "Tanzania",
    "Burundi",
    "Other",
  ];

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
      // TODO: Send formData to backend API
      // await consultationAPI.submit(formData);

      if (import.meta.env.DEV) {
        console.log("📝 Visa consultation form submitted:", {
          service: formData.service,
          destination: formData.destination,
          consultationType: formData.consultationType,
          // PII excluded from logs
        });
      }

      toast.success(
        "Thank you! We'll contact you within 24 hours to confirm your appointment.",
      );
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
        <section
          className="py-16 md:py-20"
          style={{ backgroundColor: "#1e3a8a" }}>
          <div className="container mx-auto px-4 md:px-8">
            <div data-aos="fade-up" className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {t("visa_page.hero_title")}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                {t("visa_page.hero_subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={95} duration={2000} suffix="%" />
                </p>
                <p className="text-sm text-slate-500">
                  {t("visa_page.stats.success_rate")}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={2500} duration={2000} suffix="+" />
                </p>
                <p className="text-sm text-slate-500">
                  {t("visa_page.stats.processed")}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={25} duration={2000} suffix="+" />
                </p>
                <p className="text-sm text-slate-500">
                  {t("visa_page.stats.countries")}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={10} duration={2000} suffix="+" />
                </p>
                <p className="text-sm text-slate-500">
                  {t("visa_page.stats.experience")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div data-aos="fade-up" className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {t("visa_page.services.title")}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}>
                  <Card
                    className={`h-full border-slate-200 shadow-sm transition-all hover:shadow-md bg-white ${index === 1 ? "border-primary ring-1 ring-primary/20" : ""}`}>
                    {index === 1 && (
                      <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                        {t("visa_page.services.most_popular")}
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl text-slate-900 mb-2">
                        {service.title}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-primary">
                          {service.price}
                        </span>
                        <span className="text-slate-500">
                          / {service.duration}
                        </span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={
                          index === 1
                            ? "w-full bg-primary hover:bg-primary-dark"
                            : "w-full"
                        }
                        variant={index === 1 ? "default" : "outline"}>
                        {t("visa_page.services.select_package")}
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
              <div data-aos="fade-right">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  {t("visa_page.booking.title")}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {t("visa_page.booking.labels.name")} *
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t("visa_page.booking.labels.email")} *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t("visa_page.booking.labels.phone")} *
                      </Label>
                      <Input
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">
                        {t("visa_page.booking.labels.country")} *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, country: value })
                        }>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "visa_page.booking.placeholders.select_country",
                            )}
                          />
                        </SelectTrigger>

                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem
                              key={c}
                              value={c.toLowerCase().replace(" ", "-")}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="destination">
                        {t("visa_page.booking.labels.destination")} *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, destination: value })
                        }>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "visa_page.booking.placeholders.select_destination",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {destinationCountries.map((c) => (
                            <SelectItem
                              key={c}
                              value={c.toLowerCase().replace(" ", "-")}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationType">
                        {t("visa_page.booking.labels.type")} *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, consultationType: value })
                        }>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "visa_page.booking.placeholders.select_type",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">
                            {t("visa_page.booking.types.online")}
                          </SelectItem>
                          <SelectItem value="in-person">
                            {t("visa_page.booking.types.in_person")}
                          </SelectItem>
                          <SelectItem value="phone">
                            {t("visa_page.booking.types.phone")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">
                      {t("visa_page.booking.labels.date")}
                    </Label>
                    <DateTimePicker
                      value={formData.preferredDate}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          preferredDate: value,
                        })
                      }
                      placeholder={t("visa_page.booking.placeholders.date")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t("visa_page.booking.labels.message")}
                    </Label>
                    <Textarea
                      id="message"
                      placeholder={t("visa_page.booking.placeholders.message")}
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary-dark">
                    {t("visa_page.booking.submit_button")}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div data-aos="fade-left" className="space-y-6">
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-900">
                      {t("visa_page.contact_info.title")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">
                            {t("visa_page.contact_info.phone")}
                          </p>
                          <p className="font-medium text-slate-900">
                            +250 788 123 456
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">
                            {t("visa_page.contact_info.email")}
                          </p>
                          <p className="font-medium text-slate-900">
                            visa@edubridge.africa
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">
                            {t("visa_page.contact_info.office")}
                          </p>
                          <p className="font-medium text-slate-900">
                            Kigali, Rwanda (Head Office)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-900">
                      {t("visa_page.contact_info.checklist_title")}
                    </h3>
                    <ul className="space-y-3">
                      {(
                        t("visa_page.contact_info.checklist", {
                          returnObjects: true,
                        }) || []
                      ).map((doc) => (
                        <li
                          key={doc}
                          className="flex items-center gap-2 text-sm text-slate-600">
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
