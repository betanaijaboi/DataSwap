import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, KYC_STATUS } from '../../utils/constants';
import { getInitials, formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, biometricEnabled, enableBiometric } = useAuth();
  const { balance } = useWallet();
  const [biometric, setBiometric] = useState(biometricEnabled);

  const handleToggleBiometric = async (value) => {
    if (value) {
      const result = await enableBiometric();
      if (result.success) setBiometric(true);
      else Alert.alert('Failed', result.error || 'Could not enable biometric login.');
    } else {
      setBiometric(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const kycColor = {
    [KYC_STATUS.VERIFIED]: COLORS.success,
    [KYC_STATUS.PENDING]: COLORS.warning,
    [KYC_STATUS.REJECTED]: COLORS.error,
    [KYC_STATUS.NOT_STARTED]: COLORS.gray500,
  }[user?.kycStatus] || COLORS.gray500;

  const kycLabel = {
    [KYC_STATUS.VERIFIED]: 'KYC Verified',
    [KYC_STATUS.PENDING]: 'KYC Pending',
    [KYC_STATUS.REJECTED]: 'KYC Rejected',
    [KYC_STATUS.NOT_STARTED]: 'KYC Not Started',
  }[user?.kycStatus] || 'Unknown';

  const MenuItem = ({ icon, label, onPress, right, destructive }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: destructive ? COLORS.errorLight : COLORS.gray100 }]}>
        <Ionicons name={icon} size={18} color={destructive ? COLORS.error : COLORS.gray700} />
      </View>
      <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>{label}</Text>
      {right || <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#0A2D6E', '#0D47A1']} style={styles.header}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>{getInitials(user?.fullName)}</Text>
        </View>
        <Text style={styles.userName}>{user?.fullName || 'DataSwap User'}</Text>
        <Text style={styles.userPhone}>{user?.phone}</Text>
        <View style={[styles.kycBadge, { backgroundColor: kycColor + '30', borderColor: kycColor }]}>
          <View style={[styles.kycDot, { backgroundColor: kycColor }]} />
          <Text style={[styles.kycLabel, { color: kycColor }]}>{kycLabel}</Text>
        </View>
      </LinearGradient>

      {/* Wallet summary */}
      <View style={styles.walletCard}>
        <View style={styles.walletItem}>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletValue}>{formatCurrency(balance)}</Text>
        </View>
      </View>

      {/* Account section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="person-outline"
            label="Personal Information"
            onPress={() => navigation.navigate('PersonalInfo')}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            label="KYC Verification"
            onPress={() => user?.kycStatus === KYC_STATUS.NOT_STARTED && navigation.navigate('KYC')}
            right={
              <View style={[styles.kycStatusBadge, { backgroundColor: kycColor + '20' }]}>
                <Text style={[styles.kycStatusText, { color: kycColor }]}>{kycLabel}</Text>
              </View>
            }
          />
          <MenuItem
            icon="card-outline"
            label="Bank Accounts"
            onPress={() => navigation.navigate('BankAccounts')}
          />
        </View>
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="keypad-outline"
            label="Change PIN"
            onPress={() => navigation.navigate('ChangePIN')}
          />
          <MenuItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIcon}>
              <Ionicons name="finger-print-outline" size={18} color={COLORS.gray700} />
            </View>
            <Text style={styles.menuLabel}>Biometric Login</Text>
            <Switch
              value={biometric}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon="chatbubble-outline" label="Help & Support" onPress={() => {}} />
          <MenuItem icon="document-text-outline" label="Terms of Service" onPress={() => {}} />
          <MenuItem icon="eye-outline" label="Privacy Policy" onPress={() => {}} />
          <MenuItem icon="information-circle-outline" label="About DataSwap" onPress={() => {}} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.menuGroup}>
          <MenuItem icon="log-out-outline" label="Log Out" onPress={handleLogout} destructive />
        </View>
      </View>

      <Text style={styles.version}>DataSwap v1.0.0 · Made in Nigeria 🇳🇬</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 52, paddingBottom: 28, paddingHorizontal: SIZES.paddingLg, alignItems: 'center' },
  avatarBox: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: COLORS.white },
  userName: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  userPhone: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
  kycBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1,
  },
  kycDot: { width: 6, height: 6, borderRadius: 3 },
  kycLabel: { fontSize: SIZES.xs, fontWeight: '700' },
  walletCard: {
    backgroundColor: COLORS.white, margin: 16, borderRadius: SIZES.radius, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  walletItem: { alignItems: 'center' },
  walletLabel: { fontSize: SIZES.sm, color: COLORS.gray500, marginBottom: 4 },
  walletValue: { fontSize: SIZES.xxl, fontWeight: '900', color: COLORS.primary },
  section: { paddingHorizontal: SIZES.padding, marginBottom: 8 },
  sectionTitle: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  menuGroup: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: SIZES.base, color: COLORS.gray800, fontWeight: '500' },
  menuLabelDestructive: { color: COLORS.error },
  kycStatusBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10 },
  kycStatusText: { fontSize: SIZES.xs, fontWeight: '700' },
  version: { textAlign: 'center', color: COLORS.gray400, fontSize: SIZES.xs, padding: 24 },
});

export default ProfileScreen;
