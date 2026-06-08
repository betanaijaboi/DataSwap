import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, NETWORKS, DATA_PLANS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { validatePhone } from '../../utils/validators';
import { useWallet } from '../../context/WalletContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

const BuyDataScreen = ({ navigation }) => {
  const { buyData, balance } = useWallet();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('network'); // 'network' | 'plan' | 'confirm'

  const plans = selectedNetwork ? DATA_PLANS[selectedNetwork.id] : [];

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    setSelectedPlan(null);
    setStep('plan');
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep('confirm');
  };

  const handlePurchase = async () => {
    if (!validatePhone(phone)) {
      setPhoneError('Enter a valid Nigerian phone number');
      return;
    }
    if (balance < selectedPlan.price) {
      Alert.alert('Insufficient Balance', 'Please fund your wallet to continue.', [
        { text: 'Fund Wallet', onPress: () => navigation.navigate('FundWallet') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await buyData(selectedNetwork.id, selectedPlan.id, phone);
      if (res.success) {
        navigation.navigate('Success', {
          title: 'Data Purchase Successful!',
          message: res.message,
          details: [
            { label: 'Network', value: selectedNetwork.name },
            { label: 'Plan', value: `${selectedPlan.size} (${selectedPlan.duration})` },
            { label: 'Phone', value: phone },
            { label: 'Amount Paid', value: formatCurrency(selectedPlan.price) },
            { label: 'New Balance', value: formatCurrency(balance - selectedPlan.price) },
          ],
        });
      } else {
        Alert.alert('Purchase Failed', res.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    if (step === 'plan') { setStep('network'); setSelectedNetwork(null); }
    else if (step === 'confirm') { setStep('plan'); setSelectedPlan(null); }
    else navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={back} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray900} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Buy Data</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Balance chip */}
      <View style={styles.balanceChip}>
        <Ionicons name="wallet-outline" size={14} color={COLORS.primary} />
        <Text style={styles.balanceChipText}>Balance: {formatCurrency(balance)}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Step: Network */}
        {step === 'network' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select Network</Text>
            <View style={styles.networkGrid}>
              {NETWORKS.map((network) => (
                <TouchableOpacity
                  key={network.id}
                  style={[styles.networkCard, { borderColor: network.color }]}
                  onPress={() => handleNetworkSelect(network)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.networkLogoBox, { backgroundColor: network.color }]}>
                    <Image source={network.logo} style={[styles.networkLogoImg, network.logoTint && { tintColor: network.logoTint }]} resizeMode="contain" />
                  </View>
                  <Text style={[styles.networkName, { color: network.color === '#FFCC00' ? '#000' : network.color }]}>{network.name}</Text>
                  <Ionicons name="chevron-forward" size={14} color={network.color} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step: Plan */}
        {step === 'plan' && (
          <View style={styles.section}>
            <View style={styles.selectedNetworkBadge}>
              <View style={[styles.selectedNetworkLogoBox, { backgroundColor: selectedNetwork.color }]}>
                <Image source={selectedNetwork.logo} style={[styles.selectedNetworkLogoImg, selectedNetwork.logoTint && { tintColor: selectedNetwork.logoTint }]} resizeMode="contain" />
              </View>
              <Text style={styles.selectedNetworkText}>{selectedNetwork.name}</Text>
            </View>
            <Text style={styles.sectionLabel}>Select Data Plan</Text>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
                onPress={() => handlePlanSelect(plan)}
                activeOpacity={0.7}
              >
                <View style={styles.planLeft}>
                  <Text style={styles.planSize}>{plan.size}</Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
                <View style={styles.planRight}>
                  <Text style={styles.planPrice}>{formatCurrency(plan.price)}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <View style={styles.section}>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>Order Summary</Text>
              <View style={styles.confirmRows}>
                <ConfirmRow label="Network" value={selectedNetwork.name} />
                <ConfirmRow label="Plan" value={`${selectedPlan.size} (${selectedPlan.duration})`} />
                <ConfirmRow label="Amount" value={formatCurrency(selectedPlan.price)} highlight />
              </View>
            </View>

            <Input
              label="Recipient Phone Number"
              value={phone}
              onChangeText={(v) => { setPhone(v); setPhoneError(''); }}
              placeholder="e.g. 08012345678"
              keyboardType="phone-pad"
              error={phoneError}
              leftIcon={<Ionicons name="call-outline" size={18} color={COLORS.gray500} />}
            />

            <View style={styles.warningBox}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
              <Text style={styles.warningText}>
                Ensure the phone number and network are correct. Data purchases cannot be reversed.
              </Text>
            </View>

            {balance < selectedPlan.price && (
              <View style={styles.insufficientBox}>
                <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
                <Text style={styles.insufficientText}>
                  Insufficient balance. You need {formatCurrency(selectedPlan.price - balance)} more.
                </Text>
              </View>
            )}

            <Button
              title={`Pay ${formatCurrency(selectedPlan.price)}`}
              onPress={handlePurchase}
              loading={loading}
              disabled={balance < selectedPlan.price}
              style={styles.payBtn}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const ConfirmRow = ({ label, value, highlight }) => (
  <View style={styles.confirmRow}>
    <Text style={styles.confirmLabel}>{label}</Text>
    <Text style={[styles.confirmValue, highlight && styles.confirmValueHighlight]}>{value}</Text>
  </View>
);

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
    backgroundColor: '#EBF2FF', margin: 16, marginBottom: 4,
    padding: 8, paddingHorizontal: 14, borderRadius: 20, alignSelf: 'flex-start',
  },
  balanceChipText: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  section: { padding: SIZES.padding },
  sectionLabel: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  networkGrid: { gap: 10 },
  networkCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16,
    borderWidth: 2,
  },
  networkLogoBox: {
    width: 52, height: 52, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', padding: 6,
  },
  networkLogoImg: { width: 40, height: 40 },
  selectedNetworkLogoBox: {
    width: 28, height: 28, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center', padding: 3,
  },
  selectedNetworkLogoImg: { width: 22, height: 22 },
  networkName: { flex: 1, fontSize: SIZES.base, fontWeight: '700' },
  selectedNetworkBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.white, padding: 10, paddingHorizontal: 14,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.gray200,
  },
  selectedNetworkText: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray800 },
  planCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.gray200,
  },
  planLeft: { gap: 2 },
  planSize: { fontSize: SIZES.lg, fontWeight: '800', color: COLORS.gray900 },
  planDuration: { fontSize: SIZES.xs, color: COLORS.gray500 },
  planRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planPrice: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.primary },
  confirmCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 16,
  },
  confirmTitle: { fontSize: SIZES.base, fontWeight: '800', color: COLORS.gray900, marginBottom: 14 },
  confirmRows: { gap: 10 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmLabel: { fontSize: SIZES.sm, color: COLORS.gray500 },
  confirmValue: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray900 },
  confirmValueHighlight: { color: COLORS.primary, fontSize: SIZES.base, fontWeight: '800' },
  warningBox: {
    flexDirection: 'row', gap: 8, backgroundColor: '#EBF2FF',
    padding: 12, borderRadius: SIZES.radiusSm, marginBottom: 16,
  },
  warningText: { flex: 1, fontSize: SIZES.xs, color: COLORS.primaryDark, lineHeight: 18 },
  insufficientBox: {
    flexDirection: 'row', gap: 8, backgroundColor: COLORS.errorLight,
    padding: 12, borderRadius: SIZES.radiusSm, marginBottom: 16,
  },
  insufficientText: { flex: 1, fontSize: SIZES.xs, color: COLORS.error, lineHeight: 18 },
  payBtn: { marginTop: 8 },
});

export default BuyDataScreen;
