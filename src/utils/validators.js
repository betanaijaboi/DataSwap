export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const nigerianPhoneRegex = /^(0[789][01]\d{8}|234[789][01]\d{8})$/;
  return nigerianPhoneRegex.test(cleaned);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
  if (!/\d/.test(password)) errors.push('At least one number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('At least one special character');
  return { valid: errors.length === 0, errors };
};

export const validateBVN = (bvn) => {
  const cleaned = bvn.replace(/\D/g, '');
  return cleaned.length === 11;
};

export const validateNIN = (nin) => {
  const cleaned = nin.replace(/\D/g, '');
  return cleaned.length === 11;
};

export const validateAccountNumber = (accountNumber) => {
  const cleaned = accountNumber.replace(/\D/g, '');
  return cleaned.length === 10;
};

export const validatePIN = (pin) => {
  return /^\d{4}$/.test(pin);
};

export const validateAmount = (amount, min = 50, max = 1000000) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return { valid: false, error: 'Enter a valid amount' };
  if (num < min) return { valid: false, error: `Minimum amount is ₦${min}` };
  if (num > max) return { valid: false, error: `Maximum amount is ₦${max.toLocaleString()}` };
  return { valid: true };
};

export const validateName = (name) => {
  return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name.trim());
};

// Age in completed years: someone born later in the year than today hasn't
// had this year's birthday yet, so they're a year younger than the year gap.
export const validateDateOfBirth = (dob, now = new Date()) => {
  const date = new Date(dob);
  if (isNaN(date.getTime())) return false;
  const minAge = 18;
  const maxAge = 100;
  let age = now.getFullYear() - date.getFullYear();
  const hadBirthdayThisYear =
    now.getMonth() > date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age >= minAge && age <= maxAge;
};
