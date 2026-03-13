import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { recipeCardStyles } from '../assets/styles/home.styles';
import { COLORS } from '../constants/colors';

const RecipeCard = ({ recipe }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={recipeCardStyles.container}
            activeOpacity={0.7}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
        >
            <View style={recipeCardStyles.imageContainer}>
                <Image
                    source={{ uri: recipe.image }}
                    style={recipeCardStyles.image}
                    contentFit="cover"
                    transition={500}
                />
            </View>
            <View style={recipeCardStyles.content}>
                <Text style={recipeCardStyles.title} numberOfLines={1}>
                    {recipe.title}
                </Text>
                <Text style={recipeCardStyles.description} numberOfLines={2}>
                    {recipe.description}
                </Text>
                <View style={recipeCardStyles.footer}>
                    <View style={recipeCardStyles.timeContainer}>
                        <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
                        <Text style={recipeCardStyles.timeText}>{recipe.cookTime}</Text>
                    </View>
                    <View style={recipeCardStyles.servingsContainer}>
                        <Ionicons name="people-outline" size={12} color={COLORS.textLight} />
                        <Text style={recipeCardStyles.servingsText}>{recipe.servings}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default RecipeCard;
