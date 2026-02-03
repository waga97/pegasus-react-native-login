import {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginForm,
  validateSignupForm,
  getPasswordStrength,
  hasErrors,
} from '../../src/utils/validation';

describe('validateEmail', () => {
  it('returns error when email is empty', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error for invalid email formats', () => {
    const invalidEmails = [
      'notanemail',
      'missing@domain',
      '@nodomain.com',
    ];

    invalidEmails.forEach((email) => {
      expect(validateEmail(email)).toBe('Invalid email format');
    });
  });

  it('returns undefined for valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.org',
      'user+tag@example.co.uk',
      'a@b.co',
    ];

    validEmails.forEach((email) => {
      expect(validateEmail(email)).toBeUndefined();
    });
  });
});

describe('validatePassword', () => {
  it('returns error when password is empty', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  it('allows any length when requireMinLength is false', () => {
    expect(validatePassword('abc')).toBeUndefined();
    expect(validatePassword('a')).toBeUndefined();
  });

  it('returns error for short passwords when requireMinLength is true', () => {
    expect(validatePassword('12345', true)).toBe('Minimum 6 characters');
    expect(validatePassword('a', true)).toBe('Minimum 6 characters');
  });

  it('allows passwords meeting minimum length', () => {
    expect(validatePassword('123456', true)).toBeUndefined();
    expect(validatePassword('longerpassword', true)).toBeUndefined();
  });
});

describe('validateName', () => {
  it('returns error when name is empty', () => {
    expect(validateName('')).toBe('Name is required');
  });

  it('returns error when name is only whitespace', () => {
    expect(validateName('   ')).toBe('Name is required');
    expect(validateName('\t\n')).toBe('Name is required');
  });

  it('returns undefined for valid names', () => {
    expect(validateName('John')).toBeUndefined();
    expect(validateName('John Doe')).toBeUndefined();
    expect(validateName(' Jane ')).toBeUndefined();
  });
});

describe('validateLoginForm', () => {
  it('returns both errors when both fields are empty', () => {
    const errors = validateLoginForm('', '');

    expect(errors.email).toBe('Email is required');
    expect(errors.password).toBe('Password is required');
  });

  it('returns only email error when password is valid', () => {
    const errors = validateLoginForm('invalid', 'password123');

    expect(errors.email).toBe('Invalid email format');
    expect(errors.password).toBeUndefined();
  });

  it('returns only password error when email is valid', () => {
    const errors = validateLoginForm('test@example.com', '');

    expect(errors.email).toBeUndefined();
    expect(errors.password).toBe('Password is required');
  });

  it('returns empty object when both fields are valid', () => {
    const errors = validateLoginForm('test@example.com', 'password');

    expect(errors).toEqual({});
  });

  it('does not enforce password minimum length', () => {
    const errors = validateLoginForm('test@example.com', 'abc');

    expect(errors).toEqual({});
  });
});

describe('validateSignupForm', () => {
  it('returns all errors when all fields are empty', () => {
    const errors = validateSignupForm('', '', '');

    expect(errors.name).toBe('Name is required');
    expect(errors.email).toBe('Email is required');
    expect(errors.password).toBe('Password is required');
  });

  it('enforces password minimum length', () => {
    const errors = validateSignupForm('John', 'john@example.com', '12345');

    expect(errors.name).toBeUndefined();
    expect(errors.email).toBeUndefined();
    expect(errors.password).toBe('Minimum 6 characters');
  });

  it('returns empty object when all fields are valid', () => {
    const errors = validateSignupForm('John Doe', 'john@example.com', 'password123');

    expect(errors).toEqual({});
  });

  it('validates each field independently', () => {
    const errors = validateSignupForm('', 'invalid', '123');

    expect(errors.name).toBe('Name is required');
    expect(errors.email).toBe('Invalid email format');
    expect(errors.password).toBe('Minimum 6 characters');
  });
});

describe('getPasswordStrength', () => {
  it('returns level 0 for empty password', () => {
    expect(getPasswordStrength('')).toEqual({ level: 0, label: '' });
  });

  it('returns WEAK for simple passwords', () => {
    const weakPasswords = ['abc', '12345', 'password', 'aaaaaa'];

    weakPasswords.forEach((password) => {
      const result = getPasswordStrength(password);
      expect(result.level).toBe(1);
      expect(result.label).toBe('WEAK');
    });
  });

  it('returns MEDIUM for passwords with some complexity', () => {
    // MEDIUM = 3 points: e.g. length>=6 + length>=8 + one of (upper/number/special)
    const mediumPasswords = ['Password', 'pass1234', 'aaaaaaaa!'];

    mediumPasswords.forEach((password) => {
      const result = getPasswordStrength(password);
      expect(result.level).toBe(2);
      expect(result.label).toBe('MEDIUM');
    });
  });

  it('returns STRONG for complex passwords', () => {
    const strongPasswords = ['Password1!', 'Abcd1234!', 'MyP@ssw0rd'];

    strongPasswords.forEach((password) => {
      const result = getPasswordStrength(password);
      expect(result.level).toBe(3);
      expect(result.label).toBe('STRONG');
    });
  });

  it('awards points for each criteria met', () => {
    // length >= 6: +1, length >= 8: +1, uppercase: +1, number: +1, special: +1
    expect(getPasswordStrength('aaaaaa').level).toBe(1); // 1 point (length 6)
    expect(getPasswordStrength('aaaaaaaa').level).toBe(1); // 2 points (length 6+8)
    expect(getPasswordStrength('Aaaaaaaa').level).toBe(2); // 3 points (length 6+8+upper)
    expect(getPasswordStrength('Aaaaaaa1').level).toBe(3); // 4 points (length 6+8+upper+num)
    expect(getPasswordStrength('Aaaaa1!').level).toBe(3); // 5 points (all criteria)
  });
});

describe('hasErrors', () => {
  it('returns false for empty object', () => {
    expect(hasErrors({})).toBe(false);
  });

  it('returns true when errors exist', () => {
    expect(hasErrors({ email: 'Email is required' })).toBe(true);
    expect(hasErrors({ email: 'error', password: 'error' })).toBe(true);
  });

  it('returns true even with undefined values as properties', () => {
    // Note: This tests that the function counts keys, not values
    const errors = { email: undefined };
    expect(hasErrors(errors as any)).toBe(true);
  });
});
