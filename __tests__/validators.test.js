import { describe, it, expect } from 'vitest';
import {
  validatePhone,
  validateEmail,
  validatePassword,
  validateBVN,
  validateNIN,
  validateAccountNumber,
  validatePIN,
  validateAmount,
  validateName,
  validateDateOfBirth,
} from '../src/utils/validators';

describe('validatePhone', () => {
  it.each(['08012345678', '07061234567', '09151234567', '2348012345678', '+234 801 234 5678'])(
    'accepts Nigerian number %s',
    (phone) => expect(validatePhone(phone)).toBe(true)
  );

  it.each(['0801234567', '06012345678', '08212345678', '12345678901', ''])(
    'rejects %s',
    (phone) => expect(validatePhone(phone)).toBe(false)
  );
});

describe('validateEmail', () => {
  it('accepts a normal address, ignoring surrounding spaces', () => {
    expect(validateEmail('  ada@example.com ')).toBe(true);
  });
  it.each(['ada@', 'ada.example.com', 'ada @example.com', '@example.com'])('rejects %s', (e) =>
    expect(validateEmail(e)).toBe(false)
  );
});

describe('validatePassword', () => {
  it('accepts a strong password', () => {
    expect(validatePassword('Str0ng!Pass')).toEqual({ valid: true, errors: [] });
  });

  it('lists every rule a weak password breaks', () => {
    const { valid, errors } = validatePassword('abc');
    expect(valid).toBe(false);
    expect(errors).toEqual([
      'At least 8 characters',
      'At least one uppercase letter',
      'At least one number',
      'At least one special character',
    ]);
  });
});

describe('ID and account numbers', () => {
  it('BVN and NIN need exactly 11 digits (formatting ignored)', () => {
    expect(validateBVN('222-3333-4444')).toBe(true);
    expect(validateBVN('1234567890')).toBe(false);
    expect(validateNIN('12345678901')).toBe(true);
    expect(validateNIN('123456789012')).toBe(false);
  });

  it('NUBAN account numbers need exactly 10 digits', () => {
    expect(validateAccountNumber('0123456789')).toBe(true);
    expect(validateAccountNumber('012345678')).toBe(false);
  });

  it('PIN must be exactly 4 digits', () => {
    expect(validatePIN('1234')).toBe(true);
    expect(validatePIN('12a4')).toBe(false);
    expect(validatePIN('12345')).toBe(false);
  });
});

describe('validateAmount', () => {
  it('enforces the default ₦50 – ₦1,000,000 range', () => {
    expect(validateAmount('50')).toEqual({ valid: true });
    expect(validateAmount('49.99').valid).toBe(false);
    expect(validateAmount('1000001').valid).toBe(false);
    expect(validateAmount('abc')).toEqual({ valid: false, error: 'Enter a valid amount' });
  });

  it('respects custom limits', () => {
    expect(validateAmount(100, 200, 500).error).toBe('Minimum amount is ₦200');
  });
});

describe('validateName', () => {
  it.each(["Chioma Obi", "O'Neil", 'Ade-Bola'])('accepts %s', (n) => expect(validateName(n)).toBe(true));
  it.each(['A', 'John3', '   '])('rejects %s', (n) => expect(validateName(n)).toBe(false));
});

describe('validateDateOfBirth (KYC: 18–100)', () => {
  const today = new Date(2026, 5, 15); // 15 June 2026

  it('accepts someone who turned 18 today', () => {
    expect(validateDateOfBirth(new Date(2008, 5, 15), today)).toBe(true);
  });

  it('rejects someone who turns 18 later this year', () => {
    // Regression: the old check only compared years, so this passed as "18".
    expect(validateDateOfBirth(new Date(2008, 5, 16), today)).toBe(false);
    expect(validateDateOfBirth(new Date(2008, 11, 1), today)).toBe(false);
  });

  it('rejects anyone over 100', () => {
    expect(validateDateOfBirth(new Date(1925, 0, 1), today)).toBe(false);
  });

  it('rejects an invalid date', () => {
    expect(validateDateOfBirth('not a date', today)).toBe(false);
  });
});
