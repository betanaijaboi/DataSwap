import { KYC_STATUS } from '../utils/constants';

// Simulated network delay for realistic UX
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = new Map();
const mockOTPs = new Map();

// ─── Pre-seeded demo account (no real KYC needed) ────────────────────────────
mockUsers.set('08000000000', {
  id: 'usr_demo001',
  phone: '08000000000',
  email: 'demo@dataswap.ng',
  fullName: 'Demo User',
  password: 'Demo@1234',
  kycStatus: KYC_STATUS.VERIFIED,
  isPhoneVerified: true,
  createdAt: new Date('2025-01-01').toISOString(),
  walletBalance: 0,
  pin: null,
  bvn: '00000000000',
  nin: '00000000000',
});
// ─────────────────────────────────────────────────────────────────────────────

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = () => `ds_tok_${Math.random().toString(36).slice(2)}${Date.now()}`;
const generateUserId = () => `usr_${Math.random().toString(36).slice(2)}`;

export const authService = {
  register: async (userData) => {
    await delay(1200);
    const { phone, email, fullName, password } = userData;

    if (mockUsers.has(phone)) {
      return { success: false, error: 'Phone number already registered. Please log in.' };
    }

    const otp = generateOTP();
    mockOTPs.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    mockUsers.set(phone, {
      id: generateUserId(),
      phone,
      email,
      fullName,
      password,
      kycStatus: KYC_STATUS.NOT_STARTED,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
      walletBalance: 0,
      pin: null,
      bvn: null,
      nin: null,
    });

    console.log(`[DEV] OTP for ${phone}: ${otp}`);
    return { success: true, message: `OTP sent to ${phone}` };
  },

  verifyOTP: async (phone, otp) => {
    await delay(800);
    const stored = mockOTPs.get(phone);
    if (!stored) return { success: false, error: 'OTP expired. Please request a new one.' };
    if (Date.now() > stored.expiresAt) {
      mockOTPs.delete(phone);
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }
    // Accept any 6-digit OTP in dev mode OR '123456'
    if (stored.otp !== otp && otp !== '123456') {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }

    mockOTPs.delete(phone);
    const user = mockUsers.get(phone);
    if (user) {
      user.isPhoneVerified = true;
      mockUsers.set(phone, user);
    }

    return { success: true, message: 'Phone number verified successfully' };
  },

  resendOTP: async (phone) => {
    await delay(600);
    const user = mockUsers.get(phone);
    if (!user) return { success: false, error: 'Phone number not found.' };
    const otp = generateOTP();
    mockOTPs.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    console.log(`[DEV] Resent OTP for ${phone}: ${otp}`);
    return { success: true, message: 'OTP resent successfully' };
  },

  login: async ({ phone, password }) => {
    await delay(1000);
    const user = mockUsers.get(phone);
    if (!user) return { success: false, error: 'Account not found. Please register.' };
    if (user.password !== password) return { success: false, error: 'Incorrect password.' };
    if (!user.isPhoneVerified) {
      const otp = generateOTP();
      mockOTPs.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
      return { success: false, error: 'Phone not verified', requiresOTP: true };
    }

    const token = generateToken();
    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.pin;

    return { success: true, token, user: safeUser };
  },

  submitKYC: async (token, kycData) => {
    await delay(2000);
    return {
      success: true,
      status: KYC_STATUS.PENDING,
      message: 'KYC submitted successfully. Verification takes 1-2 business days.',
    };
  },

  checkKYCStatus: async (token) => {
    await delay(600);
    return { success: true, status: KYC_STATUS.PENDING };
  },

  // Demo: fast-track KYC approval
  approveKYC: async (userId) => {
    await delay(500);
    for (const [phone, user] of mockUsers.entries()) {
      if (user.id === userId) {
        user.kycStatus = KYC_STATUS.VERIFIED;
        mockUsers.set(phone, user);
        break;
      }
    }
    return { success: true };
  },

  forgotPassword: async (phone) => {
    await delay(800);
    const user = mockUsers.get(phone);
    if (!user) return { success: false, error: 'Phone number not registered.' };
    const otp = generateOTP();
    mockOTPs.set(`reset_${phone}`, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    console.log(`[DEV] Password reset OTP for ${phone}: ${otp}`);
    return { success: true, message: 'Reset OTP sent to your phone.' };
  },

  resetPassword: async (phone, otp, newPassword) => {
    await delay(800);
    const stored = mockOTPs.get(`reset_${phone}`);
    if (!stored || stored.otp !== otp) return { success: false, error: 'Invalid or expired OTP.' };
    const user = mockUsers.get(phone);
    if (!user) return { success: false, error: 'Account not found.' };
    user.password = newPassword;
    mockUsers.set(phone, user);
    mockOTPs.delete(`reset_${phone}`);
    return { success: true, message: 'Password reset successfully.' };
  },
};
