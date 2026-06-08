import { DATA_PLANS, SELL_RATE, TRANSACTION_TYPES } from '../utils/constants';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const genTxId = () => `tx_${Math.random().toString(36).slice(2)}${Date.now()}`;

// In-memory store simulating a backend
const wallets = new Map();
const allTransactions = new Map();
const dataInventory = new Map(); // company-held data

const ensureWallet = (token) => {
  if (!wallets.has(token)) {
    wallets.set(token, 12260); // demo starting balance matches seed transactions
  }
  if (!allTransactions.has(token)) {
    allTransactions.set(token, generateSeedTransactions());
  }
  if (!dataInventory.has(token)) {
    dataInventory.set(token, []);
  }
};

const generateSeedTransactions = () => {
  const now = Date.now();
  return [
    {
      id: genTxId(),
      type: TRANSACTION_TYPES.FUND_WALLET,
      amount: 10000,
      description: 'Wallet funded via Bank Transfer',
      status: 'success',
      createdAt: new Date(now - 86400000 * 3).toISOString(),
      network: null, phone: null,
    },
    {
      id: genTxId(),
      type: TRANSACTION_TYPES.BUY_DATA,
      amount: -1000,
      description: 'MTN 5GB (30 days) → 08012345678',
      status: 'success',
      createdAt: new Date(now - 86400000 * 2).toISOString(),
      network: 'mtn', phone: '08012345678',
    },
    {
      id: genTxId(),
      type: TRANSACTION_TYPES.SELL_DATA,
      amount: 760,
      description: 'Sold 1× MTN 5GB (30 days) data plan',
      status: 'success',
      createdAt: new Date(now - 86400000 * 1.5).toISOString(),
      network: 'mtn', phone: null,
    },
    {
      id: genTxId(),
      type: TRANSACTION_TYPES.BUY_AIRTIME,
      amount: -500,
      description: 'GLO ₦500 airtime → 08098765432',
      status: 'success',
      createdAt: new Date(now - 86400000).toISOString(),
      network: 'glo', phone: '08098765432',
    },
    {
      id: genTxId(),
      type: TRANSACTION_TYPES.FUND_WALLET,
      amount: 5000,
      description: 'Wallet funded via Debit Card',
      status: 'success',
      createdAt: new Date(now - 3600000 * 6).toISOString(),
      network: null, phone: null,
    },
    {
      id: genTxId(),
      type: TRANSACTION_TYPES.WITHDRAW,
      amount: -2000,
      description: 'Withdrawal to Zenith Bank ****4521',
      status: 'success',
      createdAt: new Date(now - 3600000 * 2).toISOString(),
      network: null, phone: null,
    },
  ];
};

const addTransaction = (token, tx) => {
  ensureWallet(token);
  const txList = allTransactions.get(token);
  txList.unshift({ ...tx, id: genTxId(), createdAt: new Date().toISOString(), status: 'success' });
  allTransactions.set(token, txList);
};

export const walletService = {
  getBalance: async (token) => {
    await delay(500);
    ensureWallet(token);
    return { success: true, balance: wallets.get(token) };
  },

  getTransactions: async (token, page = 1, limit = 20) => {
    await delay(600);
    ensureWallet(token);
    const all = allTransactions.get(token) || [];
    const start = (page - 1) * limit;
    const transactions = all.slice(start, start + limit);
    return { success: true, transactions, hasMore: start + limit < all.length };
  },

  getDataInventory: async (token) => {
    await delay(400);
    ensureWallet(token);
    const inventory = dataInventory.get(token) || [];
    return { success: true, inventory };
  },

  fundWallet: async (token, amount, paymentMethod) => {
    await delay(2000); // simulate payment gateway
    ensureWallet(token);
    const current = wallets.get(token);
    wallets.set(token, current + amount);
    addTransaction(token, {
      type: TRANSACTION_TYPES.FUND_WALLET,
      amount,
      description: `Wallet funded via ${paymentMethod?.type || 'Card'}`,
      network: null,
      phone: null,
    });
    return { success: true, newBalance: current + amount };
  },

  withdraw: async (token, amount, bankDetails) => {
    await delay(1500);
    ensureWallet(token);
    const current = wallets.get(token);
    if (current < amount) {
      return { success: false, error: 'Insufficient wallet balance.' };
    }
    wallets.set(token, current - amount);
    addTransaction(token, {
      type: TRANSACTION_TYPES.WITHDRAW,
      amount: -amount,
      description: `Withdrawal to ${bankDetails.bankName} ****${bankDetails.accountNumber.slice(-4)}`,
      network: null,
      phone: null,
    });
    return { success: true, newBalance: current - amount };
  },

  buyData: async (token, network, planId, phoneNumber) => {
    await delay(1800);
    ensureWallet(token);

    const networkPlans = DATA_PLANS[network];
    if (!networkPlans) return { success: false, error: 'Invalid network.' };

    const plan = networkPlans.find((p) => p.id === planId);
    if (!plan) return { success: false, error: 'Invalid plan selected.' };

    const current = wallets.get(token);
    if (current < plan.price) {
      return { success: false, error: 'Insufficient wallet balance. Please fund your wallet.' };
    }

    // Check company inventory first (resell path), otherwise use direct top-up
    const inv = dataInventory.get(token) || [];
    const invItem = inv.find((i) => i.planId === planId && i.quantity > 0);
    let source = 'direct';
    if (invItem) {
      invItem.quantity -= 1;
      if (invItem.quantity === 0) {
        dataInventory.set(token, inv.filter((i) => i.planId !== planId));
      } else {
        dataInventory.set(token, inv);
      }
      source = 'inventory';
    }

    wallets.set(token, current - plan.price);
    addTransaction(token, {
      type: TRANSACTION_TYPES.BUY_DATA,
      amount: -plan.price,
      description: `${network.toUpperCase()} ${plan.size} (${plan.duration}) → ${phoneNumber}`,
      network,
      phone: phoneNumber,
      source,
      planId,
    });

    return {
      success: true,
      amount: plan.price,
      plan,
      message: `${plan.size} data sent to ${phoneNumber} successfully!`,
    };
  },

  buyAirtime: async (token, network, amount, phoneNumber) => {
    await delay(1200);
    ensureWallet(token);

    const current = wallets.get(token);
    if (current < amount) {
      return { success: false, error: 'Insufficient wallet balance. Please fund your wallet.' };
    }

    wallets.set(token, current - amount);
    addTransaction(token, {
      type: TRANSACTION_TYPES.BUY_AIRTIME,
      amount: -amount,
      description: `${network.toUpperCase()} ₦${amount} airtime → ${phoneNumber}`,
      network,
      phone: phoneNumber,
    });

    return {
      success: true,
      amount,
      message: `₦${amount} airtime sent to ${phoneNumber} successfully!`,
    };
  },

  sellData: async (token, network, planId, quantity = 1) => {
    await delay(1500);
    ensureWallet(token);

    const networkPlans = DATA_PLANS[network];
    if (!networkPlans) return { success: false, error: 'Invalid network.' };

    const plan = networkPlans.find((p) => p.id === planId);
    if (!plan) return { success: false, error: 'Invalid plan selected.' };

    const creditAmount = plan.sellPrice * quantity;
    const current = wallets.get(token);
    wallets.set(token, current + creditAmount);

    // Add to company inventory
    const inv = dataInventory.get(token) || [];
    const existing = inv.find((i) => i.planId === planId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      inv.push({ planId, network, plan, quantity, listedAt: new Date().toISOString() });
    }
    dataInventory.set(token, inv);

    addTransaction(token, {
      type: TRANSACTION_TYPES.SELL_DATA,
      amount: creditAmount,
      description: `Sold ${quantity}× ${network.toUpperCase()} ${plan.size} data plan`,
      network,
      phone: null,
      planId,
      quantity,
    });

    return {
      success: true,
      creditAmount,
      plan,
      message: `₦${creditAmount.toLocaleString()} credited to your wallet!`,
    };
  },

  getMarketplace: async (token) => {
    await delay(700);
    // Aggregate from all users' inventories (mock)
    const listings = [
      { id: 'lst_1', network: 'mtn', planId: 'mtn_5gb_30', plan: DATA_PLANS.mtn[2], available: 12, marketPrice: 950 },
      { id: 'lst_2', network: 'airtel', planId: 'airtel_2gb_30', plan: DATA_PLANS.airtel[1], available: 5, marketPrice: 470 },
      { id: 'lst_3', network: 'glo', planId: 'glo_10gb_30', plan: DATA_PLANS.glo[3], available: 8, marketPrice: 1900 },
    ];
    return { success: true, listings };
  },

  getBanks: async () => {
    await delay(500);
    return {
      success: true,
      banks: [
        { code: '044', name: 'Access Bank' },
        { code: '023', name: 'Citibank' },
        { code: '050', name: 'EcoBank' },
        { code: '011', name: 'First Bank' },
        { code: '214', name: 'First City Monument Bank' },
        { code: '070', name: 'Fidelity Bank' },
        { code: '058', name: 'Guaranty Trust Bank' },
        { code: '030', name: 'Heritage Bank' },
        { code: '301', name: 'Jaiz Bank' },
        { code: '082', name: 'Keystone Bank' },
        { code: '526', name: 'OPay' },
        { code: '076', name: 'Polaris Bank' },
        { code: '101', name: 'ProvidusBank' },
        { code: '221', name: 'Stanbic IBTC Bank' },
        { code: '068', name: 'Standard Chartered' },
        { code: '232', name: 'Sterling Bank' },
        { code: '033', name: 'United Bank for Africa' },
        { code: '032', name: 'Union Bank' },
        { code: '035', name: 'Wema Bank' },
        { code: '057', name: 'Zenith Bank' },
      ],
    };
  },

  verifyAccountNumber: async (accountNumber, bankCode) => {
    await delay(1200);
    // Mock verification
    const names = ['John Doe', 'Jane Smith', 'Aminu Ibrahim', 'Chioma Obi', 'Emeka Nwosu'];
    const name = names[Math.floor(Math.random() * names.length)];
    return { success: true, accountName: name };
  },
};
