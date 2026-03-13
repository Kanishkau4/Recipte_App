import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Share } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MealAPI } from "../../services/mealAPI";
import { useState, useEffect } from "react";
import { recipeStyles } from "../../assets/styles/recipe.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const RecipeDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const data = await MealAPI.getMealDetails(id);
                if (data) {
                    const transformed = MealAPI.transformMeal(data);
                    setRecipe(transformed);
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRecipe();
    }, [id]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this delicious ${recipe.title} recipe!`,
                url: recipe.image,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (loading) {
        return (
            <View style={[recipeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={[recipeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Recipe not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: COLORS.primary, marginTop: 10 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={recipeStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View>
                    <Image source={{ uri: recipe.image }} style={recipeStyles.headerImage} contentFit="cover" />
                    <View style={recipeStyles.headerButtons}>
                        <TouchableOpacity style={recipeStyles.iconButton} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity style={recipeStyles.iconButton} onPress={handleShare}>
                                <Ionicons name="share-outline" size={22} color={COLORS.text} />
                            </TouchableOpacity>
                            <TouchableOpacity style={recipeStyles.iconButton} onPress={() => setIsFavorite(!isFavorite)}>
                                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? COLORS.error : COLORS.text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={recipeStyles.contentContainer}>
                    <View style={recipeStyles.header}>
                        <Text style={recipeStyles.category}>{recipe.category}</Text>
                        <Text style={recipeStyles.title}>{recipe.title}</Text>
                        
                        <View style={recipeStyles.metaRow}>
                            <View style={recipeStyles.metaItem}>
                                <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                                <Text style={recipeStyles.metaText}>{recipe.cookTime}</Text>
                            </View>
                            <View style={recipeStyles.metaItem}>
                                <Ionicons name="people-outline" size={18} color={COLORS.primary} />
                                <Text style={recipeStyles.metaText}>{recipe.servings}</Text>
                            </View>
                            <View style={recipeStyles.metaItem}>
                                <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                                <Text style={recipeStyles.metaText}>{recipe.area}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={recipeStyles.divider} />

                    <Text style={recipeStyles.sectionTitle}>Ingredients</Text>
                    <View style={recipeStyles.ingredientsList}>
                        {recipe.ingredients?.map((ingredient, index) => (
                            <View key={index} style={recipeStyles.ingredientItem}>
                                <View style={recipeStyles.ingredientDot} />
                                <Text style={recipeStyles.ingredientText}>{ingredient}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={recipeStyles.divider} />

                    <Text style={recipeStyles.sectionTitle}>Instructions</Text>
                    <View style={recipeStyles.instructionsList}>
                        {recipe.instructions?.map((step, index) => (
                            <View key={index} style={recipeStyles.instructionStep}>
                                <View style={recipeStyles.stepNumberContainer}>
                                    <Text style={recipeStyles.stepNumber}>{index + 1}</Text>
                                </View>
                                <Text style={recipeStyles.instructionText}>{step}</Text>
                            </View>
                        ))}
                    </View>

                    {recipe.videoUrl && (
                        <TouchableOpacity 
                            style={recipeStyles.youtubeButton}
                            onPress={() => Linking.openURL(recipe.videoUrl)}
                        >
                            <Ionicons name="logo-youtube" size={24} color={COLORS.white} />
                            <Text style={recipeStyles.youtubeButtonText}>Watch on YouTube</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default RecipeDetailScreen;
