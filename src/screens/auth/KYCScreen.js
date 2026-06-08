import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/constants';
import { validateBVN, validateNIN, validateDateOfBirth } from '../../utils/validators';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

const DOC_TYPES = [
  { id: 'nin', label: "National ID (NIN)", iconName: 'card-outline' },
  { id: 'passport', label: 'International Passport', iconName: 'book-outline' },
  { id: 'drivers', label: "Driver's License", iconName: 'car-outline' },
  { id: 'voters', label: "Voter's Card", iconName: 'people-outline' },
];

const STEPS = ['Personal Info', 'Documents', 'Selfie', 'Review'];

const KYCScreen = ({ navigation }) => {
  const { token, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    bvn: '',
    nin: '',
    dateOfBirth: '',
    address: '',
    docType: '',
    frontImage: null,
    backImage: null,
    selfie: null,
  });

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const pickImage = async (key) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: key === 'selfie' ? [1, 1] : [4, 3],
    });
    if (!result.canceled) {
      set(key)(result.assets[0].uri);
    }
  };

  const takePhoto = async (key) => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Please allow camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: key === 'selfie' ? [1, 1] : [4, 3],
    });
    if (!result.canceled) {
      set(key)(result.assets[0].uri);
    }
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!validateBVN(form.bvn)) e.bvn = 'BVN must be 11 digits';
      if (form.nin && !validateNIN(form.nin)) e.nin = 'NIN must be 11 digits';
      if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
      else if (!validateDateOfBirth(form.dateOfBirth)) e.dateOfBirth = 'You must be 18 or older';
      if (!form.address.trim() || form.address.length < 10) e.address = 'Enter your full residential address';
    }
    if (step === 1) {
      if (!form.docType) e.docType = 'Select a document type';
      if (!form.frontImage) e.frontImage = 'Upload the front of your document';
    }
    if (step === 2) {
      if (!form.selfie) e.selfie = 'Selfie is required for identity verification';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await authService.submitKYC(token, form);
      if (res.success) {
        await updateUser({ kycStatus: res.status });
        navigation.navigate('KYCPending');
      }
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadBox = ({ label, imageUri, onPickLibrary, onCamera, error }) => (
    <View style={styles.uploadBox}>
      <Text style={styles.uploadLabel}>{label}</Text>
      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.retakeBtn} onPress={onPickLibrary}>
            <Ionicons name="refresh-outline" size={16} color={COLORS.primary} />
            <Text style={styles.retakeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.uploadActions}>
          <TouchableOpacity style={styles.uploadAction} onPress={onCamera}>
            <Ionicons name="camera-outline" size={28} color={COLORS.primary} />
            <Text style={styles.uploadActionText}>Camera</Text>
          </TouchableOpacity>
          <View style={styles.uploadDivider} />
          <TouchableOpacity style={styles.uploadAction} onPress={onPickLibrary}>
            <Ionicons name="image-outline" size={28} color={COLORS.primary} />
            <Text style={styles.uploadActionText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
      {error && <Text style={styles.uploadError}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressHeader}>
        <TouchableOpacity onPress={() => step > 0 ? setStep((s) => s - 1) : navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>KYC Verification</Text>
          <Text style={styles.progressSub}>Step {step + 1} of {STEPS.length}: {STEPS[step]}</Text>
        </View>
      </View>

      <View style={styles.progressBarRow}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.progressSegment, i <= step && styles.progressSegmentActive]} />
        ))}
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconBox}>
                <Ionicons name="person-outline" size={36} color={COLORS.primary} />
              </View>
              <Text style={styles.stepTitle}>Personal Information</Text>
              <Text style={styles.stepSubtitle}>We need this to verify your identity and comply with CBN regulations.</Text>
            </View>
            <Input
              label="BVN (Bank Verification Number)"
              value={form.bvn}
              onChangeText={set('bvn')}
              placeholder="11-digit BVN"
              keyboardType="number-pad"
              maxLength={11}
              error={errors.bvn}
              hint="Your BVN is securely encrypted and only used for identity verification."
              leftIcon={<Ionicons name="card-outline" size={18} color={COLORS.gray500} />}
            />
            <Input
              label="NIN (Optional but recommended)"
              value={form.nin}
              onChangeText={set('nin')}
              placeholder="11-digit NIN"
              keyboardType="number-pad"
              maxLength={11}
              error={errors.nin}
              leftIcon={<Ionicons name="finger-print-outline" size={18} color={COLORS.gray500} />}
            />
            <Input
              label="Date of Birth"
              value={form.dateOfBirth}
              onChangeText={set('dateOfBirth')}
              placeholder="YYYY-MM-DD"
              keyboardType="default"
              error={errors.dateOfBirth}
              hint="You must be at least 18 years old"
              leftIcon={<Ionicons name="calendar-outline" size={18} color={COLORS.gray500} />}
            />
            <Input
              label="Residential Address"
              value={form.address}
              onChangeText={set('address')}
              placeholder="House No., Street, City, State"
              error={errors.address}
              multiline
              numberOfLines={3}
              leftIcon={<Ionicons name="location-outline" size={18} color={COLORS.gray500} />}
            />
          </View>
        )}

        {step === 1 && (
          <View>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconBox}>
                <Ionicons name="document-text-outline" size={36} color={COLORS.primary} />
              </View>
              <Text style={styles.stepTitle}>Identity Document</Text>
              <Text style={styles.stepSubtitle}>Upload a government-issued ID. Ensure it is clear and not expired.</Text>
            </View>
            <Text style={styles.fieldLabel}>Select Document Type</Text>
            <View style={styles.docTypeGrid}>
              {DOC_TYPES.map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  style={[styles.docTypeCard, form.docType === doc.id && styles.docTypeCardActive]}
                  onPress={() => set('docType')(doc.id)}
                >
                  <Ionicons
                    name={doc.iconName}
                    size={28}
                    color={form.docType === doc.id ? COLORS.primary : COLORS.gray500}
                  />
                  <Text style={[styles.docTypeLabel, form.docType === doc.id && styles.docTypeLabelActive]}>
                    {doc.label}
                  </Text>
                  {form.docType === doc.id && (
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={styles.docCheck} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.docType && <Text style={styles.fieldError}>{errors.docType}</Text>}

            <ImageUploadBox
              label="Front of Document"
              imageUri={form.frontImage}
              onCamera={() => takePhoto('frontImage')}
              onPickLibrary={() => pickImage('frontImage')}
              error={errors.frontImage}
            />
            {form.docType && form.docType !== 'passport' && (
              <ImageUploadBox
                label="Back of Document"
                imageUri={form.backImage}
                onCamera={() => takePhoto('backImage')}
                onPickLibrary={() => pickImage('backImage')}
              />
            )}
          </View>
        )}

        {step === 2 && (
          <View>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconBox}>
                <Ionicons name="camera-outline" size={36} color={COLORS.primary} />
              </View>
              <Text style={styles.stepTitle}>Selfie Verification</Text>
              <Text style={styles.stepSubtitle}>
                Take a clear selfie. Look straight at the camera. No sunglasses, hats, or masks.
              </Text>
            </View>
            <ImageUploadBox
              label="Take a Selfie"
              imageUri={form.selfie}
              onCamera={() => takePhoto('selfie')}
              onPickLibrary={() => pickImage('selfie')}
              error={errors.selfie}
            />
            <View style={styles.selfieGuide}>
              {['Face clearly visible', 'Good lighting', 'Plain background', 'No filters'].map((tip) => (
                <View key={tip} style={styles.guideLine}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
                  <Text style={styles.guideText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconBox}>
                <Ionicons name="checkmark-circle-outline" size={36} color={COLORS.primary} />
              </View>
              <Text style={styles.stepTitle}>Review & Submit</Text>
              <Text style={styles.stepSubtitle}>
                Please confirm your details before submitting for verification.
              </Text>
            </View>
            <View style={styles.reviewCard}>
              <ReviewRow label="BVN" value={`****${form.bvn.slice(-4)}`} />
              {form.nin && <ReviewRow label="NIN" value={`****${form.nin.slice(-4)}`} />}
              <ReviewRow label="Date of Birth" value={form.dateOfBirth} />
              <ReviewRow label="Document Type" value={DOC_TYPES.find((d) => d.id === form.docType)?.label || '-'} />
              <ReviewRow label="Front ID" value={form.frontImage ? 'Uploaded' : 'Missing'} />
              <ReviewRow label="Selfie" value={form.selfie ? 'Uploaded' : 'Missing'} />
            </View>
            <View style={styles.consentBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
              <Text style={styles.consentText}>
                By submitting, you consent to DataSwap processing your personal data for KYC verification
                in compliance with the Nigeria Data Protection Regulation (NDPR) and CBN guidelines.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step < STEPS.length - 1 ? (
          <Button title="Continue" onPress={next} />
        ) : (
          <Button title="Submit KYC" onPress={handleSubmit} loading={loading} />
        )}
      </View>
    </View>
  );
};

const ReviewRow = ({ label, value }) => (
  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  progressHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: SIZES.padding, paddingTop: 52,
  },
  progressInfo: { flex: 1 },
  progressLabel: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.gray900 },
  progressSub: { fontSize: SIZES.xs, color: COLORS.gray500 },
  progressBarRow: { flexDirection: 'row', gap: 4, paddingHorizontal: SIZES.padding, marginBottom: 8 },
  progressSegment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: COLORS.gray200 },
  progressSegmentActive: { backgroundColor: COLORS.primary },
  body: { flex: 1, padding: SIZES.padding },
  stepHeader: { alignItems: 'center', marginBottom: 24 },
  stepIconBox: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#EBF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  stepTitle: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.gray900, marginBottom: 8, textAlign: 'center' },
  stepSubtitle: { fontSize: SIZES.sm, color: COLORS.gray500, textAlign: 'center', lineHeight: 20 },
  fieldLabel: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  docTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  docTypeCard: {
    width: '47%', padding: 14, borderRadius: SIZES.radius,
    borderWidth: 2, borderColor: COLORS.gray200, backgroundColor: COLORS.white,
    alignItems: 'center', position: 'relative',
  },
  docTypeCardActive: { borderColor: COLORS.primary, backgroundColor: '#EBF2FF' },
  docTypeIconWrapper: { marginBottom: 6 },
  docTypeLabel: { fontSize: SIZES.xs, color: COLORS.gray600, textAlign: 'center', fontWeight: '500' },
  docTypeLabelActive: { color: COLORS.primary, fontWeight: '700' },
  docCheck: { position: 'absolute', top: 8, right: 8 },
  fieldError: { color: COLORS.error, fontSize: SIZES.xs, marginBottom: 12 },
  uploadBox: {
    borderRadius: SIZES.radius, borderWidth: 2, borderColor: COLORS.gray200,
    borderStyle: 'dashed', backgroundColor: COLORS.white, marginBottom: 16, overflow: 'hidden',
  },
  uploadLabel: { padding: 12, paddingBottom: 8, fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray700 },
  uploadActions: { flexDirection: 'row', height: 100 },
  uploadAction: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  uploadDivider: { width: 1, backgroundColor: COLORS.gray200 },
  uploadActionText: { fontSize: SIZES.xs, color: COLORS.primary, fontWeight: '500' },
  imagePreviewContainer: { padding: 12, alignItems: 'center' },
  imagePreview: { width: '100%', height: 160, borderRadius: 8, resizeMode: 'cover' },
  retakeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  retakeBtnText: { color: COLORS.primary, fontSize: SIZES.sm, fontWeight: '600' },
  uploadError: { color: COLORS.error, fontSize: SIZES.xs, padding: 8 },
  selfieGuide: { gap: 8, marginTop: 8 },
  guideLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  guideText: { fontSize: SIZES.sm, color: COLORS.gray600 },
  reviewCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    padding: 16, marginBottom: 16, gap: 12,
  },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewLabel: { fontSize: SIZES.sm, color: COLORS.gray500 },
  reviewValue: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.gray900 },
  consentBox: {
    flexDirection: 'row', gap: 10,
    backgroundColor: '#EBF2FF', padding: 14, borderRadius: SIZES.radius,
  },
  consentText: { flex: 1, fontSize: SIZES.xs, color: COLORS.gray600, lineHeight: 18 },
  footer: { padding: SIZES.padding, paddingBottom: 32, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray200 },
});

export default KYCScreen;
