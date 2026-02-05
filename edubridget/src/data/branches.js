// Branch data with accurate East African coordinates
// This data separation allows easy updates without touching map logic

export const branches = [
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
    coordinates: {
      lat: -1.9536,
      lng: 30.0606
    }
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
    coordinates: {
      lat: 0.3136,
      lng: 32.5811
    }
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
    coordinates: {
      lat: -1.2864,
      lng: 36.8172
    }
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
    coordinates: {
      lat: -6.8160,
      lng: 39.2803
    }
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
    coordinates: {
      lat: -3.3614,
      lng: 29.3599
    }
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
    coordinates: {
      lat: 4.8517,
      lng: 31.5825
    }
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
    coordinates: {
      lat: 2.0469,
      lng: 45.3182
    }
  },
];

// East Africa region center (fallback when no branch selected)
export const EAST_AFRICA_CENTER = {
  lat: -1.9441,
  lng: 30.0619,
  zoom: 5
};
