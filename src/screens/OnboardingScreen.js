import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    iconName: 'wallet-outline',
    title: 'Fund Your Wallet',
    subtitle: 'Add money to your DataSwap wallet securely using any Nigerian bank card or transfer.',
    gradient: ['#0D47A1', '#1565C0'],
  },
  {
    id: '2',
    iconName: 'cloud-download-outline',
    title: 'Buy Data & Airtime',
    subtitle: 'Purchase data plans and airtime for any Nigerian network at the best rates — MTN, Airtel, Glo, 9Mobile.',
    gradient: ['#006064', '#00838F'],
  },
  {
    id: '3',
    iconName: 'cash-outline',
    title: 'Sell Your Data',
    subtitle: 'Have unused data? Sell it back to DataSwap for instant cash credited to your wallet.',
    gradient: ['#1B5E20', '#2E7D32'],
  },
  {
    id: '4',
    iconName: 'shield-checkmark-outline',
    title: 'Safe & Verified',
    subtitle: 'All users are KYC-verified. Your wallet, transactions, and identity are fully protected.',
    gradient: ['#4A148C', '#6A1B9A'],
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const { completeOnboarding } = useAuth();

  const next = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    await completeOnboarding();
    navigation.replace('Register');
  };

  const renderSlide = ({ item }) => (
    <LinearGradient colors={item.gradient} style={styles.slide}>
      <View style={styles.iconBox}>
        <Ionicons name={item.iconName} size={56} color={COLORS.white} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>
        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={next}
          style={styles.nextBtn}
        />
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleGetStarted}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        {currentIndex === slides.length - 1 && (
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Log In</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    paddingBottom: 120,
  },
  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
  },
  dotsRow: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.gray300 },
  dotActive: { width: 24, backgroundColor: COLORS.primary },
  nextBtn: { width: '100%' },
  skipText: { color: COLORS.gray500, fontSize: SIZES.sm, fontWeight: '500' },
  loginText: { color: COLORS.gray600, fontSize: SIZES.sm },
  loginLink: { color: COLORS.primary, fontWeight: '700' },
});

export default OnboardingScreen;
