import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { MealAPI } from "../../services/mealAPI";
import { useState, useEffect, useCallback } from "react";
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import CategoryFilter from "../../components/CategoryFilter";
import RecipeCard from "../../components/RecipeCard";

const HomeScreen = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredRecipe, setFeaturedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const [apiCategories, randomMeals, randomFeatured] = await Promise.all([
                MealAPI.getCategories(),
                MealAPI.getRandomMeals(12),
                MealAPI.getRandomMeal()
            ]);

            const transformedCategories = apiCategories.map((category, index) => ({
                id: category.idCategory || (index + 1).toString(),
                name: category.strCategory,
                image: category.strCategoryThumb,
                description: category.strCategoryDescription
            }));

            setCategories(transformedCategories);

            const transformedRecipes = randomMeals
                .map((meal) => MealAPI.transformMeal(meal))
                .filter((meal) => meal && meal.id !== null);

            setRecipes(transformedRecipes);

            const transformedFeatured = MealAPI.transformMeal(randomFeatured);
            setFeaturedRecipe(transformedFeatured);

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    const loadCategoryData = async (categoryName) => {
        try {
            setLoading(true);
            const meals = await MealAPI.filterByCategory(categoryName);
            const transformedMeals = meals
                .map((meal) => MealAPI.transformMeal(meal))
                .filter((meal) => meal && meal.id !== null);
            setRecipes(transformedMeals);
        } catch (error) {
            console.error('Error loading category data:', error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = async (categoryName) => {
        setSelectedCategory(categoryName);
        if (categoryName) {
            await loadCategoryData(categoryName);
        } else {
            await loadData();
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={homeStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
                contentContainerStyle={homeStyles.scrollContent}
            >
                {/* Welcome Section */}
                <View style={homeStyles.welcomeSection}>
                    <View>
                        <Text style={homeStyles.welcomeText}>What would you like</Text>
                        <Text style={[homeStyles.welcomeText, { color: COLORS.primary }]}>to cook today?</Text>
                    </View>
                    <TouchableOpacity
                        style={homeStyles.profileButton}
                        onPress={() => router.push('/(tabs)/search')}
                    >
                        <Ionicons name="search-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                {/* Featured Section */}
                {featuredRecipe && (
                    <View style={homeStyles.featuredSection}>
                        <TouchableOpacity
                            style={homeStyles.featuredCard}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
                        >
                            <View style={homeStyles.featuredImageContainer}>
                                <Image
                                    source={{ uri: featuredRecipe.image }}
                                    style={homeStyles.featuredImage}
                                    contentFit="cover"
                                    transition={1000}
                                />
                                <View style={homeStyles.featuredOverlay}>
                                    <View style={homeStyles.featuredBadge}>
                                        <Text style={homeStyles.featuredBadgeText}>Featured Recipe</Text>
                                    </View>
                                    <View style={homeStyles.featuredContent}>
                                        <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                                            {featuredRecipe.title}
                                        </Text>
                                        <View style={homeStyles.featuredMeta}>
                                            <View style={homeStyles.metaItem}>
                                                <Ionicons name="time-outline" size={16} color={COLORS.white} />
                                                <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                                            </View>
                                            <View style={homeStyles.metaItem}>
                                                <Ionicons name="people-outline" size={16} color={COLORS.white} />
                                                <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                                            </View>
                                            {featuredRecipe.area && (
                                                <View style={homeStyles.metaItem}>
                                                    <Ionicons name="location-outline" size={16} color={COLORS.white} />
                                                    <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {categories.length > 0 && (
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />
                )}

                <View style={homeStyles.recipesSection}>
                    <View style={homeStyles.sectionHeader}>
                        <Text style={homeStyles.sectionTitle}>
                            {selectedCategory ? `${selectedCategory} Recipes` : 'Popular Recipes'}
                        </Text>
                    </View>

                    {recipes.length > 0 ? (
                        <FlatList
                            data={recipes}
                            renderItem={({ item }) => <RecipeCard recipe={item} />}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={homeStyles.row}
                            contentContainerStyle={homeStyles.recipesGrid}
                            scrollEnabled={false}
                        />
                    ) : (
                        !loading && (
                            <View style={homeStyles.emptyState}>
                                <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
                                <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                                <Text style={homeStyles.emptyDescription}>Try a different category</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;