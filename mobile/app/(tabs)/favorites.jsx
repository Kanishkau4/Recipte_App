import { View, Text, Alert, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { useClerk, useUser } from '@clerk/expo';
import { useState, useEffect } from 'react';
import { API_URL } from '../../constants/api';
import { favoritesStyles } from '../../assets/styles/favorites.styles';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from '../../components/RecipeCard';
import NoFavoritesFound from '../../components/NoFavoritesFound';
import LoadingSpinner from '../../components/LoadingSpinner';

const FavoritesScreen = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/favorites/${user.id}`);
            if (!response.ok) throw new Error('Failed to fetch favorites');

            const data = await response.json();

            // Transform the favorites data to match the RecipeCard component
            const transformedData = data.map(favorite => ({
                ...favorite,
                id: favorite.recipeId
            }));

            setFavorites(transformedData);

        } catch (error) {
            console.log('Error fetching favorites:', error);
            // Don't show alert on every single failure to avoid annoying users if offline
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: () => signOut() },
        ]);
    };

    if (loading && favorites.length === 0) {
        return <LoadingSpinner message="Loading your favorites..." />;
    }

    return (
        <View style={favoritesStyles.container}>
            <View style={favoritesStyles.header}>
                <Text style={favoritesStyles.title}>Favorites</Text>
                <TouchableOpacity onPress={handleSignOut} style={favoritesStyles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={favorites}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={favoritesStyles.row}
                contentContainerStyle={favoritesStyles.recipesSection}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<NoFavoritesFound />}
                refreshing={loading}
                onRefresh={fetchFavorites}
            />
        </View>
    );
};

export default FavoritesScreen;