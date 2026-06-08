import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { validateAmount as valAmount } from '../../utils/validators';
import { useWallet } from '../../context/WalletContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

const PAYMENT_METHODS = [
  { id: 'card', iconName: 'card-outline', label: 'Debit/Credit Card', sub: 'Visa, Mastercard, Verve' },
  { id: 'transfer', iconName: 'business-outline', label: 'Bank Transfer', sub: 'Instant bank transfer' },
  { id: 'ussd', iconName: 'keypad-outline', label: 'USSD', sub: '*737#, *901# and more' },
];

const FundWalletScreen = ({ navigation }) => {
  const { fundWallet, balance } = useWallet();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const check = valAmount(amount, 100, 2000000);
    if (!check.valid) e.amount = check.error;
    if (!selectedMethod) e.method = 'Select a payment method';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFund = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const numAmount = parseFloat(amount);
      const res = await fundWallet(numAmount, selectedMethod);
      if (res.success) {
        navigation.navigate('Success', {
          title: 'Wallet Funded!',
          message: `₦${numAmount.toLocaleString()} has been added to your wallet.`,
          details: [
            { label: 'Amount', value: formatCurrency(numAmount) },
            { label: 'Method', value: selectedMethod.label },
            { label: 'New Balance', value: formatCurrency(balance + numAmount) },
          ],
        });
      } else {
        Alert.alert('Funding Failed', res.error || 'Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray900} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Fund Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* Current balance */}
        <View style={styles.currentBalance}>
          <Text style={styles.currentBalanceLabel}>Current Balance</Text>
          <Text style={styles.currentBalanceValue}>{formatCurrency(balance)}</Text>
        </View>

        {/* Amount */}
        <Text style={styles.sectionLabel}>Enter Amount</Text>
        <View style={styles.quickGrid}>
          {QUICK_AMOUNTS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.quickChip, amount === String(a) && styles.quickChipActive]}
              onPress={() => { setAmount(String(a)); setErrors((e) => ({ ...e, amount: '' })); }}
            >
              <Text style={[styles.quickText, amount === String(a) && styles.quickTextActive]}>
                ₦{a.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          value={amount}
          onChangeText={(v) => { setAmount(v); setErrors((e) => ({ ...e, amount: '' })); }}
          placeholder="Or type amount (min ₦100)"
          keyboardType="numeric"
          error={errors.amount}
          leftIcon={<Text style={styles.naira}>₦</Text>}
        />

        {/* Payment method */}
        <Text style={styles.sectionLabel}>Payment Method</Text>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, selectedMethod?.id === method.id && styles.methodCardActive]}
            onPress={() => { setSelectedMethod(method); setErrors((e) => ({ ...e, method: '' })); }}
          >
            <View style={styles.methodIconBox}>
              <Ionicons
                name={method.iconName}
                size={22}
                color={selectedMethod?.id === method.id ? COLORS.primary : COLORS.gray500}
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>{method.label}</Text>
              <Text style={styles.methodSub}>{method.sub}</Text>
            </View>
            <View style={[styles.radio, selectedMethod?.id === method.id && styles.radioActive]}>
              {selectedMethod?.id === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
        {errors.method && <Text style={styles.fieldError}>{errors.method}</Text>}

        <View style={styles.secureNote}>
          <Ionicons name="lock-closed-outline" size={14} color={COLORS.gray500} />
          <Text style={styles.secureText}>
            Secured by 256-bit SSL encryption. Powered by Paystack.
          </Text>
        </View>

        <Button
          title={amount ? `Fund ${formatCurrency(parseFloat(amount) || 0)}` : 'Fund Wallet'}
          onPress={handleFund}
          loading={loading}
          disabled={!amount || !selectedMethod}
        />
      </ScrollView>
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
  currentBalance: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius, padding: 20, marginBottom: 24, alignItems: 'center',
  },
  currentBalanceLabel: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  currentBalanceValue: { fontSize: SIZES.xxxl, fontWeight: '900', color: COLORS.white },
  sectionLabel: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  quickChip: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
    borderWidth: 2, borderColor: COLORS.gray300, backgroundColor: COLORS.white,
  },
  quickChipActive: { borderColor: COLORS.primary, backgroundColor: '#EBF2FF' },
  quickText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray700 },
  quickTextActive: { color: COLORS.primary },
  naira: { fontSize: SIZES.base, color: COLORS.gray600, fontWeight: '700' },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 10,
    borderWidth: 2, borderColor: COLORS.gray200,
  },
  methodCardActive: { borderColor: COLORS.primary, backgroundColor: '#EBF2FF' },
  methodIconBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center',
  },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray900 },
  methodSub: { fontSize: SIZES.xs, color: COLORS.gray500, marginTop: 2 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.gray400,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  fieldError: { color: COLORS.error, fontSize: SIZES.xs, marginTop: -6, marginBottom: 12 },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  secureText: { fontSize: SIZES.xs, color: COLORS.gray400, flex: 1 },
});

export default FundWalletScreen;
