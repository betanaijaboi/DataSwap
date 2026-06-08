import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/constants';
import { validateEmail, validatePassword, validatePhone, validateName } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!validateName(form.fullName)) e.fullName = 'Enter your full legal name';
    if (!validatePhone(form.phone)) e.phone = 'Enter a valid Nigerian phone number';
    if (!validateEmail(form.email)) e.email = 'Enter a valid email address';
    const pwCheck = validatePassword(form.password);
    if (!pwCheck.valid) e.password = pwCheck.errors[0];
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreed) e.agreed = 'Please agree to the Terms of Service';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await register({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });
      if (res.success) {
        navigation.navigate('OTP', { phone: form.phone, mode: 'register' });
      } else {
        setErrors({ general: res.error });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>DataSwap</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join thousands buying & selling data daily</Text>
        </View>

        {errors.general && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color={COLORS.error} />
            <Text style={styles.errorBannerText}>{errors.general}</Text>
          </View>
        )}

        <Input
          label="Full Name"
          value={form.fullName}
          onChangeText={set('fullName')}
          placeholder="As on your government ID"
          autoCapitalize="words"
          error={errors.fullName}
          leftIcon={<Ionicons name="person-outline" size={18} color={COLORS.gray500} />}
        />
        <Input
          label="Phone Number"
          value={form.phone}
          onChangeText={set('phone')}
          placeholder="080XXXXXXXX"
          keyboardType="phone-pad"
          error={errors.phone}
          leftIcon={<Ionicons name="call-outline" size={18} color={COLORS.gray500} />}
          hint="Must be a valid Nigerian number"
        />
        <Input
          label="Email Address"
          value={form.email}
          onChangeText={set('email')}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={errors.email}
          leftIcon={<Ionicons name="mail-outline" size={18} color={COLORS.gray500} />}
        />
        <Input
          label="Password"
          value={form.password}
          onChangeText={set('password')}
          placeholder="Min. 8 chars, upper, lower, symbol"
          secureTextEntry
          error={errors.password}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={COLORS.gray500} />}
        />
        <Input
          label="Confirm Password"
          value={form.confirmPassword}
          onChangeText={set('confirmPassword')}
          placeholder="Re-enter your password"
          secureTextEntry
          error={errors.confirmPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={COLORS.gray500} />}
        />

        <TouchableOpacity style={styles.checkRow} onPress={() => setAgreed((a) => !a)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
          </View>
          <Text style={styles.checkText}>
            I agree to DataSwap's{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {errors.agreed && <Text style={styles.fieldError}>{errors.agreed}</Text>}

        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
          style={styles.btn}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.paddingLg, paddingBottom: 40 },
  backBtn: { marginBottom: 16, width: 40, height: 40, justifyContent: 'center' },
  header: { marginBottom: 28 },
  logo: { fontSize: SIZES.xl, fontWeight: '900', color: COLORS.primary, marginBottom: 4 },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.gray900 },
  subtitle: { fontSize: SIZES.sm, color: COLORS.gray500, marginTop: 4 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.errorLight,
    padding: 12,
    borderRadius: SIZES.radiusSm,
    marginBottom: 16,
  },
  errorBannerText: { color: COLORS.error, fontSize: SIZES.sm, flex: 1 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 2, borderColor: COLORS.gray400,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkText: { flex: 1, fontSize: SIZES.sm, color: COLORS.gray600, lineHeight: 20 },
  link: { color: COLORS.primary, fontWeight: '600' },
  fieldError: { color: COLORS.error, fontSize: SIZES.xs, marginBottom: 12, marginTop: -4 },
  btn: { marginTop: 20, marginBottom: 16 },
  loginText: { textAlign: 'center', color: COLORS.gray600, fontSize: SIZES.sm },
  loginLink: { color: COLORS.primary, fontWeight: '700' },
});

export default RegisterScreen;
