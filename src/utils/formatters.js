export const formatCurrency = (amount, currency = 'NGN') => {
  const num = parseFloat(amount) || 0;
  return `₦${num.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('234')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`;
  return `+234${cleaned}`;
};

export const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  return `****${cleaned.slice(-4)}`;
};

export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  return `****${accountNumber.slice(-4)}`;
};

export const formatDataSize = (gb) => {
  if (gb < 1) return `${gb * 1024}MB`;
  return `${gb}GB`;
};

export const getInitials = (name) => {
  if (!name) return 'DS';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Icon name map — used with Ionicons in transaction rows
// Returns an Ionicons icon name string (not an emoji)
export const getTransactionIconName = (type) => {
  const icons = {
    buy_data: 'cloud-download-outline',
    buy_airtime: 'call-outline',
    sell_data: 'cash-outline',
    fund_wallet: 'wallet-outline',
    withdraw: 'arrow-down-circle-outline',
    transfer: 'swap-horizontal-outline',
  };
  return icons[type] || 'receipt-outline';
};

export const getTransactionLabel = (type) => {
  const labels = {
    buy_data: 'Data Purchase',
    buy_airtime: 'Airtime Purchase',
    sell_data: 'Data Sale',
    fund_wallet: 'Wallet Funding',
    withdraw: 'Withdrawal',
    transfer: 'Transfer',
  };
  return labels[type] || 'Transaction';
};
