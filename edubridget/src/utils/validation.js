// utils/validation.js
export const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/\d/.test(password)) return "Password must contain at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one symbol";
  return null;
};

export const validateSignUpForm = (formData) => {
  if (formData.password !== formData.confirmPassword)
    return "Passwords do not match";

  const passwordError = validatePassword(formData.password);
  if (passwordError) return passwordError;

  return null;
};
