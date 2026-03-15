import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { makeFavoritesStyles } from "../assets/styles/favorites.styles";

function NoFavoritesFound() {
    const router = useRouter();
    const { colors } = useTheme();
    const favoritesStyles = useMemo(() => makeFavoritesStyles(colors), [colors]);

    return (
        <View style={favoritesStyles.emptyState}>
            <View style={favoritesStyles.emptyIconContainer}>
                <Ionicons name="heart-outline" size={80} color={colors.textLight} />
            </View>
            <Text style={favoritesStyles.emptyTitle}>No favorites yet</Text>
            <TouchableOpacity style={favoritesStyles.exploreButton} onPress={() => router.push("/")}>
                <Ionicons name="search" size={18} color={colors.white} />
                <Text style={favoritesStyles.exploreButtonText}>Explore Recipes</Text>
            </TouchableOpacity>
        </View>
    );
}

export default NoFavoritesFound;