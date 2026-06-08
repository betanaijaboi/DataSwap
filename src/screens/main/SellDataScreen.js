import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, NETWORKS, DATA_PLANS, SELL_RATE } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { useWallet } from '../../context/WalletContext';
import Button from '../../components/Button';

const SellDataScreen = ({ navigation }) => {
  const { sellData, balance } = useWallet();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('network');

  const plans = selectedNetwork ? DATA_PLANS[selectedNetwork.id] : [];

  const handleSell = async () => {
    Alert.alert(
      'Confirm Sale',
      `Sell ${quantity}× ${selectedNetwork.name} ${selectedPlan.size} data for ${formatCurrency(selectedPlan.sellPrice * quantity)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sell Now',
          onPress: async () => {
            setLoading(true);
            try {
              const res = await sellData(selectedNetwork.id, selectedPlan.id, quantity);
              if (res.success) {
                navigation.navigate('Success', {
                  title: 'Data Sold Successfully!',
                  message: res.message,
                  details: [
                    { label: 'Network', value: selectedNetwork.name },
                    { label: 'Plan', value: `${selectedPlan.size} (${selectedPlan.duration})` },
                    { label: 'Quantity', value: `${quantity}` },
                    { label: 'Amount Credited', value: formatCurrency(res.creditAmount) },
                    { label: 'New Balance', value: formatCurrency(balance + res.creditAmount) },
                  ],
                });
              } else {
                Alert.alert('Sale Failed', res.error);
              }
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const back = () => {
    if (step === 'plan') { setStep('network'); setSelectedNetwork(null); }
    else if (step === 'confirm') { setStep('plan'); setSelectedPlan(null); setQuantity(1); }
    else navigation.goBack();
  };

  const creditAmount = selectedPlan ? selectedPlan.sellPrice * quantity : 0;
  const marketValue = selectedPlan ? selectedPlan.price * quantity : 0;

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={back} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray900} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Sell Data</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Rate info banner */}
      <View style={styles.rateBanner}>
        <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
        <Text style={styles.rateBannerText}>
          We buy data at <Text style={styles.rateHighlight}>{Math.round(SELL_RATE * 100)}% of market price</Text>.
          Cash is instantly credited to your wallet.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 'network' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select Network</Text>
            {NETWORKS.map((network) => (
              <TouchableOpacity
                key={network.id}
                style={[styles.networkCard, { borderColor: network.color }]}
                onPress={() => { setSelectedNetwork(network); setStep('plan'); }}
                activeOpacity={0.7}
              >
                <View style={[styles.networkLogoBox, { backgroundColor: network.color }]}>
                  <Image source={network.logo} style={[styles.networkLogoImg, network.logoTint && { tintColor: network.logoTint }]} resizeMode="contain" />
                </View>
                <View style={styles.networkInfo}>
                  <Text style={[styles.networkName, { color: network.color === '#FFCC00' ? '#000' : network.color }]}>{network.name}</Text>
                  <Text style={styles.networkSub}>Tap to see available plans</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 'plan' && (
          <View style={styles.section}>
            <View style={styles.networkBadge}>
              <View style={[styles.selectedNetworkLogoBox, { backgroundColor: selectedNetwork.color }]}>
                <Image source={selectedNetwork.logo} style={[styles.selectedNetworkLogoImg, selectedNetwork.logoTint && { tintColor: selectedNetwork.logoTint }]} resizeMode="contain" />
              </View>
              <Text style={styles.networkBadgeText}>{selectedNetwork.name}</Text>
            </View>
            <Text style={styles.sectionLabel}>Choose Plan to Sell</Text>
            {plans.map((plan) => {
              const youGet = plan.sellPrice;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planCard}
                  onPress={() => { setSelectedPlan(plan); setStep('confirm'); }}
                  activeOpacity={0.7}
                >
                  <View style={styles.planLeft}>
                    <Text style={styles.planSize}>{plan.size}</Text>
                    <Text style={styles.planDuration}>{plan.duration}</Text>
                    <Text style={styles.planMarket}>Market: {formatCurrency(plan.price)}</Text>
                  </View>
                  <View style={styles.planRight}>
                    <Text style={styles.planYouGet}>You get</Text>
                    <Text style={styles.planSellPrice}>{formatCurrency(youGet)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {step === 'confirm' && (
          <View style={styles.section}>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>Sale Summary</Text>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Network</Text>
                <Text style={styles.confirmValue}>{selectedNetwork.name}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Plan</Text>
                <Text style={styles.confirmValue}>{selectedPlan.size} ({selectedPlan.duration})</Text>
              </View>
              <View style={styles.divider} />

              {/* Quantity selector */}
              <View style={styles.quantityRow}>
                <Text style={styles.confirmLabel}>Quantity</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Ionicons name="remove" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityValue}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => setQuantity((q) => Math.min(100, q + 1))}
                  >
                    <Ionicons name="add" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Market Value</Text>
                <Text style={styles.confirmValue}>{formatCurrency(marketValue)}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Buy Rate</Text>
                <Text style={styles.confirmValue}>{Math.round(SELL_RATE * 100)}%</Text>
              </View>
              <View style={[styles.confirmRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>You Receive</Text>
                <Text style={styles.totalValue}>{formatCurrency(creditAmount)}</Text>
              </View>
            </View>

            <View style={styles.noticeBox}>
              <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
              <Text style={styles.noticeText}>
                Funds are credited to your DataSwap wallet instantly. You can withdraw to your bank any time.
              </Text>
            </View>

            <Button
              title={`Sell for ${formatCurrency(creditAmount)}`}
              onPress={handleSell}
              loading={loading}
              style={styles.sellBtn}
            />
            <Button
              title="Change Plan"
              variant="outline"
              onPress={() => { setStep('plan'); setSelectedPlan(null); setQuantity(1); }}
            />
          </View>
        )}
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
  rateBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#E8F5E9', margin: 16, padding: 14, borderRadius: SIZES.radius,
  },
  rateBannerText: { flex: 1, fontSize: SIZES.sm, color: COLORS.gray700, lineHeight: 20 },
  rateHighlight: { color: COLORS.success, fontWeight: '700' },
  section: { padding: SIZES.padding },
  sectionLabel: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  networkCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 10,
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
  networkInfo: { flex: 1 },
  networkName: { fontSize: SIZES.base, fontWeight: '700' },
  networkSub: { fontSize: SIZES.xs, color: COLORS.gray500, marginTop: 2 },
  networkBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.white, padding: 10, paddingHorizontal: 14,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.gray200,
  },
  networkBadgeText: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray800 },
  planCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.gray200,
  },
  planLeft: { gap: 2 },
  planSize: { fontSize: SIZES.lg, fontWeight: '800', color: COLORS.gray900 },
  planDuration: { fontSize: SIZES.xs, color: COLORS.gray500 },
  planMarket: { fontSize: SIZES.xs, color: COLORS.gray400, marginTop: 2 },
  planRight: { alignItems: 'flex-end', gap: 2 },
  planYouGet: { fontSize: SIZES.xs, color: COLORS.gray500 },
  planSellPrice: { fontSize: SIZES.base, fontWeight: '800', color: COLORS.success },
  confirmCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 16, gap: 12,
  },
  confirmTitle: { fontSize: SIZES.base, fontWeight: '800', color: COLORS.gray900 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  confirmLabel: { fontSize: SIZES.sm, color: COLORS.gray500 },
  confirmValue: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray900 },
  divider: { height: 1, backgroundColor: COLORS.gray200 },
  quantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  quantityBtn: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  quantityValue: { fontSize: SIZES.lg, fontWeight: '800', color: COLORS.gray900, minWidth: 24, textAlign: 'center' },
  totalRow: { paddingTop: 4 },
  totalLabel: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.gray900 },
  totalValue: { fontSize: SIZES.xl, fontWeight: '900', color: COLORS.success },
  noticeBox: {
    flexDirection: 'row', gap: 8,
    backgroundColor: COLORS.successLight, padding: 12, borderRadius: SIZES.radiusSm, marginBottom: 16,
  },
  noticeText: { flex: 1, fontSize: SIZES.xs, color: '#1B5E20', lineHeight: 18 },
  sellBtn: { marginBottom: 10 },
});

export default SellDataScreen;
