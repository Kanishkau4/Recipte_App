import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function LoadingSpinner({ message = "Loading...", size = "large" }) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator size={size} color={colors.primary} />
                <Text style={[styles.message, { color: colors.textLight }]}>{message}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    content: {
        alignItems: "center",
        gap: 16,
    },
    message: {
        fontSize: 16,
        textAlign: "center",
    },
});