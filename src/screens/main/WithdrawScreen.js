import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { validateAmount, validateAccountNumber } from '../../utils/validators';
import { useWallet } from '../../context/WalletContext';
import { walletService } from '../../services/walletService';
import Button from '../../components/Button';
import Input from '../../components/Input';

const MIN_WITHDRAWAL = 500;
const FEE_PERCENT = 0.01; // 1%

const WithdrawScreen = ({ navigation }) => {
  const { withdraw, balance } = useWallet();
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountName, setAccountName] = useState('');
  const [banks, setBanks] = useState([]);
  const [showBankList, setShowBankList] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const numAmount = parseFloat(amount) || 0;
  const fee = Math.min(Math.round(numAmount * FEE_PERCENT), 50); // cap at ₦50
  const youReceive = numAmount - fee;

  useEffect(() => {
    walletService.getBanks().then((res) => { if (res.success) setBanks(res.banks); });
  }, []);

  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      verifyAccount();
    } else {
      setAccountName('');
    }
  }, [accountNumber, selectedBank]);

  const verifyAccount = async () => {
    setVerifying(true);
    try {
      const res = await walletService.verifyAccountNumber(accountNumber, selectedBank.code);
      if (res.success) setAccountName(res.accountName);
      else setErrors((e) => ({ ...e, accountNumber: 'Could not verify account. Check the details.' }));
    } finally {
      setVerifying(false);
    }
  };

  const validate = () => {
    const e = {};
    const amtCheck = validateAmount(amount, MIN_WITHDRAWAL, balance);
    if (!amtCheck.valid) e.amount = amtCheck.error;
    if (!selectedBank) e.bank = 'Select your bank';
    if (!validateAccountNumber(accountNumber)) e.accountNumber = 'Enter a valid 10-digit NUBAN account number';
    if (!accountName) e.accountNumber = 'Account verification required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleWithdraw = async () => {
    if (!validate()) return;
    Alert.alert(
      'Confirm Withdrawal',
      `Send ${formatCurrency(youReceive)} to ${accountName} (${selectedBank.name})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const res = await withdraw(numAmount, {
                bankCode: selectedBank.code,
                bankName: selectedBank.name,
                accountNumber,
                accountName,
              });
              if (res.success) {
                navigation.navigate('Success', {
                  title: 'Withdrawal Initiated!',
                  message: `${formatCurrency(youReceive)} will be sent to your bank within 24 hours.`,
                  details: [
                    { label: 'Amount', value: formatCurrency(numAmount) },
                    { label: 'Fee', value: formatCurrency(fee) },
                    { label: 'You Receive', value: formatCurrency(youReceive) },
                    { label: 'Account', value: `${accountName} (${selectedBank.name})` },
                  ],
                });
              } else {
                Alert.alert('Withdrawal Failed', res.error);
              }
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const filteredBanks = banks.filter((b) => b.name.toLowerCase().includes(bankSearch.toLowerCase()));

  if (showBankList) {
    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => setShowBankList(false)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.gray900} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Select Bank</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.gray400} />
          <Input
            value={bankSearch}
            onChangeText={setBankSearch}
            placeholder="Search bank..."
            style={{ flex: 1, marginBottom: 0 }}
            inputStyle={{ paddingVertical: 8 }}
          />
        </View>
        <ScrollView>
          {filteredBanks.map((bank) => (
            <TouchableOpacity
              key={bank.code}
              style={styles.bankItem}
              onPress={() => { setSelectedBank(bank); setShowBankList(false); setBankSearch(''); }}
            >
              <Text style={styles.bankName}>{bank.name}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray900} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Withdraw</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
          <Text style={styles.balanceSub}>Min withdrawal: {formatCurrency(MIN_WITHDRAWAL)}</Text>
        </View>

        <Input
          label="Withdrawal Amount"
          value={amount}
          onChangeText={(v) => { setAmount(v); setErrors((e) => ({ ...e, amount: '' })); }}
          placeholder={`Min ${formatCurrency(MIN_WITHDRAWAL)}`}
          keyboardType="numeric"
          error={errors.amount}
          leftIcon={<Text style={styles.naira}>₦</Text>}
        />

        {numAmount > 0 && (
          <View style={styles.feeRow}>
            <View style={styles.feeItem}>
              <Text style={styles.feeLabel}>Processing Fee (1%)</Text>
              <Text style={styles.feeValue}>{formatCurrency(fee)}</Text>
            </View>
            <View style={styles.feeItem}>
              <Text style={[styles.feeLabel, { fontWeight: '700' }]}>You Receive</Text>
              <Text style={[styles.feeValue, { color: COLORS.success, fontWeight: '800' }]}>{formatCurrency(youReceive)}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.bankSelector}
          onPress={() => setShowBankList(true)}
        >
          <Ionicons name="business-outline" size={18} color={COLORS.gray500} />
          <Text style={[styles.bankSelectorText, selectedBank && styles.bankSelectorTextActive]}>
            {selectedBank ? selectedBank.name : 'Select Bank'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.gray400} />
        </TouchableOpacity>
        {errors.bank && <Text style={styles.fieldError}>{errors.bank}</Text>}

        <Input
          label="Account Number"
          value={accountNumber}
          onChangeText={(v) => {
            setAccountNumber(v.replace(/\D/g, ''));
            setAccountName('');
            setErrors((e) => ({ ...e, accountNumber: '' }));
          }}
          placeholder="10-digit NUBAN"
          keyboardType="number-pad"
          maxLength={10}
          error={errors.accountNumber}
          leftIcon={<Ionicons name="card-outline" size={18} color={COLORS.gray500} />}
          rightElement={verifying ? <Text style={styles.verifyingText}>Verifying...</Text> : null}
        />

        {accountName ? (
          <View style={styles.accountVerified}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            <Text style={styles.accountName}>{accountName}</Text>
          </View>
        ) : null}

        <View style={styles.secureNote}>
          <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.gray400} />
          <Text style={styles.secureText}>
            Withdrawals are processed within 24 hours on business days.
          </Text>
        </View>

        <Button
          title={`Withdraw ${numAmount > 0 ? formatCurrency(numAmount) : ''}`}
          onPress={handleWithdraw}
          loading={loading}
          disabled={!amount || !selectedBank || !accountName}
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
  balanceCard: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius, padding: 20,
    marginBottom: 20, alignItems: 'center',
  },
  balanceLabel: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  balanceValue: { fontSize: SIZES.xxxl, fontWeight: '900', color: COLORS.white, marginBottom: 4 },
  balanceSub: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.6)' },
  feeRow: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusSm, padding: 14, gap: 10, marginBottom: 16 },
  feeItem: { flexDirection: 'row', justifyContent: 'space-between' },
  feeLabel: { fontSize: SIZES.sm, color: COLORS.gray500 },
  feeValue: { fontSize: SIZES.sm, color: COLORS.gray800 },
  naira: { fontSize: SIZES.base, color: COLORS.gray600, fontWeight: '700' },
  bankSelector: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: COLORS.gray300, borderRadius: SIZES.radius,
    backgroundColor: COLORS.white, padding: 14, marginBottom: 8,
  },
  bankSelectorText: { flex: 1, fontSize: SIZES.base, color: COLORS.gray400 },
  bankSelectorTextActive: { color: COLORS.gray900, fontWeight: '600' },
  fieldError: { color: COLORS.error, fontSize: SIZES.xs, marginBottom: 8 },
  accountVerified: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.successLight, padding: 10, borderRadius: SIZES.radiusSm, marginTop: -8, marginBottom: 16,
  },
  accountName: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.success },
  verifyingText: { fontSize: SIZES.xs, color: COLORS.gray400 },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  secureText: { fontSize: SIZES.xs, color: COLORS.gray400, flex: 1 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.gray200,
  },
  bankItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  bankName: { fontSize: SIZES.base, color: COLORS.gray800 },
});

export default WithdrawScreen;
