import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const favoriteRecipes = pgTable("favorites", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    recipeId: text("recipe_id").notNull(),
    title: text("title").notNull(),
    image: text("image"),
    cookTime: integer("cook_time"),
    servings: integer("servings"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});