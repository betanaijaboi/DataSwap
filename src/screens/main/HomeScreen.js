import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, KYC_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate, getTransactionIconName } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';

const QUICK_ACTIONS = [
  { id: 'buy_data', iconName: 'cloud-download-outline', label: 'Buy Data', color: '#1565C0', bg: '#EBF2FF', screen: 'BuyData' },
  { id: 'buy_airtime', iconName: 'call-outline', label: 'Airtime', color: '#1B5E20', bg: '#E8F5E9', screen: 'BuyAirtime' },
  { id: 'sell_data', iconName: 'cash-outline', label: 'Sell Data', color: '#E65100', bg: '#FFF3E0', screen: 'SellData' },
  { id: 'fund', iconName: 'add-circle-outline', label: 'Fund Wallet', color: '#4A148C', bg: '#F3E5F5', screen: 'FundWallet' },
  { id: 'withdraw', iconName: 'arrow-down-circle-outline', label: 'Withdraw', color: '#006064', bg: '#E0F7FA', screen: 'Withdraw' },
  { id: 'history', iconName: 'list-outline', label: 'History', color: '#37474F', bg: '#ECEFF1', screen: 'Transactions' },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { balance, transactions, fetchBalance, fetchTransactions } = useWallet();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isKYCVerified = user?.kycStatus === KYC_STATUS.VERIFIED;
  const kycPending = user?.kycStatus === KYC_STATUS.PENDING;

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchBalance(), fetchTransactions()]);
    setRefreshing(false);
  };

  const firstName = user?.fullName?.split(' ')[0] || 'User';
  const recentTx = transactions.slice(0, 5);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.white} />}
      >
        {/* Header */}
        <LinearGradient colors={['#0A2D6E', '#0D47A1', '#1565C0']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good {getGreeting()}, {firstName}</Text>
              <Text style={styles.tagline}>DataSwap</Text>
            </View>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceLabel}>Wallet Balance</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.balanceAmount}>
                    {balanceVisible ? formatCurrency(balance) : '₦ ••••••'}
                  </Text>
                  <TouchableOpacity onPress={() => setBalanceVisible((v) => !v)} style={styles.eyeBtn}>
                    <Ionicons
                      name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="rgba(255,255,255,0.7)"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.balanceActions}>
                <TouchableOpacity style={styles.balanceAction} onPress={() => navigation.navigate('FundWallet')}>
                  <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
                  <Text style={styles.balanceActionText}>Fund</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.balanceAction} onPress={() => navigation.navigate('Withdraw')}>
                  <Ionicons name="arrow-down-circle-outline" size={20} color={COLORS.white} />
                  <Text style={styles.balanceActionText}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* KYC Banner */}
        {!isKYCVerified && (
          <TouchableOpacity
            style={[styles.kycBanner, kycPending && styles.kycBannerPending]}
            onPress={() => !kycPending && navigation.navigate('KYC')}
          >
            <Ionicons
              name={kycPending ? 'time-outline' : 'shield-outline'}
              size={20}
              color={kycPending ? COLORS.warning : COLORS.error}
            />
            <View style={styles.kycBannerText}>
              <Text style={[styles.kycBannerTitle, kycPending && styles.kycBannerTitlePending]}>
                {kycPending ? 'KYC Verification Pending' : 'Complete KYC Verification'}
              </Text>
              <Text style={styles.kycBannerSub}>
                {kycPending
                  ? 'Your documents are being reviewed (1-2 business days)'
                  : 'Verify your identity to unlock full features and higher limits'}
              </Text>
            </View>
            {!kycPending && <Ionicons name="chevron-forward" size={16} color={COLORS.error} />}
          </TouchableOpacity>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                  <Ionicons name={action.iconName} size={26} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTx.length === 0 ? (
            <View style={styles.emptyTx}>
              <Ionicons name="receipt-outline" size={40} color={COLORS.gray400} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTxText}>No transactions yet</Text>
              <Text style={styles.emptyTxSub}>Buy data or airtime to get started</Text>
            </View>
          ) : (
            recentTx.map((tx) => (
              <View key={tx.id} style={styles.txCard}>
                <View style={[styles.txIcon, tx.amount > 0 ? styles.txIconCredit : styles.txIconDebit]}>
                  <Ionicons name={getTransactionIconName(tx.type)} size={18} color={tx.amount > 0 ? COLORS.success : COLORS.gray600} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                  <Text style={styles.txDate}>{formatDate(tx.createdAt)}</Text>
                </View>
                <Text style={[styles.txAmount, tx.amount > 0 ? styles.txCredit : styles.txDebit]}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 52, paddingBottom: 24, paddingHorizontal: SIZES.paddingLg },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: SIZES.base, color: 'rgba(255,255,255,0.85)', marginBottom: 2 },
  tagline: { fontSize: SIZES.xl, fontWeight: '900', color: COLORS.white },
  notifBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, position: 'absolute', top: 8, right: 8 },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: SIZES.radiusLg,
    padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  balanceAmount: { fontSize: SIZES.xxxl, fontWeight: '800', color: COLORS.white },
  eyeBtn: { padding: 4 },
  balanceActions: { gap: 12 },
  balanceAction: { alignItems: 'center', gap: 4 },
  balanceActionText: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  kycBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.errorLight, margin: 16, padding: 14,
    borderRadius: SIZES.radius, borderLeftWidth: 4, borderLeftColor: COLORS.error,
  },
  kycBannerPending: { backgroundColor: COLORS.warningLight, borderLeftColor: COLORS.warning },
  kycBannerText: { flex: 1 },
  kycBannerTitle: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.error },
  kycBannerTitlePending: { color: COLORS.warning },
  kycBannerSub: { fontSize: SIZES.xs, color: COLORS.gray600, marginTop: 2 },
  section: { padding: SIZES.paddingLg, paddingTop: 16 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: SIZES.base, fontWeight: '800', color: COLORS.gray900, marginBottom: 14 },
  seeAll: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '30%', alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: SIZES.xs, color: COLORS.gray700, fontWeight: '600', textAlign: 'center' },
  txCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  txIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  txIconCredit: { backgroundColor: COLORS.successLight },
  txIconDebit: { backgroundColor: COLORS.gray100 },
  txInfo: { flex: 1 },
  txDesc: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray900 },
  txDate: { fontSize: SIZES.xs, color: COLORS.gray500, marginTop: 2 },
  txAmount: { fontSize: SIZES.sm, fontWeight: '700' },
  txCredit: { color: COLORS.success },
  txDebit: { color: COLORS.gray800 },
  emptyTx: { alignItems: 'center', paddingVertical: 32 },
  emptyTxText: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.gray700 },
  emptyTxSub: { fontSize: SIZES.sm, color: COLORS.gray400, marginTop: 4 },
});

export default HomeScreen;
