import type { FormErrors, PasswordStrength } from '../types';

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const MIN_PASSWORD_LENGTH = 6;

export function validateEmail(email: string): string | undefined {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
  return undefined;
}

export function validatePassword(password: string, requireMinLength = false): string | undefined {
  if (!password) return 'Password is required';
  if (requireMinLength && password.length < MIN_PASSWORD_LENGTH) {
    return `Minimum ${MIN_PASSWORD_LENGTH} characters`;
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  if (!name.trim()) return 'Name is required';
  return undefined;
}

export function validateLoginForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateSignupForm(
  name: string,
  email: string,
  password: string
): FormErrors {
  const errors: FormErrors = {};
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password, true);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { level: 0, label: '' };

  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: 1, label: 'WEAK' };
  if (strength <= 3) return { level: 2, label: 'MEDIUM' };
  return { level: 3, label: 'STRONG' };
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
