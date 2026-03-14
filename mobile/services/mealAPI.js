const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const MealAPI = {
    // Search meals by name
    searchMealsByName: async (query) => {
        try {
            const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Error fetching meals by name:', error);
            return [];
        }
    },

    // Get meal details by ID
    getMealDetails: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
            const data = await response.json();
            return data.meals?.[0] || null;
        } catch (error) {
            console.error('Error fetching meal details:', error);
            return null;
        }
    },

    // Get random meal
    getRandomMeal: async () => {
        try {
            const response = await fetch(`${BASE_URL}/random.php`);
            const data = await response.json();
            return data.meals?.[0] || null;
        } catch (error) {
            console.error('Error fetching random meal:', error);
            return null;
        }
    },

    // Get multiple random meals
    getRandomMeals: async (count = 10) => {
        try {
            const promises = Array(count).fill(null).map(() => MealAPI.getRandomMeal());
            const meals = await Promise.all(promises);
            return meals.filter(meal => meal !== null);
        } catch (error) {
            console.error('Error fetching random meals:', error);
            return [];
        }
    },

    // Get meal categories
    getCategories: async () => {
        try {
            const response = await fetch(`${BASE_URL}/categories.php`);
            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error('Error fetching meal categories:', error);
            return [];
        }
    },

    // Filter by ingredient
    filterByIngredient: async (ingredient) => {
        try {
            const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Error filtering meals by ingredient:', error);
            return [];
        }
    },

    // Filter by categories
    filterByCategory: async (category) => {
        try {
            const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Error filtering meals by category:', error);
            return [];
        }
    },

    // Transform TheMealDB meal data to our app format
    transformMeal: (meal) => {
        if (!meal) return null;

        // Extract ingredients and measures
        const ingredients = [];
        const measures = [];

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim()) {
                const ingredientObj = {
                    name: ingredient.trim(),
                    measure: measure ? measure.trim() : '',
                };
                ingredients.push(`${ingredientObj.measure} ${ingredientObj.name}`);
            }
        }

        // Format instructions
        const instructions = meal.strInstructions
            ? meal.strInstructions
                .split(/\r\n|\r|\n/)
                .map(step => step.trim())
                .filter(step => {
                    // Filter out empty steps and redundant "Step 1", "Step 1:", "Step 1." lines
                    const isRedundantStepLabel = /^step\s*\d+[:.]?$/i.test(step);
                    return step.length > 0 && !isRedundantStepLabel;
                })
            : [];

        return {
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions
                ? meal.strInstructions.substring(0, 120) + '...'
                : 'No description available',
            image: meal.strMealThumb,
            cookTime: meal.strCookTime || '30 minutes',
            servings: meal.strYield || '2 servings',
            category: meal.strCategory || 'Main Course',
            area: meal.strArea || 'Unknown',
            instructions,
            ingredients,
            videoUrl: meal.strYoutube,
            tags: meal.strTags ? meal.strTags.split(',') : [],
            originalData: meal,
        };
    },
};
