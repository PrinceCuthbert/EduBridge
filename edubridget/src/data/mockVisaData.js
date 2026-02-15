// Mock data for visa consultation requests
// In production, this would come from an API filtered by the current user

// Simulated current logged-in user
export const CURRENT_USER_ID = "user_123";

// Mock consultations database (contains data for multiple users)
export const MOCK_CONSULTATIONS = [
  // Current user's consultations
  {
    id: "case_001",
    userId: "user_123",
    destination: "Canada",
    countryCode: "CA",
    visaType: "Study Visa",
    dateBooked: "2024-02-15",
    meetingType: "Online",
    fee: "$150",
    status: "In Progress",
    appointmentTime: "10:00 AM PST",
    duration: "45 Minutes",
    createdAt: "2024-02-01",
    // Documents for this case
    documents: [
      { 
        id: "doc_001",
        name: "Passport Scan.pdf", 
        status: "Verified", 
        date: "2024-01-10", 
        size: "2.4 MB",
        url: "#" 
      },
      { 
        id: "doc_002",
        name: "Admission Letter.pdf", 
        status: "Verified", 
        date: "2024-01-12", 
        size: "1.1 MB",
        url: "#" 
      },
      { 
        id: "doc_003",
        name: "Bank Statement.pdf", 
        status: "Received", 
        date: "2024-01-15", 
        size: "3.5 MB",
        url: "#" 
      },
      { 
        id: "doc_004",
        name: "Medical Report.pdf", 
        status: "Pending", 
        date: "-", 
        size: "-",
        url: "#" 
      },
    ],
    // Admin feedback for this case
    adminFeedback: [
      {
        id: "fb_001",
        message: 'Your bank statements are clear, but we need a higher-resolution scan of your passport. Please upload a new scan at your earliest convenience.',
        timestamp: '2024-02-12T14:30:00',
        status: 'Action Required'
      },
      {
        id: "fb_002",
        message: 'All documents have been verified. Your consultation is scheduled for February 15th at 10:00 AM PST via video call.',
        timestamp: '2024-02-10T09:15:00',
        status: 'Informational'
      },
    ]
  },
  {
    id: "case_002",
    userId: "user_123",
    destination: "UK",
    countryCode: "GB",
    visaType: "Work Visa",
    dateBooked: "2024-02-18",
    meetingType: "In-Person",
    fee: "$200",
    status: "Approved",
    appointmentTime: "2:00 PM EST",
    duration: "60 Minutes",
    createdAt: "2024-01-25",
    documents: [
      { 
        id: "doc_005",
        name: "Passport Copy.pdf", 
        status: "Verified", 
        date: "2024-01-20", 
        size: "2.1 MB",
        url: "#" 
      },
      { 
        id: "doc_006",
        name: "Job Offer Letter.pdf", 
        status: "Verified", 
        date: "2024-01-22", 
        size: "980 KB",
        url: "#" 
      },
      { 
        id: "doc_007",
        name: "Police Clearance.pdf", 
        status: "Verified", 
        date: "2024-01-24", 
        size: "1.5 MB",
        url: "#" 
      },
    ],
    adminFeedback: [
      {
        id: "fb_003",
        message: 'Congratulations! Your work visa application has been approved. You will receive the official documents via email within 3-5 business days.',
        timestamp: '2024-02-16T11:20:00',
        status: 'Informational'
      },
    ]
  },
  {
    id: "case_003",
    userId: "user_123",
    destination: "USA",
    countryCode: "US",
    visaType: "General Visit",
    dateBooked: "2024-02-20",
    meetingType: "Online",
    fee: "$100",
    status: "Pending Documents",
    appointmentTime: "3:00 PM PST",
    duration: "30 Minutes",
    createdAt: "2024-02-05",
    documents: [
      { 
        id: "doc_008",
        name: "Passport.pdf", 
        status: "Received", 
        date: "2024-02-06", 
        size: "2.8 MB",
        url: "#" 
      },
    ],
    adminFeedback: [
      {
        id: "fb_004",
        message: 'We have received your passport copy. Please also submit your bank statement and travel itinerary to proceed.',
        timestamp: '2024-02-08T10:15:00',
        status: 'Action Required'
      },
    ]
  },
  
  // Other users' consultations (should NOT appear in the current user's dashboard)
  {
    id: "case_004",
    userId: "user_456",
    destination: "Australia",
    countryCode: "AU",
    visaType: "Student Visa",
    dateBooked: "2024-02-22",
    meetingType: "Online",
    fee: "$175",
    status: "New",
    appointmentTime: "11:00 AM AEDT",
    duration: "45 Minutes",
    createdAt: "2024-02-10",
    documents: [],
    adminFeedback: []
  },
  {
    id: "case_005",
    userId: "user_789",
    destination: "Germany",
    countryCode: "DE",
    visaType: "Work Visa",
    dateBooked: "2024-02-25",
    meetingType: "Online",
    fee: "$180",
    status: "In Progress",
    appointmentTime: "4:00 PM CET",
    duration: "60 Minutes",
    createdAt: "2024-02-12",
    documents: [],
    adminFeedback: []
  },
];

// Helper function to get consultations for the current user only
export const getCurrentUserConsultations = () => {
  return MOCK_CONSULTATIONS.filter(consultation => consultation.userId === CURRENT_USER_ID);
};

// Helper function to get a specific consultation by ID (with user verification)
export const getConsultationById = (id) => {
  const consultation = MOCK_CONSULTATIONS.find(c => c.id === id);
  
  // Security check: only return if it belongs to the current user
  if (consultation && consultation.userId === CURRENT_USER_ID) {
    return consultation;
  }
  
  return null; // Case not found or doesn't belong to current user
};

// Helper function to get country flag emoji
export const getCountryFlag = (countryCode) => {
  const flags = {
    'CA': '🇨🇦',
    'GB': '🇬🇧',
    'US': '🇺🇸',
    'AU': '🇦🇺',
    'DE': '🇩🇪',
  };
  return flags[countryCode] || '🌍';
};
