import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPhoneNumber,
  maskPhoneNumber,
  maskAccountNumber,
  formatDataSize,
  getInitials,
  truncateText,
  getTransactionIconName,
  getTransactionLabel,
} from '../src/utils/formatters';

describe('formatCurrency', () => {
  it('formats naira with thousands separators and 2 decimals', () => {
    expect(formatCurrency(12260)).toBe('₦12,260.00');
    expect(formatCurrency('1500.5')).toBe('₦1,500.50');
  });
  it('treats non-numbers as zero', () => {
    expect(formatCurrency(undefined)).toBe('₦0.00');
  });
});

describe('formatPhoneNumber', () => {
  it('normalises local and international forms to +234', () => {
    expect(formatPhoneNumber('08012345678')).toBe('+2348012345678');
    expect(formatPhoneNumber('234 801 234 5678')).toBe('+2348012345678');
    expect(formatPhoneNumber('8012345678')).toBe('+2348012345678');
  });
});

describe('masking', () => {
  it('shows only the last 4 digits', () => {
    expect(maskPhoneNumber('0801-234-5678')).toBe('****5678');
    expect(maskAccountNumber('0123456789')).toBe('****6789');
  });
  it('returns empty string for missing values', () => {
    expect(maskPhoneNumber(null)).toBe('');
    expect(maskAccountNumber(undefined)).toBe('');
  });
});

describe('formatDataSize', () => {
  it('uses MB below 1GB and GB otherwise', () => {
    expect(formatDataSize(0.5)).toBe('512MB');
    expect(formatDataSize(2)).toBe('2GB');
  });
});

describe('getInitials', () => {
  it('uses first and last name initials', () => {
    expect(getInitials('Chioma Ada Obi')).toBe('CO');
  });
  it('uses the first two letters of a single name', () => {
    expect(getInitials('emeka')).toBe('EM');
  });
  it('falls back to the brand initials', () => {
    expect(getInitials('')).toBe('DS');
  });
});

describe('truncateText', () => {
  it('leaves short text alone and truncates long text', () => {
    expect(truncateText('short')).toBe('short');
    expect(truncateText('a'.repeat(35))).toBe(`${'a'.repeat(30)}...`);
    expect(truncateText(null)).toBe('');
  });
});

describe('transaction display helpers', () => {
  it('maps known types and falls back for unknown ones', () => {
    expect(getTransactionLabel('sell_data')).toBe('Data Sale');
    expect(getTransactionIconName('buy_airtime')).toBe('call-outline');
    expect(getTransactionLabel('mystery')).toBe('Transaction');
    expect(getTransactionIconName('mystery')).toBe('receipt-outline');
  });
});
