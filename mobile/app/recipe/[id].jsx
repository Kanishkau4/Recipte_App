import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Share,
    Dimensions,
    Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MealAPI } from "../../services/mealAPI";
import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useUser } from "@clerk/expo";
import { API_URL } from "../../constants/api";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import { styles } from "../../assets/styles/recipe-detail.styles";

const { width, height } = Dimensions.get("window");

const RecipeDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useUser();
    const userId = user?.id;

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [savingLoading, setSavingLoading] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await MealAPI.getMealDetails(id);
                if (data) {
                    const transformed = MealAPI.transformMeal(data);
                    setRecipe({
                        ...transformed,
                        youtubeUrl: data.strYoutube || null,
                    });

                    if (userId) {
                        try {
                            const response = await fetch(`${API_URL}/favorites/${userId}`);
                            if (response.ok) {
                                const favorites = await response.json();
                                const saved = favorites.some(
                                    (fav) => String(fav.recipeId) === String(id)
                                );
                                setIsSaved(saved);
                            }
                        } catch (_) { }
                    }
                }
            } catch (error) {
                console.error("Error loading recipe:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [id, userId]);

    const handleShare = async () => {
        if (!recipe) return;
        try {
            await Share.share({
                message: `Check out this delicious ${recipe.title} recipe!`,
                url: recipe.image,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        const videoId = url.split("v=")[1];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleSaveRecipe = async () => {
        if (!userId || !recipe) return;
        setSavingLoading(true);
        try {
            if (isSaved) {
                const response = await fetch(`${API_URL}/favorites/${userId}/${id}`, {
                    method: "DELETE",
                });
                if (!response.ok) throw new Error("Failed to remove from favorites");
                setIsSaved(false);
            } else {
                const response = await fetch(`${API_URL}/favorites`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        recipeId: id,
                        title: recipe.title,
                        image: recipe.image,
                        cookTime: recipe.cookTime,
                        servings: recipe.servings,
                    }),
                });
                if (!response.ok) throw new Error("Failed to add to favorites");
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error saving recipe:", error);
        } finally {
            setSavingLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading recipe...</Text>
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.centered}>
                <Ionicons name="alert-circle-outline" size={60} color={COLORS.primary} />
                <Text style={styles.errorTitle}>Recipe not found</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* ── Hero Image ── */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: recipe.image }}
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                    {/* Dark gradient over image */}
                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.75)"]}
                        style={styles.heroGradient}
                    />

                    {/* Floating header buttons */}
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                                <Ionicons name="share-social-outline" size={21} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.iconButton, isSaved && styles.iconButtonActive]}
                                onPress={handleSaveRecipe}
                                disabled={savingLoading}
                            >
                                {savingLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Ionicons
                                        name={isSaved ? "heart" : "heart-outline"}
                                        size={21}
                                        color={isSaved ? "#FF6B8A" : "#fff"}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Title overlay on image */}
                    <View style={styles.heroTextContainer}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
                        </View>
                        <Text style={styles.heroTitle}>{recipe.title}</Text>
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={15} color="rgba(255,255,255,0.85)" />
                                <Text style={styles.metaText}>{recipe.cookTime}</Text>
                            </View>
                            <View style={styles.metaSep} />
                            <View style={styles.metaItem}>
                                <Ionicons name="people-outline" size={15} color="rgba(255,255,255,0.85)" />
                                <Text style={styles.metaText}>{recipe.servings}</Text>
                            </View>
                            <View style={styles.metaSep} />
                            <View style={styles.metaItem}>
                                <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.85)" />
                                <Text style={styles.metaText}>{recipe.area}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ── Content Card ── */}
                <View style={styles.contentCard}>

                    {/* Ingredients */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primary + "AA"]}
                                style={styles.sectionIconBox}
                            >
                                <Ionicons name="basket-outline" size={18} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            <View style={styles.countPill}>
                                <Text style={styles.countPillText}>{recipe.ingredients?.length}</Text>
                            </View>
                        </View>

                        <View style={styles.ingredientsGrid}>
                            {recipe.ingredients?.map((ingredient, index) => (
                                <View key={index} style={styles.ingredientChip}>
                                    <View style={styles.ingredientDot} />
                                    <Text style={styles.ingredientText}>{ingredient}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Instructions */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primary + "AA"]}
                                style={styles.sectionIconBox}
                            >
                                <Ionicons name="list-outline" size={18} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.sectionTitle}>Instructions</Text>
                            <View style={styles.countPill}>
                                <Text style={styles.countPillText}>{recipe.instructions?.length}</Text>
                            </View>
                        </View>

                        <View style={styles.stepsList}>
                            {recipe.instructions?.map((step, index) => (
                                <View key={index} style={styles.stepCard}>
                                    <Text style={[styles.stepLabel, { marginBottom: 8 }]}>STEP {index + 1}</Text>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* YouTube Section */}
                    {recipe.youtubeUrl && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <LinearGradient
                                        colors={["#FF0000", "#CC0000"]}
                                        style={styles.sectionIconBox}
                                    >
                                        <Ionicons name="logo-youtube" size={18} color="#fff" />
                                    </LinearGradient>
                                    <Text style={styles.sectionTitle}>Watch Video</Text>
                                </View>

                                <View style={styles.youtubeCard}>
                                    <WebView
                                        source={{ uri: getYoutubeEmbedUrl(recipe.youtubeUrl) }}
                                        style={styles.webview}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        allowsInlineMediaPlayback={true}
                                        mediaPlaybackRequiresUserAction={false}
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    {/* Save Button */}
                    <View style={styles.saveSection}>
                        <TouchableOpacity
                            onPress={handleSaveRecipe}
                            disabled={savingLoading}
                            activeOpacity={0.85}
                            style={{ borderRadius: 18, overflow: "hidden" }}
                        >
                            <LinearGradient
                                colors={
                                    isSaved
                                        ? ["#FF6B8A", "#E0405E"]
                                        : [COLORS.primary, COLORS.primary + "CC"]
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveButton}
                            >
                                {savingLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Ionicons
                                        name={isSaved ? "heart" : "heart-outline"}
                                        size={22}
                                        color="#fff"
                                    />
                                )}
                                <Text style={styles.saveButtonText}>
                                    {isSaved ? "Saved in Favorites" : "Add to Favorites"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default RecipeDetailScreen;
