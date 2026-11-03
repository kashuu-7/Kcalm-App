const EMAIL_RE = /^\S+@\S+\.\S+$/;

export const validateEmail = (v: string) =>
  !v.trim()
    ? "Enter your email"
    : !EMAIL_RE.test(v.trim())
      ? "Enter a valid email address"
      : undefined;

export const validateName = (v: string) =>
  !v.trim() ? "Enter your name" : undefined;

// Login par sirf check hota hai ki khali na ho
export const validatePassword = (v: string) =>
  !v ? "Enter your password" : undefined;

// Naya password banate waqt
export const validateNewPassword = (v: string) =>
  v.length < 8 ? "Use at least 8 characters" : undefined;