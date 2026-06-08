export const COLORS = {
  primary: '#0D47A1',
  primaryLight: '#1565C0',
  primaryDark: '#0A2D6E',
  secondary: '#00BCD4',
  accent: '#FF6F00',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  error: '#C62828',
  errorLight: '#FFEBEE',
  warning: '#F57F17',
  warningLight: '#FFF8E1',
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  background: '#F8FAFF',
  cardBg: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  title: 36,
  radius: 12,
  radiusSm: 8,
  radiusLg: 20,
  padding: 16,
  paddingLg: 24,
};

export const NETWORKS = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00', textColor: '#000000', logo: require('../../assets/networks/mtn.png') },
  { id: 'airtel', name: 'Airtel', color: '#E31E24', textColor: '#FFFFFF', logo: require('../../assets/networks/airtel.png'), logoTint: '#FFFFFF' },
  { id: 'glo', name: 'Glo', color: '#007A3D', textColor: '#FFFFFF', logo: require('../../assets/networks/glo.png') },
  { id: '9mobile', name: '9Mobile', color: '#006633', textColor: '#FFFFFF', logo: require('../../assets/networks/9mobile.png') },
];

export const DATA_PLANS = {
  mtn: [
    { id: 'mtn_1gb_30', size: '1GB', duration: '30 days', price: 300, sellPrice: 230 },
    { id: 'mtn_2gb_30', size: '2GB', duration: '30 days', price: 500, sellPrice: 380 },
    { id: 'mtn_5gb_30', size: '5GB', duration: '30 days', price: 1000, sellPrice: 760 },
    { id: 'mtn_10gb_30', size: '10GB', duration: '30 days', price: 2000, sellPrice: 1500 },
    { id: 'mtn_20gb_30', size: '20GB', duration: '30 days', price: 3500, sellPrice: 2600 },
    { id: 'mtn_100mb_1', size: '100MB', duration: '1 day', price: 100, sellPrice: 70 },
    { id: 'mtn_500mb_7', size: '500MB', duration: '7 days', price: 200, sellPrice: 150 },
  ],
  airtel: [
    { id: 'airtel_1gb_30', size: '1GB', duration: '30 days', price: 300, sellPrice: 230 },
    { id: 'airtel_2gb_30', size: '2GB', duration: '30 days', price: 500, sellPrice: 380 },
    { id: 'airtel_5gb_30', size: '5GB', duration: '30 days', price: 1000, sellPrice: 760 },
    { id: 'airtel_10gb_30', size: '10GB', duration: '30 days', price: 2000, sellPrice: 1500 },
  ],
  glo: [
    { id: 'glo_1gb_30', size: '1GB', duration: '30 days', price: 250, sellPrice: 190 },
    { id: 'glo_2gb_30', size: '2GB', duration: '30 days', price: 500, sellPrice: 380 },
    { id: 'glo_5gb_30', size: '5GB', duration: '30 days', price: 1000, sellPrice: 760 },
    { id: 'glo_10gb_30', size: '10GB', duration: '30 days', price: 2000, sellPrice: 1500 },
  ],
  '9mobile': [
    { id: '9m_1gb_30', size: '1GB', duration: '30 days', price: 300, sellPrice: 230 },
    { id: '9m_2gb_30', size: '2GB', duration: '30 days', price: 500, sellPrice: 380 },
    { id: '9m_5gb_30', size: '5GB', duration: '30 days', price: 1000, sellPrice: 760 },
  ],
};

export const AIRTIME_DENOMINATIONS = [50, 100, 200, 500, 1000, 2000, 5000];

export const TRANSACTION_TYPES = {
  BUY_DATA: 'buy_data',
  BUY_AIRTIME: 'buy_airtime',
  SELL_DATA: 'sell_data',
  FUND_WALLET: 'fund_wallet',
  WITHDRAW: 'withdraw',
  TRANSFER: 'transfer',
};

export const KYC_STATUS = {
  NOT_STARTED: 'not_started',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

export const SELL_RATE = 0.76; // 76% of market value

export const API_BASE_URL = 'https://api.dataswap.ng/v1';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'dataswap_auth_token',
  USER_DATA: 'dataswap_user_data',
  PIN_HASH: 'dataswap_pin_hash',
  BIOMETRIC_ENABLED: 'dataswap_biometric',
  ONBOARDING_DONE: 'dataswap_onboarding',
};
