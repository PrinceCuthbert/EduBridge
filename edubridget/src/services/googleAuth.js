// services/googleAuth.js
export const processGoogleUser = (decoded, adminEmails) => {
  const isAdmin = adminEmails.includes(decoded.email);

  return {
    id: decoded.sub || `google_${Date.now()}`,
    email: decoded.email,
    name: decoded.name,
    avatar: decoded.picture,
    role: isAdmin ? "admin" : "student",
  };
};
