import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../../utils/constants';
import { validatePhone } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

const LoginScreen = ({ navigation }) => {
  const { login, biometricEnabled, authenticateWithBiometric, hasPIN } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!validatePhone(phone)) e.phone = 'Enter a valid Nigerian phone number';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await login({ phone, password });
      if (res.success) {
        navigation.replace('PINSetup');
      } else if (res.requiresOTP) {
        navigation.navigate('OTP', { phone, mode: 'verify' });
      } else {
        setErrors({ general: res.error });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    const result = await authenticateWithBiometric();
    if (result.success) {
      navigation.replace('MainApp');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await login({ phone: '08000000000', password: 'Demo@1234' });
      if (res.success) navigation.replace('PINSetup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={['#0D47A1', '#1565C0']} style={styles.topBar}>
          <View style={styles.logoRow}>
            <Ionicons name="flash" size={32} color={COLORS.white} />
            <Text style={styles.logoText}>DataSwap</Text>
          </View>
          <Text style={styles.tagline}>Nigeria's Data & Airtime Marketplace</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your DataSwap account</Text>

          {errors.general && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={COLORS.error} />
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="080XXXXXXXX"
            keyboardType="phone-pad"
            error={errors.phone}
            leftIcon={<Ionicons name="call-outline" size={18} color={COLORS.gray500} />}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={COLORS.gray500} />}
          />

          <TouchableOpacity
            style={styles.forgotRow}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          {biometricEnabled && (
            <Button
              title="Use Biometric Login"
              onPress={handleBiometric}
              variant="outline"
              icon={<Ionicons name="finger-print-outline" size={18} color={COLORS.primary} />}
              style={styles.bioBtn}
            />
          )}

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>
              New to DataSwap? <Text style={styles.registerLink}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo account banner */}
        <TouchableOpacity style={styles.demoBanner} onPress={handleDemoLogin} activeOpacity={0.8}>
          <View style={styles.demoBannerLeft}>
            <View style={styles.demoBannerIconBox}>
              <Ionicons name="flask-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.demoBannerTitle}>Try Demo Account</Text>
              <Text style={styles.demoBannerSub}>Explore all features — no real data needed</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.gray500} />
          <Text style={styles.securityText}>
            256-bit encryption · CBN-compliant · KYC-verified
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1 },
  topBar: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: SIZES.paddingLg,
    alignItems: 'center',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  logoText: { fontSize: 32, fontWeight: '900', color: COLORS.white },
  tagline: { color: 'rgba(255,255,255,0.8)', fontSize: SIZES.sm },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    margin: 16,
    padding: 24,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.gray900, marginBottom: 4 },
  subtitle: { fontSize: SIZES.sm, color: COLORS.gray500, marginBottom: 20 },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.errorLight, padding: 12,
    borderRadius: SIZES.radiusSm, marginBottom: 16,
  },
  errorBannerText: { color: COLORS.error, fontSize: SIZES.sm, flex: 1 },
  forgotRow: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 20 },
  forgotText: { color: COLORS.primary, fontSize: SIZES.sm, fontWeight: '600' },
  loginBtn: { marginBottom: 12 },
  bioBtn: { marginBottom: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.gray200 },
  dividerText: { color: COLORS.gray400, fontSize: SIZES.xs, fontWeight: '600' },
  registerText: { textAlign: 'center', color: COLORS.gray600, fontSize: SIZES.sm },
  registerLink: { color: COLORS.primary, fontWeight: '700' },
  demoBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#EBF2FF', marginHorizontal: 16, marginBottom: 8,
    padding: 14, borderRadius: SIZES.radius,
    borderWidth: 1, borderColor: '#C5D8FF',
  },
  demoBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  demoBannerIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#D6E8FF', alignItems: 'center', justifyContent: 'center',
  },
  demoBannerTitle: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.primary },
  demoBannerSub: { fontSize: SIZES.xs, color: COLORS.gray500, marginTop: 1 },
  securityNote: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: 16,
  },
  securityText: { fontSize: SIZES.xs, color: COLORS.gray400 },
});

export default LoginScreen;
