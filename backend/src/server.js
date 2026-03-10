import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoriteRecipes } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "OK" });
});

app.post("/api/favorites", async (req, res) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId || !title || !image || !cookTime || !servings) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newFavorite = await db.insert(favoriteRecipes).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings,
        }).returning();

        res.status(201).json(newFavorite[0]);

    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const userFavorites = await db.select().from(favoriteRecipes).where(eq(favoriteRecipes.userId, userId));

        res.status(200).json(userFavorites);

    } catch (error) {
        console.error("Error fetching user favorites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    try {
        const { userId, recipeId } = req.params;

        await db.delete(favoriteRecipes).where(and(eq(favoriteRecipes.userId, userId), eq(favoriteRecipes.recipeId, parseInt(recipeId))));

        res.status(200).json({ message: "Favorite deleted successfully" });

    } catch (error) {
        console.error("Error deleting favorite:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port:`, PORT);
});
