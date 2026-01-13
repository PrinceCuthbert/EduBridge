// Shared university data - Replace this with API calls in production
export const universities = [
  // East Africa
  {
    id: 1,
    name: "University of Rwanda",
    location: "Kigali",
    country: "Rwanda",
    region: "East Africa",
    faculties: ["Engineering", "Medicine", "Business", "Sciences", "Arts"],
    totalStudents: "32,000+",
    established: "2013",
  },
  {
    id: 2,
    name: "Makerere University",
    location: "Kampala",
    country: "Uganda",
    region: "East Africa",
    faculties: ["Medicine", "Engineering", "Law", "Arts", "Sciences"],
    totalStudents: "40,000+",
    established: "1922",
  },
  {
    id: 3,
    name: "University of Nairobi",
    location: "Nairobi",
    country: "Kenya",
    region: "East Africa",
    faculties: ["Medicine", "Engineering", "Business", "Law", "Agriculture"],
    totalStudents: "68,000+",
    established: "1970",
  },
  {
    id: 4,
    name: "University of Dar es Salaam",
    location: "Dar es Salaam",
    country: "Tanzania",
    region: "East Africa",
    faculties: ["Medicine", "Engineering", "Law", "Arts", "Sciences"],
    totalStudents: "40,000+",
    established: "1961",
  },

  // Korea
  {
    id: 5,
    name: "Seoul National University",
    location: "Seoul",
    country: "South Korea",
    region: "Korea",
    faculties: [
      "Engineering",
      "Medicine",
      "Liberal Arts",
      "Natural Sciences",
      "Business",
    ],
    totalStudents: "28,000+",
    established: "1946",
  },
  {
    id: 6,
    name: "KAIST",
    location: "Daejeon",
    country: "South Korea",
    region: "Korea",
    faculties: [
      "Engineering",
      "Natural Sciences",
      "Business",
      "Information Technology",
    ],
    totalStudents: "10,000+",
    established: "1971",
  },
  {
    id: 7,
    name: "Yonsei University",
    location: "Seoul",
    country: "South Korea",
    region: "Korea",
    faculties: [
      "Medicine",
      "Engineering",
      "Business",
      "Liberal Arts",
      "Dentistry",
    ],
    totalStudents: "38,000+",
    established: "1885",
  },
  {
    id: 8,
    name: "Korea University",
    location: "Seoul",
    country: "South Korea",
    region: "Korea",
    faculties: ["Law", "Business", "Engineering", "Liberal Arts", "Medicine"],
    totalStudents: "37,000+",
    established: "1905",
  },

  // Europe
  {
    id: 9,
    name: "University of Oxford",
    location: "Oxford",
    country: "United Kingdom",
    region: "Europe",
    faculties: ["Medicine", "Engineering", "Law", "Philosophy", "Mathematics"],
    totalStudents: "24,000+",
    established: "1096",
  },
  {
    id: 10,
    name: "ETH Zurich",
    location: "Zurich",
    country: "Switzerland",
    region: "Europe",
    faculties: [
      "Engineering",
      "Natural Sciences",
      "Mathematics",
      "Computer Science",
    ],
    totalStudents: "22,000+",
    established: "1855",
  },

  // North America
  {
    id: 11,
    name: "Harvard University",
    location: "Cambridge",
    country: "United States",
    region: "North America",
    faculties: ["Medicine", "Law", "Business", "Engineering", "Liberal Arts"],
    totalStudents: "23,000+",
    established: "1636",
  },
  {
    id: 12,
    name: "MIT",
    location: "Cambridge",
    country: "United States",
    region: "North America",
    faculties: [
      "Engineering",
      "Computer Science",
      "Economics",
      "Physics",
      "Mathematics",
    ],
    totalStudents: "11,000+",
    established: "1861",
  },

  // Asia Pacific
  {
    id: 13,
    name: "University of Tokyo",
    location: "Tokyo",
    country: "Japan",
    region: "Asia Pacific",
    faculties: ["Engineering", "Medicine", "Law", "Economics", "Sciences"],
    totalStudents: "28,000+",
    established: "1877",
  },
  {
    id: 14,
    name: "National University of Singapore",
    location: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    faculties: ["Engineering", "Medicine", "Business", "Law", "Computing"],
    totalStudents: "38,000+",
    established: "1905",
  },
];

// Helper function to find university by name (handles URL-encoded names)
export const findUniversityByName = (urlName) => {
  const decodedName = decodeURIComponent(urlName).replace(/-/g, ' ');
  return universities.find(
    (uni) => uni.name.toLowerCase() === decodedName.toLowerCase()
  );
};

// Helper function to get universities by region
export const getUniversitiesByRegion = (region) => {
  return universities.filter((uni) => uni.region === region);
};
