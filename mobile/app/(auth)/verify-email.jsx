import { View, Text, Alert, KeyboardAvoidingView, Platform, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
// 💡 අලුතින් useClerk එක ගත්තා
import { useSignUp, useClerk } from '@clerk/expo';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';
import { Image } from 'expo-image';

const VerifyEmailScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  // 💡 useSignUp එකෙන් දැන් ගන්නේ signUp විතරයි
  const { signUp } = useSignUp();
  // 💡 setActive එක ගන්නේ useClerk එකෙන්!
  const { setActive } = useClerk();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerifyEmail = async () => {

    if (!signUp) {
      return Alert.alert('Error', 'Session lost. Please go back and sign up again.');
    }

    const cleanCode = code.trim();

    if (cleanCode.length !== 6) {
      return Alert.alert('Invalid Code', `Please enter the 6-digit code.`);
    }

    setLoading(true);
    try {
      console.log('[VerifyEmail] Starting verification for code:', cleanCode);

      // අලුත් API එක Call කරනවා (v5/v6)
      if (signUp.verifications && typeof signUp.verifications.verifyEmailCode === 'function') {
        const response = await signUp.verifications.verifyEmailCode({ code: cleanCode });

        if (response?.error) throw response.error;

        if (signUp.status === 'complete') {
          console.log('[VerifyEmail] Verification Complete! Activating session...');

          // 💡 දැන් setActive එක වැඩ කරනවා!
          await setActive({ session: signUp.createdSessionId });

          router.replace('/'); // Home එකට යවනවා
          return;
        } else {
          console.warn('[VerifyEmail] signUp.status not complete:', signUp.status);
          Alert.alert('Verification Pending', 'Could not complete verification.');
          return;
        }
      }
      // පරණ API එක (Backup)
      else if (typeof signUp.attemptEmailAddressVerification === 'function') {
        const result = await signUp.attemptEmailAddressVerification({ code: cleanCode });

        if (result.status === 'complete') {
          console.log('[VerifyEmail] Verification Complete! Activating session...');

          await setActive({ session: result.createdSessionId });

          router.replace('/');
          return;
        } else {
          Alert.alert('Verification Pending', 'Could not complete verification.');
          return;
        }
      }

    } catch (error) {
      console.error('[VerifyEmail Error]:', error);
      const clerkErrors = error?.errors;
      const firstErr = clerkErrors?.[0];
      const msg = firstErr?.longMessage || firstErr?.message || error?.message || 'Verification failed. Please try again.';

      Alert.alert('Verification Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    if (!signUp) return;
    try {
      if (signUp.verifications && typeof signUp.verifications.sendEmailCode === 'function') {
        await signUp.verifications.sendEmailCode();
      } else if (typeof signUp.prepareEmailAddressVerification === 'function') {
        await signUp.prepareEmailAddressVerification();
      }
      Alert.alert('Success', 'A new code has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={authStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={authStyles.imageContainer}>
            <Image source={require('../../assets/images/p3.png')} style={authStyles.image} contentFit="contain" />
          </View>

          <Text style={authStyles.title}>Verify your email</Text>
          <Text style={authStyles.subtitle}>
            We've sent a 6-digit code to{'\n'}{email}
          </Text>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter 6-digit code"
              placeholderTextColor={COLORS.textLight}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
            onPress={onVerifyEmail}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={authStyles.linkContainer} onPress={onResendCode}>
            <Text style={authStyles.linkText}>
              Didn't receive a code? <Text style={authStyles.link}>Resend</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={authStyles.linkContainer} onPress={() => router.back()}>
            <Text style={authStyles.linkText}>
              Wrong email? <Text style={authStyles.link}>Go back</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmailScreen;