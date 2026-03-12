import { Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { COLORS } from "../constants/colors";

// Clerk එකට අනිවාර්යයෙන් ඕනේ කරන Token Cache එක හදාගන්නවා
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
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>

        {/* Clerk එක Load වෙනකන් මේක පෙන්නනවා (Loading Spinner එකක්) */}
        <ClerkLoading>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={COLORS.primary || "#0000ff"} />
          </View>
        </ClerkLoading>

        {/* Clerk එක 100% Load උනාට පස්සේ තමයි ඔයාගේ අනිත් Screens (Slot) පෙන්නන්නේ */}
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>

      </SafeAreaView>
    </ClerkProvider>
  );
}