import { View, Text, Alert, KeyboardAvoidingView, Platform, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { useSignUp } from '@clerk/expo';
import { makeAuthStyles } from '../../assets/styles/auth.styles';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const SignUpScreen = () => {
  const router = useRouter();
  // isLoaded is required
  const { isLoaded, signUp } = useSignUp();
  
  const { colors } = useTheme();
  const authStyles = useMemo(() => makeAuthStyles(colors), [colors]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {

    // Validation
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter your email and password.');
    }
    if (password.length < 8) {
      return Alert.alert('Error', 'Password must be at least 8 characters long.');
    }

    setLoading(true);
    try {
      // 2. Create Sign Up using the NEW method: signUp.password
      // create() instead of password()
      const { error } = await signUp.password({
        emailAddress: email,
        password: password,
      });

      if (error) {
        console.error('[SignUp Error]:', JSON.stringify(error, null, 2));
        throw error; // Error is sent to the catch block
      }

      // 3. Send Email Verification Code using NEW method
      // prepareVerification instead of verifications.sendEmailCode()
      await signUp.verifications.sendEmailCode();

      console.log('[SignUp] Verification code sent successfully!');

      // 4. Navigate to verification screen
      router.push({ pathname: '/(auth)/verify-email', params: { email } });

    } catch (err) {
      // Error Handling
      const errorMsg = err?.errors?.[0]?.longMessage || err?.message || 'Sign up failed. Please try again.';
      console.error('[SignUp Catch Error]:', errorMsg);
      Alert.alert('Sign Up Failed', errorMsg);
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
            <Image source={require('../../assets/images/p2.png')} style={authStyles.image} contentFit="contain" />
          </View>
          <Text style={authStyles.title}>Create an account</Text>

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
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={authStyles.linkText}>
              Already have an account? <Text style={authStyles.link}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;