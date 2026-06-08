import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/Button';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const OTPScreen = ({ navigation, route }) => {
  const { phone, mode } = route.params;
  const { verifyOTP } = useAuth();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startCountdown();
    return () => clearInterval(timerRef.current);
  }, []);

  const startCountdown = () => {
    setCountdown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 12, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleVerify = async (code = otp) => {
    if (code.length < OTP_LENGTH) {
      setError('Enter the full 6-digit OTP');
      shake();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await verifyOTP(phone, code);
      if (res.success) {
        if (mode === 'register') {
          navigation.navigate('KYC');
        } else {
          navigation.replace('PINSetup');
        }
      } else {
        setError(res.error || 'Invalid OTP. Try again.');
        shake();
        setOtp('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(digits);
    setError('');
    if (digits.length === OTP_LENGTH) handleVerify(digits);
  };

  const handleResend = async () => {
    setResending(true);
    setOtp('');
    setError('');
    try {
      await authService.resendOTP(phone);
      startCountdown();
    } finally {
      setResending(false);
    }
  };

  const maskedPhone = `****${phone.slice(-4)}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <View style={styles.iconBox}>
        <Ionicons name="chatbubble-ellipses-outline" size={40} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Verify Your Phone</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to{'\n'}
        <Text style={styles.phone}>{maskedPhone}</Text>
      </Text>
      <Text style={styles.devHint}>[Dev mode: use 123456]</Text>

      <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <TouchableOpacity key={i} onPress={() => inputRef.current?.focus()} activeOpacity={1}>
            <View
              style={[
                styles.otpBox,
                otp.length === i && styles.otpBoxActive,
                otp[i] && styles.otpBoxFilled,
                error && styles.otpBoxError,
              ]}
            >
              <Text style={styles.otpDigit}>{otp[i] || ''}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <TextInput
        ref={inputRef}
        value={otp}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        style={styles.hiddenInput}
        autoFocus
        caretHidden
      />

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button
        title="Verify OTP"
        onPress={() => handleVerify()}
        loading={loading}
        disabled={otp.length < OTP_LENGTH}
        style={styles.verifyBtn}
      />

      <View style={styles.resendRow}>
        {countdown > 0 ? (
          <Text style={styles.resendCountdown}>
            Resend OTP in <Text style={styles.countdown}>{countdown}s</Text>
          </Text>
        ) : (
          <Button
            title={resending ? 'Sending...' : 'Resend OTP'}
            variant="ghost"
            onPress={handleResend}
            loading={resending}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.paddingLg, paddingTop: 60 },
  backBtn: { marginBottom: 24, width: 40, height: 40, justifyContent: 'center' },
  iconBox: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 20,
  },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.gray900, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: SIZES.base, color: COLORS.gray600, textAlign: 'center', lineHeight: 22, marginBottom: 4 },
  phone: { fontWeight: '700', color: COLORS.primary },
  devHint: { fontSize: SIZES.xs, color: COLORS.warning, textAlign: 'center', marginBottom: 28 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
  otpBox: {
    width: 48, height: 56, borderRadius: SIZES.radiusSm,
    borderWidth: 2, borderColor: COLORS.gray300,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
  },
  otpBoxActive: { borderColor: COLORS.primary },
  otpBoxFilled: { borderColor: COLORS.primary, backgroundColor: '#EBF2FF' },
  otpBoxError: { borderColor: COLORS.error },
  otpDigit: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.gray900 },
  hiddenInput: { position: 'absolute', opacity: 0, height: 0, width: 0 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 12 },
  errorText: { color: COLORS.error, fontSize: SIZES.sm },
  verifyBtn: { marginTop: 8 },
  resendRow: { alignItems: 'center', marginTop: 16 },
  resendCountdown: { color: COLORS.gray500, fontSize: SIZES.sm },
  countdown: { color: COLORS.primary, fontWeight: '700' },
});

export default OTPScreen;
