import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";

const TabLayout = () => {
    const { isSignedIn } = useAuth();
    if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;
    return <Stack />;
};

export default TabLayout;