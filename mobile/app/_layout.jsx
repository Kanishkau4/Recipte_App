import { useState } from "react";
import { Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { COLORS } from "../constants/colors";
import AppSplashScreen from "../components/AppSplashScreen";

import { ThemeProvider } from "../context/ThemeContext";
import SafeScreen from "../components/SafeScreen";

// Token Cache එක (කලින් තිබ්බ විදිහටම)
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

export default function RootLayout() {
  // 1. Splash Screen එක පෙන්නන්නද නැද්ද කියලා තීරණය කරන State එක
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  return (
    <ThemeProvider>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <SafeScreen>

          {/* 2. Splash Screen එක තාම ඉවර නැත්නම් මේක පෙන්නනවා */}
          {!isSplashFinished ? (
            <AppSplashScreen onFinish={() => setIsSplashFinished(true)} />
          ) : (
            // 3. Splash Screen එක ඉවර උනාම තමයි අනිත් ටික පෙන්නන්නේ
            <>
              {/* Clerk එක Load වෙනකන් Loading එකක් පෙන්නනවා (අවශ්‍ය නම්) */}
              <ClerkLoading>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <ActivityIndicator size="large" color={COLORS.primary || "#000"} />
                </View>
              </ClerkLoading>

              {/* Clerk එක Load උනාම Screens පෙන්නනවා */}
              <ClerkLoaded>
                <Slot />
              </ClerkLoaded>
            </>
          )}

        </SafeScreen>
      </ClerkProvider>
    </ThemeProvider>
  );
}