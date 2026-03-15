import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../context/ThemeContext';
import { makeHomeStyles } from '../assets/styles/home.styles';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
    const { colors } = useTheme();
    const homeStyles = useMemo(() => makeHomeStyles(colors), [colors]);

    return (
        <View style={homeStyles.categoryFilterContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={homeStyles.categoryFilterScrollContent}
            >
                <TouchableOpacity
                    style={[
                        homeStyles.categoryButton,
                        !selectedCategory && homeStyles.selectedCategory
                    ]}
                    onPress={() => onSelectCategory(null)}
                >
                    <Text style={[
                        homeStyles.categoryText,
                        !selectedCategory && homeStyles.selectedCategoryText
                    ]}>All</Text>
                </TouchableOpacity>
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.name;
                    return (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                homeStyles.categoryButton,
                                isSelected && homeStyles.selectedCategory
                            ]}
                            onPress={() => onSelectCategory(category.name)}
                        >
                            <Image
                                source={{ uri: category.image }}
                                style={[
                                    homeStyles.categoryImage,
                                    isSelected && homeStyles.selectedCategoryImage
                                ]}
                            />
                            <Text style={[
                                homeStyles.categoryText,
                                isSelected && homeStyles.selectedCategoryText
                            ]}>{category.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default CategoryFilter;
