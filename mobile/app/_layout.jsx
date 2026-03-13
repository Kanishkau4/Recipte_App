import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/expo";
import * as SecureStore from 'expo-secure-store';
import SafeScreen from "../components/SafeScreen";

// Clerk needs a token cache to store user tokens
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
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}