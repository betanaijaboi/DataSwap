import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, NETWORKS, AIRTIME_DENOMINATIONS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { validatePhone, validateAmount } from '../../utils/validators';
import { useWallet } from '../../context/WalletContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

const BuyAirtimeScreen = ({ navigation }) => {
  const { buyAirtime, balance } = useWallet();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!selectedNetwork) e.network = 'Select a network';
    if (!validatePhone(phone)) e.phone = 'Enter a valid Nigerian phone number';
    const amtCheck = validateAmount(amount, 50, 50000);
    if (!amtCheck.valid) e.amount = amtCheck.error;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePurchase = async () => {
    if (!validate()) return;
    const numAmount = parseFloat(amount);
    if (balance < numAmount) {
      Alert.alert('Insufficient Balance', 'Fund your wallet to continue.', [
        { text: 'Fund Wallet', onPress: () => navigation.navigate('FundWallet') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await buyAirtime(selectedNetwork.id, numAmount, phone);
      if (res.success) {
        navigation.navigate('Success', {
          title: 'Airtime Purchase Successful!',
          message: res.message,
          details: [
            { label: 'Network', value: selectedNetwork.name },
            { label: 'Phone', value: phone },
            { label: 'Amount', value: formatCurrency(numAmount) },
            { label: 'New Balance', value: formatCurrency(balance - numAmount) },
          ],
        });
      } else {
        Alert.alert('Purchase Failed', res.error);
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
        <Text style={styles.navTitle}>Buy Airtime</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.balanceChip}>
        <Ionicons name="wallet-outline" size={14} color={COLORS.primary} />
        <Text style={styles.balanceChipText}>Balance: {formatCurrency(balance)}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel}>Select Network</Text>
        <View style={styles.networksRow}>
          {NETWORKS.map((network) => (
            <TouchableOpacity
              key={network.id}
              style={[
                styles.networkChip,
                { borderColor: network.color },
                selectedNetwork?.id === network.id && { backgroundColor: network.color },
              ]}
              onPress={() => { setSelectedNetwork(network); setErrors((e) => ({ ...e, network: '' })); }}
              activeOpacity={0.7}
            >
              <Text style={styles.networkEmoji}>{network.logo}</Text>
              <Text style={[styles.networkChipText, selectedNetwork?.id === network.id && styles.networkChipTextActive]}>
                {network.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.network && <Text style={styles.fieldError}>{errors.network}</Text>}

        <Input
          label="Recipient Phone Number"
          value={phone}
          onChangeText={(v) => { setPhone(v); setErrors((e) => ({ ...e, phone: '' })); }}
          placeholder="e.g. 08012345678"
          keyboardType="phone-pad"
          error={errors.phone}
          leftIcon={<Ionicons name="call-outline" size={18} color={COLORS.gray500} />}
          style={styles.input}
        />

        <Text style={styles.sectionLabel}>Amount</Text>
        <View style={styles.denominationGrid}>
          {AIRTIME_DENOMINATIONS.map((den) => (
            <TouchableOpacity
              key={den}
              style={[styles.denChip, amount === String(den) && styles.denChipActive]}
              onPress={() => { setAmount(String(den)); setErrors((e) => ({ ...e, amount: '' })); }}
            >
              <Text style={[styles.denText, amount === String(den) && styles.denTextActive]}>
                ₦{den.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Or Enter Custom Amount"
          value={amount}
          onChangeText={(v) => { setAmount(v); setErrors((e) => ({ ...e, amount: '' })); }}
          placeholder="Min ₦50"
          keyboardType="numeric"
          error={errors.amount}
          leftIcon={<Text style={styles.nairaIcon}>₦</Text>}
        />

        <View style={styles.warningBox}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
          <Text style={styles.warningText}>
            Verify the phone number and network before purchasing. Airtime purchases are final.
          </Text>
        </View>

        <Button
          title={amount ? `Pay ${formatCurrency(parseFloat(amount) || 0)}` : 'Pay Airtime'}
          onPress={handlePurchase}
          loading={loading}
          disabled={!amount || !phone || !selectedNetwork}
          style={styles.payBtn}
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
  balanceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EBF2FF', margin: 16, marginBottom: 0,
    padding: 8, paddingHorizontal: 14, borderRadius: 20, alignSelf: 'flex-start',
  },
  balanceChipText: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  sectionLabel: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray700, marginBottom: 10, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  networksRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  networkChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    borderWidth: 2, backgroundColor: COLORS.white,
  },
  networkEmoji: { fontSize: 16 },
  networkChipText: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray700 },
  networkChipTextActive: { color: COLORS.white },
  fieldError: { color: COLORS.error, fontSize: SIZES.xs, marginTop: 4, marginBottom: 8 },
  input: { marginTop: 8 },
  denominationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  denChip: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
    borderWidth: 2, borderColor: COLORS.gray300, backgroundColor: COLORS.white,
  },
  denChipActive: { borderColor: COLORS.primary, backgroundColor: '#EBF2FF' },
  denText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray700 },
  denTextActive: { color: COLORS.primary },
  nairaIcon: { fontSize: SIZES.base, color: COLORS.gray600, fontWeight: '700' },
  warningBox: {
    flexDirection: 'row', gap: 8, backgroundColor: '#EBF2FF',
    padding: 12, borderRadius: SIZES.radiusSm, marginBottom: 16,
  },
  warningText: { flex: 1, fontSize: SIZES.xs, color: COLORS.primaryDark, lineHeight: 18 },
  payBtn: {},
});

export default BuyAirtimeScreen;
