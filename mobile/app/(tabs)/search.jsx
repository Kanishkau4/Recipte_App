import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MealAPI } from '../../services/mealAPI';
import RecipeCard from '../../components/RecipeCard';
import { searchStyles } from '../../assets/styles/search.styles';
import { COLORS } from '../../constants/colors';
import { useDebounce } from '../../hooks/useDebounce';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                searchMeals(query);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const searchMeals = async (text) => {
        setLoading(true);
        try {
            const meals = await MealAPI.searchMealsByName(text);
            const transformed = meals.map(meal => MealAPI.transformMeal(meal));
            setResults(transformed);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (text) => {
        setQuery(text);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
    };

    useEffect(() => {
        if (debouncedQuery.trim()) {
            searchMeals(debouncedQuery);
        } else {
            setResults([]);
        }
    }, [debouncedQuery]);

    return (
        <View style={searchStyles.container}>
            <View style={searchStyles.header}>
                <Text style={searchStyles.title}>Search Recipes</Text>
                <View style={searchStyles.searchBar}>
                    <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
                    <TextInput
                        style={searchStyles.searchInput}
                        placeholder="Search for any meal..."
                        placeholderTextColor={COLORS.textLight}
                        value={query}
                        onChangeText={handleTextChange}
                        autoCorrect={false}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={searchStyles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={results}
                    renderItem={({ item }) => <RecipeCard recipe={item} />}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={searchStyles.row}
                    contentContainerStyle={searchStyles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        query.trim().length > 0 ? (
                            <View style={searchStyles.emptyContainer}>
                                <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
                                <Text style={searchStyles.emptyText}>No results found</Text>
                                <Text style={searchStyles.emptySubtext}>We couldn't find any recipes matching "{query}"</Text>
                            </View>
                        ) : (
                            <View style={searchStyles.emptyContainer}>
                                <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
                                <Text style={searchStyles.emptyText}>Hungry?</Text>
                                <Text style={searchStyles.emptySubtext}>Search for your favorite ingredients or dishes</Text>
                            </View>
                        )
                    }
                />
            )}
        </View>
    );
};

export default SearchScreen;