import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { walletService } from '../services/walletService';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [dataInventory, setDataInventory] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
      fetchTransactions();
      fetchDataInventory();
    }
  }, [isAuthenticated]);

  const fetchBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const result = await walletService.getBalance(token);
      if (result.success) setBalance(result.balance);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchTransactions = async (page = 1) => {
    setIsLoadingTransactions(true);
    try {
      const result = await walletService.getTransactions(token, page);
      if (result.success) {
        setTransactions(page === 1 ? result.transactions : [...transactions, ...result.transactions]);
      }
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const fetchDataInventory = async () => {
    try {
      const result = await walletService.getDataInventory(token);
      if (result.success) setDataInventory(result.inventory);
    } catch (error) {
      console.error('Error fetching data inventory:', error);
    }
  };

  const fundWallet = async (amount, paymentMethod) => {
    const result = await walletService.fundWallet(token, amount, paymentMethod);
    if (result.success) {
      setBalance((prev) => prev + amount);
      await fetchTransactions();
    }
    return result;
  };

  const withdraw = async (amount, bankDetails) => {
    const result = await walletService.withdraw(token, amount, bankDetails);
    if (result.success) {
      setBalance((prev) => prev - amount);
      await fetchTransactions();
    }
    return result;
  };

  const buyData = async (network, planId, phoneNumber) => {
    const result = await walletService.buyData(token, network, planId, phoneNumber);
    if (result.success) {
      setBalance((prev) => prev - result.amount);
      await fetchTransactions();
    }
    return result;
  };

  const buyAirtime = async (network, amount, phoneNumber) => {
    const result = await walletService.buyAirtime(token, network, amount, phoneNumber);
    if (result.success) {
      setBalance((prev) => prev - amount);
      await fetchTransactions();
    }
    return result;
  };

  const sellData = async (network, planId, quantity = 1) => {
    const result = await walletService.sellData(token, network, planId, quantity);
    if (result.success) {
      setBalance((prev) => prev + result.creditAmount);
      await fetchTransactions();
      await fetchDataInventory();
    }
    return result;
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        dataInventory,
        isLoadingBalance,
        isLoadingTransactions,
        fetchBalance,
        fetchTransactions,
        fetchDataInventory,
        fundWallet,
        withdraw,
        buyData,
        buyAirtime,
        sellData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};
