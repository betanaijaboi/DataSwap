import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { STORAGE_KEYS, KYC_STATUS } from '../utils/constants';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [hasPIN, setHasPIN] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser, onboarding, biometric] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE),
        AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
      ]);

      setOnboardingDone(onboarding === 'true');
      setBiometricEnabled(biometric === 'true');

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
        const pinHash = await SecureStore.getItemAsync(STORAGE_KEYS.PIN_HASH);
        setHasPIN(!!pinHash);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const verifyOTP = async (phone, otp) => {
    const response = await authService.verifyOTP(phone, otp);
    return response;
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.success) {
      await persistAuth(response.token, response.user);
    }
    return response;
  };

  const persistAuth = async (authToken, userData) => {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, authToken),
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
    ]);
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const setPIN = async (pin) => {
    // In production use a proper hash (bcrypt) — this is a demo hash
    const hash = `${pin}_hashed_${Date.now()}`;
    await SecureStore.setItemAsync(STORAGE_KEYS.PIN_HASH, hash);
    setHasPIN(true);
    return true;
  };

  const verifyPIN = async (pin) => {
    const stored = await SecureStore.getItemAsync(STORAGE_KEYS.PIN_HASH);
    if (!stored) return false;
    // In production compare bcrypt hashes — mock comparison for demo
    return stored.startsWith(pin);
  };

  const enableBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      return { success: false, error: 'Biometric authentication not available on this device' };
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to enable biometric login',
      fallbackLabel: 'Use PIN',
    });
    if (result.success) {
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
      setBiometricEnabled(true);
    }
    return result;
  };

  const authenticateWithBiometric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access DataSwap',
      fallbackLabel: 'Use PIN',
    });
    return result;
  };

  const updateUser = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
    setUser(newUser);
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
    setOnboardingDone(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        biometricEnabled,
        hasPIN,
        onboardingDone,
        register,
        verifyOTP,
        login,
        logout,
        setPIN,
        verifyPIN,
        enableBiometric,
        authenticateWithBiometric,
        updateUser,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
