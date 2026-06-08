import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import PINInput from '../../components/PINInput';

const PINSetupScreen = ({ navigation }) => {
  const { setPIN, enableBiometric, hasPIN } = useAuth();
  const [step, setStep] = useState('set'); // 'set' | 'confirm'
  const [firstPIN, setFirstPIN] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFirstPIN = (pin) => {
    setFirstPIN(pin);
    setStep('confirm');
    setError('');
  };

  const handleConfirm = async (pin) => {
    if (pin !== firstPIN) {
      setError('PINs do not match. Please try again.');
      setStep('set');
      setFirstPIN('');
      return;
    }
    setLoading(true);
    try {
      await setPIN(pin);
      setStep('biometric');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableBiometric = async () => {
    const result = await enableBiometric();
    if (result.success) {
      Alert.alert('Biometric Enabled', 'You can now log in with Face ID or fingerprint.');
    }
    navigation.replace('MainApp');
  };

  if (step === 'biometric') {
    return (
      <View style={styles.container}>
        <View style={styles.iconBox}>
          <Ionicons name="checkmark-circle-outline" size={56} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>PIN Set Successfully!</Text>
        <Text style={styles.subtitle}>
          Want to enable biometric login for faster, more secure access?
        </Text>
        <Button
          title="Enable Biometric Login"
          onPress={handleEnableBiometric}
          icon={<Ionicons name="finger-print-outline" size={20} color={COLORS.white} />}
          style={styles.btn}
        />
        <Button
          title="Skip for now"
          variant="ghost"
          onPress={() => navigation.replace('MainApp')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!hasPIN && (
        <View style={styles.skipRow}>
          <TouchableOpacity onPress={() => navigation.replace('MainApp')}>
            <Text style={styles.skipText}>Set up later</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.iconBox}>
        <Ionicons
          name={step === 'set' ? 'keypad-outline' : 'lock-closed-outline'}
          size={56}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.title}>
        {step === 'set' ? 'Create Your 4-Digit PIN' : 'Confirm Your PIN'}
      </Text>
      <Text style={styles.subtitle}>
        {step === 'set'
          ? 'This PIN protects your wallet and transactions. Keep it private.'
          : 'Re-enter your PIN to confirm. Make sure it matches.'}
      </Text>

      <PINInput
        length={4}
        onComplete={step === 'set' ? handleFirstPIN : handleConfirm}
        error={error}
        label={step === 'set' ? 'Enter PIN' : 'Confirm PIN'}
      />

      {step === 'confirm' && (
        <Button
          title="Back"
          variant="ghost"
          onPress={() => { setStep('set'); setFirstPIN(''); setError(''); }}
          style={styles.backBtn}
        />
      )}

      <View style={styles.tipBox}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
        <Text style={styles.tipText}>
          Your PIN is required to confirm every transaction. Never share it with anyone.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.background, padding: SIZES.paddingLg,
    alignItems: 'center', justifyContent: 'center',
  },
  skipRow: { position: 'absolute', top: 52, right: SIZES.padding },
  skipText: { color: COLORS.primary, fontSize: SIZES.sm, fontWeight: '600' },
  iconBox: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#EBF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  title: {
    fontSize: SIZES.xl, fontWeight: '800', color: COLORS.gray900,
    textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontSize: SIZES.sm, color: COLORS.gray500, textAlign: 'center',
    lineHeight: 20, marginBottom: 40, maxWidth: 280,
  },
  btn: { width: '100%', marginBottom: 12 },
  backBtn: { marginTop: 20 },
  tipBox: {
    flexDirection: 'row', gap: 8, backgroundColor: '#EBF2FF',
    padding: 14, borderRadius: SIZES.radius, marginTop: 40, maxWidth: 320,
  },
  tipText: { flex: 1, fontSize: SIZES.xs, color: COLORS.primaryDark, lineHeight: 18 },
});

export default PINSetupScreen;
