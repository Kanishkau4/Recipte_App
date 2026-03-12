import { View, Text, Alert, KeyboardAvoidingView, Platform, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSignUp } from '@clerk/expo';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const SignUpScreen = () => {
  const router = useRouter();
  // isLoaded එක අනිවාර්යයෙන්ම ගන්න ඕනේ
  const { isLoaded, signUp } = useSignUp();

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
      // මෙතනදි create() වෙනුවට password() පාවිච්චි කරනවා
      const { error } = await signUp.password({
        emailAddress: email,
        password: password,
      });

      if (error) {
        console.error('[SignUp Error]:', JSON.stringify(error, null, 2));
        throw error; // Error එක catch block එකට යවනවා
      }

      // 3. Send Email Verification Code using NEW method
      // prepareVerification වෙනුවට verifications.sendEmailCode() පාවිච්චි කරනවා
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
              placeholderTextColor={COLORS.textLight}
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
              placeholderTextColor={COLORS.textLight}
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
                color={COLORS.textLight}
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