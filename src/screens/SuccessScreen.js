import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/constants';
import Button from '../components/Button';

const SuccessScreen = ({ navigation, route }) => {
  const { title, message, details = [] } = route.params || {};
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
        <Ionicons name="checkmark" size={52} color={COLORS.white} />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity }]}>
        <Text style={styles.title}>{title || 'Transaction Successful!'}</Text>
        <Text style={styles.message}>{message}</Text>

        {details.length > 0 && (
          <View style={styles.detailsCard}>
            {details.map((item, i) => (
              <View key={i} style={[styles.detailRow, i < details.length - 1 && styles.detailBorder]}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}

        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Home')}
          style={styles.homeBtn}
        />
        <Button
          title="View Transactions"
          variant="outline"
          onPress={() => navigation.navigate('Transactions')}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center', padding: SIZES.paddingLg,
  },
  checkCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.success,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  content: { alignItems: 'center', width: '100%' },
  title: {
    fontSize: SIZES.xl, fontWeight: '800', color: COLORS.gray900,
    textAlign: 'center', marginBottom: 8,
  },
  message: {
    fontSize: SIZES.base, color: COLORS.gray600, textAlign: 'center',
    lineHeight: 22, marginBottom: 24,
  },
  detailsCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16,
    width: '100%', marginBottom: 24, gap: 12,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailBorder: { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  detailLabel: { fontSize: SIZES.sm, color: COLORS.gray500 },
  detailValue: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.gray900 },
  homeBtn: { width: '100%', marginBottom: 10 },
});

export default SuccessScreen;
