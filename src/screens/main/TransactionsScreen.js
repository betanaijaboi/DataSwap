import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, TRANSACTION_TYPES } from '../../utils/constants';
import { formatCurrency, formatDate, getTransactionIconName, getTransactionLabel } from '../../utils/formatters';
import { useWallet } from '../../context/WalletContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: TRANSACTION_TYPES.BUY_DATA, label: 'Data' },
  { id: TRANSACTION_TYPES.BUY_AIRTIME, label: 'Airtime' },
  { id: TRANSACTION_TYPES.SELL_DATA, label: 'Sold' },
  { id: TRANSACTION_TYPES.FUND_WALLET, label: 'Funded' },
  { id: TRANSACTION_TYPES.WITHDRAW, label: 'Withdrawn' },
];

const TransactionsScreen = ({ navigation }) => {
  const { transactions, fetchTransactions, isLoadingTransactions } = useWallet();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = filter === 'all' ? transactions : transactions.filter((tx) => tx.type === filter);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const renderTransaction = ({ item: tx }) => (
    <View style={styles.txCard}>
      <View style={[styles.txIconBox, tx.amount > 0 ? styles.txIconCredit : styles.txIconDebit]}>
        <Ionicons
          name={getTransactionIconName(tx.type)}
          size={20}
          color={tx.amount > 0 ? COLORS.success : COLORS.gray600}
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txType}>{getTransactionLabel(tx.type)}</Text>
        <Text style={styles.txDesc} numberOfLines={2}>{tx.description}</Text>
        <Text style={styles.txDate}>{formatDate(tx.createdAt)}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, tx.amount > 0 ? styles.txCredit : styles.txDebit]}>
          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
        </Text>
        <View style={[styles.statusBadge, tx.status === 'success' ? styles.statusSuccess : styles.statusPending]}>
          <Text style={[styles.statusText, tx.status === 'success' ? styles.statusSuccessText : styles.statusPendingText]}>
            {tx.status === 'success' ? 'Success' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray900} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Transaction History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item.id && styles.filterChipActive]}
            onPress={() => setFilter(item.id)}
          >
            <Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.gray400} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySub}>
              {filter === 'all' ? 'Your transaction history will appear here.' : `No ${FILTERS.find(f => f.id === filter)?.label} transactions yet.`}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding, paddingTop: 52, paddingBottom: 12,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  navTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.gray900 },
  filterRow: { paddingHorizontal: SIZES.padding, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.gray300, backgroundColor: COLORS.white,
  },
  filterChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  filterText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray600 },
  filterTextActive: { color: COLORS.white },
  list: { padding: SIZES.padding, gap: 8 },
  txCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 14,
  },
  txIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  txIconCredit: { backgroundColor: COLORS.successLight },
  txIconDebit: { backgroundColor: COLORS.gray100 },
  txInfo: { flex: 1, gap: 2 },
  txType: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5 },
  txDesc: { fontSize: SIZES.sm, color: COLORS.gray900, fontWeight: '500', lineHeight: 18 },
  txDate: { fontSize: SIZES.xs, color: COLORS.gray400, marginTop: 2 },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: SIZES.sm, fontWeight: '800' },
  txCredit: { color: COLORS.success },
  txDebit: { color: COLORS.gray900 },
  statusBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10 },
  statusSuccess: { backgroundColor: COLORS.successLight },
  statusPending: { backgroundColor: COLORS.warningLight },
  statusText: { fontSize: 10, fontWeight: '700' },
  statusSuccessText: { color: COLORS.success },
  statusPendingText: { color: COLORS.warning },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.gray700 },
  emptySub: { fontSize: SIZES.sm, color: COLORS.gray400, textAlign: 'center', marginTop: 8, maxWidth: 260 },
});

export default TransactionsScreen;
