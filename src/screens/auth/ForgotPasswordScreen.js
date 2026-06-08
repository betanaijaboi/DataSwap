import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/constants';
import { validatePhone } from '../../utils/validators';
import { authService } from '../../services/authService';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ForgotPasswordScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestReset = async () => {
    if (!validatePhone(phone)) { setError('Enter a valid Nigerian phone number'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authService.forgotPassword(phone);
      if (res.success) setStep('reset');
      else setError(res.error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!otp || otp.length < 6) { setError('Enter the 6-digit OTP'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authService.resetPassword(phone, otp, newPassword);
      if (res.success) {
        Alert.alert('Success', 'Password reset successfully. Please log in.', [
          { text: 'Log In', onPress: () => navigation.replace('Login') },
        ]);
      } else {
        setError(res.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.iconBox}>
          <Ionicons
            name={step === 'phone' ? 'lock-open-outline' : 'lock-closed-outline'}
            size={40}
            color={COLORS.primary}
          />
        </View>
        <Text style={styles.title}>
          {step === 'phone' ? 'Forgot Password?' : 'Reset Password'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? "Enter your registered phone number. We'll send you a reset code."
            : `Enter the OTP sent to ****${phone.slice(-4)} and set a new password.`}
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {step === 'phone' ? (
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={(v) => { setPhone(v); setError(''); }}
            placeholder="080XXXXXXXX"
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={COLORS.gray500} />}
          />
        ) : (
          <>
            <Input
              label="OTP Code"
              value={otp}
              onChangeText={(v) => { setOtp(v.replace(/\D/g, '')); setError(''); }}
              placeholder="6-digit OTP"
              keyboardType="number-pad"
              maxLength={6}
              leftIcon={<Ionicons name="key-outline" size={18} color={COLORS.gray500} />}
            />
            <Input
              label="New Password"
              value={newPassword}
              onChangeText={(v) => { setNewPassword(v); setError(''); }}
              placeholder="Min. 8 characters"
              secureTextEntry
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={COLORS.gray500} />}
            />
          </>
        )}

        <Button
          title={step === 'phone' ? 'Send Reset Code' : 'Reset Password'}
          onPress={step === 'phone' ? requestReset : resetPassword}
          loading={loading}
          style={styles.btn}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backToLogin}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  subtitle: { fontSize: SIZES.sm, color: COLORS.gray500, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.errorLight, padding: 12,
    borderRadius: SIZES.radiusSm, marginBottom: 16,
  },
  errorText: { color: COLORS.error, fontSize: SIZES.sm, flex: 1 },
  btn: { marginTop: 8, marginBottom: 16 },
  backToLogin: { textAlign: 'center', color: COLORS.primary, fontSize: SIZES.sm, fontWeight: '600' },
});

export default ForgotPasswordScreen;
