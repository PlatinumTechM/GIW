import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import api from '../utils/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Floating Label Input Component
interface FloatingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  returnKeyType?: 'done' | 'next';
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  autoFocus = false,
}) => {
  const floatAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const animate = (toValue: number) => {
    Animated.spring(floatAnim, {
      toValue,
      useNativeDriver: false,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  useEffect(() => {
    if (value || focused) animate(1);
    else animate(0);
  }, [value, focused]);

  const labelTop = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -9],
  });
  const labelSize = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });
  const labelColor = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#94A3B8', focused ? '#2563EB' : '#64748B'],
  });
  const labelBgColor = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#FFFFFF'],
  });

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={[styles.floatWrapper, focused && styles.floatWrapperFocused]}
    >
      <Animated.Text
        style={[
          styles.floatLabel,
          {
            top: labelTop,
            fontSize: labelSize,
            color: labelColor,
            backgroundColor: labelBgColor,
          },
        ]}
        pointerEvents="none"
      >
        {label}
      </Animated.Text>

      <TextInput
        ref={inputRef}
        style={styles.floatInput}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
      />
    </Pressable>
  );
};

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { bottom } = insets;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 540,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 14,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.data?.success) {
        setEmailSent(true);
        Toast.show({
          type: 'success',
          text1: 'Email Sent',
          text2: 'Check your inbox for reset instructions.',
        });
      } else {
        throw new Error(response.data?.message || 'Failed to send reset email');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Unable to send reset email. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative blobs */}
        <View style={styles.blobTopRight} />
        <View style={styles.blobBottomLeft} />

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* Back Button */}
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#0F172A" />
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="lock-reset" size={28} color="#1D4ED8" />
            </View>
            <Text style={styles.title}>
              {emailSent ? 'Check Your Email' : 'Forgot Password?'}
            </Text>
            <Text style={styles.subtitle}>
              {emailSent
                ? `We've sent password reset instructions to ${email}`
                : "Enter your email address and we'll send you instructions to reset your password."}
            </Text>
          </View>

          {/* Error banner */}
          {error ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Success State */}
          {emailSent ? (
            <View style={styles.card}>
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <MaterialIcons name="check" size={40} color="#fff" />
                </View>
                <Text style={styles.successTitle}>Email Sent!</Text>
                <Text style={styles.successMessage}>
                  Please check your inbox and follow the instructions to reset
                  your password.
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.btn,
                    pressed && styles.btnPressed,
                  ]}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.btnText}>Back to Login</Text>
                </Pressable>

                <Pressable
                  style={styles.resendButton}
                  onPress={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                >
                  <Text style={styles.resendText}>
                    Didn't receive it? Try again
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            /* Form card */
            <View style={styles.card}>
              <FloatingInput
                label="Email Address"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (error) setError('');
                }}
                keyboardType="email-address"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                autoFocus
              />

              {/* Submit button */}
              <Pressable
                style={({ pressed }) => [
                  styles.btn,
                  pressed && styles.btnPressed,
                  isLoading && styles.btnDisabled,
                  { marginTop: 24 },
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.btnText}>Send Reset Link</Text>
                    <MaterialIcons
                      name="send"
                      size={18}
                      color="#fff"
                      style={{ marginLeft: 8 }}
                    />
                  </>
                )}
              </Pressable>
            </View>
          )}

          {/* Login link */}
          {!emailSent && (
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Remember your password? </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.bottomLink}>Sign In</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 24,
  },

  /* decorative */
  blobTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#DBEAFE',
    opacity: 0.55,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: 80,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E7FF',
    opacity: 0.45,
  },

  /* back button */
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  /* header */
  header: { marginBottom: 32 },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 40,
    marginBottom: 10,
  },
  subtitle: { fontSize: 15, color: '#64748B', lineHeight: 22 },

  /* error */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  errorText: { color: '#DC2626', fontSize: 13, flex: 1 },

  /* card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.09,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    marginBottom: 28,
  },

  /* floating label field */
  floatWrapper: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FAFBFF',
    minHeight: 60,
  },
  floatWrapperFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2563EB',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  floatLabel: {
    position: 'absolute',
    left: 12,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  floatInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    paddingTop: 2,
    paddingBottom: 2,
  },

  /* button */
  btn: {
    height: 54,
    borderRadius: 17,
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  btnPressed: { opacity: 0.88, transform: [{ scale: 0.987 }] },
  btnDisabled: { opacity: 0.65, shadowOpacity: 0 },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* success state */
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  resendButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  resendText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '600',
  },

  /* bottom */
  bottomRow: { flexDirection: 'row', justifyContent: 'center' },
  bottomText: { color: '#64748B', fontSize: 14 },
  bottomLink: { color: '#1D4ED8', fontSize: 14, fontWeight: '700' },
});

export default ForgotPasswordScreen;
