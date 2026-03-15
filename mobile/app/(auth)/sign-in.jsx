import { View, Text, Alert, KeyboardAvoidingView, Platform, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { useSignIn, useClerk } from '@clerk/expo';
import { makeAuthStyles } from '../../assets/styles/auth.styles';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const SignInScreen = () => {
  const router = useRouter();
  const { signIn } = useSignIn(); // isLoaded removed
  const { setActive } = useClerk();
  
  const { colors } = useTheme();
  const authStyles = useMemo(() => makeAuthStyles(colors), [colors]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    // return Alert if signIn is not ready
    if (!signIn) {
      return Alert.alert('Wait', 'Sign in is not ready yet. Please wait a second.');
    }

    // return Alert if email or password is empty
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      return Alert.alert('Error', 'Please enter your email and password.');
    }

    setLoading(true);

    try {
      console.log('[SignIn] Attempting to sign in with:', cleanEmail);
      let result;

      // if signIn.password is a function, use it
      if (typeof signIn.password === 'function') {
        console.log('[SignIn] Using signIn.password() API');

        // call signIn.password with email and password
        const response = await signIn.password({
          emailAddress: cleanEmail,
          password: password,
        });

        // if response.error is not null, throw it
        if (response?.error) {
          console.error('[SignIn Error Response]:', response.error);
          throw response.error;
        }

        result = signIn; // if signIn.password is a function, use it
      }
      // ---------------- Clerk API (v4 - Backup) ----------------
      else {
        console.log('[SignIn] Using signIn.create() API');
        result = await signIn.create({
          identifier: cleanEmail,
          password: password,
        });
      }

      console.log('[SignIn] Result Status:', result.status);

      if (result.status === 'complete') {
        console.log('[SignIn] Success! Activating session...');

        // activate session
        await setActive({ session: result.createdSessionId || signIn.createdSessionId });

        // navigate to home
        router.replace('/(tabs)');
      }
      else {
        console.warn('[SignIn] Incomplete status:', result.status);
        Alert.alert('Verification Pending', 'Could not complete sign in. Please try again.');
      }

    } catch (error) {
      console.error('[SignIn Error Caught]:', error);

      const clerkErrors = error?.errors;
      const firstErr = clerkErrors?.[0];
      const msg = firstErr?.longMessage || firstErr?.message || error?.message || 'Sign in failed. Please check your credentials and try again.';

      Alert.alert('Sign In Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.imageContainer}>
            <Image source={require('../../assets/images/p1.png')} style={authStyles.image} contentFit="contain" />
          </View>
          <Text style={authStyles.title}>Welcome back</Text>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={authStyles.linkText}>
              Don't have an account? <Text style={authStyles.link}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default SignInScreen;