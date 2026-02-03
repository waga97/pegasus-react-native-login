const XSS_PATTERN = /[<>"'&]/g;
const NAME_PATTERN = /[^a-zA-Z\s\-']/g;
const DEFAULT_MAX_LENGTH = 100;
const NAME_MAX_LENGTH = 50;

export function sanitizeInput(input: string, maxLength = DEFAULT_MAX_LENGTH): string {
  return input.trim().replace(XSS_PATTERN, '').slice(0, maxLength);
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeName(name: string): string {
  return name.trim().replace(NAME_PATTERN, '').slice(0, NAME_MAX_LENGTH);
}
