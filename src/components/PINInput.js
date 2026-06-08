import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { COLORS, SIZES } from '../utils/constants';

const PINInput = ({ length = 4, onComplete, error, label }) => {
  const [pin, setPin] = useState(Array(length).fill(''));
  const inputRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      shakeAnimation();
      setPin(Array(length).fill(''));
    }
  }, [error]);

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, length).split('');
    const newPin = Array(length).fill('').map((_, i) => digits[i] || '');
    setPin(newPin);
    if (digits.length === length) {
      onComplete(digits.join(''));
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
        {pin.map((digit, i) => (
          <View
            key={i}
            style={[styles.dot, digit !== '' && styles.dotFilled, error && styles.dotError]}
          />
        ))}
      </Animated.View>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={pin.join('')}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        caretHidden
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.tapHint} onPress={() => inputRef.current?.focus()}>
        Tap to enter PIN
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  label: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.gray400,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dotError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.sm,
    textAlign: 'center',
  },
  tapHint: {
    color: COLORS.gray500,
    fontSize: SIZES.sm,
  },
});

export default PINInput;
