import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/constants';

import { useAuth } from '../context/AuthContext';

// Auth screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import KYCScreen from '../screens/auth/KYCScreen';
import PINSetupScreen from '../screens/auth/PINSetupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main screens
import HomeScreen from '../screens/main/HomeScreen';
import BuyDataScreen from '../screens/main/BuyDataScreen';
import BuyAirtimeScreen from '../screens/main/BuyAirtimeScreen';
import SellDataScreen from '../screens/main/SellDataScreen';
import FundWalletScreen from '../screens/main/FundWalletScreen';
import WithdrawScreen from '../screens/main/WithdrawScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SuccessScreen from '../screens/SuccessScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const KYCPendingScreen = ({ navigation }) => (
  <View style={styles.pendingContainer}>
    <View style={styles.pendingIconBox}>
      <Ionicons name="time-outline" size={48} color={COLORS.warning} />
    </View>
    <Text style={styles.pendingTitle}>KYC Under Review</Text>
    <Text style={styles.pendingText}>
      Your documents are being verified. This usually takes 1-2 business days.
      {"\n"}We will notify you once it is complete.
    </Text>
  </View>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray400,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIcon: ({ focused, color, size }) => {
        const icons = {
          Home: focused ? 'home' : 'home-outline',
          BuyData: focused ? 'cloud-download' : 'cloud-download-outline',
          SellData: focused ? 'cash' : 'cash-outline',
          Transactions: focused ? 'list' : 'list-outline',
          Profile: focused ? 'person' : 'person-outline',
        };
        return <Ionicons name={icons[route.name]} size={22} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="BuyData" component={BuyDataScreen} options={{ title: 'Buy Data' }} />
    <Tab.Screen name="SellData" component={SellDataScreen} options={{ title: 'Sell Data' }} />
    <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'History' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isLoading, isAuthenticated, onboardingDone } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIconBox}>
          <Ionicons name="flash" size={40} color={COLORS.white} />
        </View>
        <Text style={styles.loadingText}>DataSwap</Text>
        <ActivityIndicator color={COLORS.white} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!isAuthenticated ? (
          <>
            {!onboardingDone && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="KYC" component={KYCScreen} />
            <Stack.Screen name="KYCPending" component={KYCPendingScreen} />
            <Stack.Screen name="PINSetup" component={PINSetupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainApp" component={MainTabs} />
            <Stack.Screen name="BuyData" component={BuyDataScreen} />
            <Stack.Screen name="BuyAirtime" component={BuyAirtimeScreen} />
            <Stack.Screen name="SellData" component={SellDataScreen} />
            <Stack.Screen name="FundWallet" component={FundWalletScreen} />
            <Stack.Screen name="Withdraw" component={WithdrawScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
            <Stack.Screen name="KYC" component={KYCScreen} />
            <Stack.Screen name="PINSetup" component={PINSetupScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  loadingIconBox: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  loadingText: { fontSize: 32, fontWeight: '900', color: COLORS.white, marginTop: 8 },
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    height: 70,
    paddingTop: 8,
    paddingBottom: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  pendingContainer: {
    flex: 1, backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  pendingIconBox: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: COLORS.warningLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  pendingTitle: { fontSize: 22, fontWeight: '800', color: COLORS.gray900, textAlign: 'center', marginBottom: 12 },
  pendingText: { fontSize: 15, color: COLORS.gray500, textAlign: 'center', lineHeight: 22 },
});

export default AppNavigator;
