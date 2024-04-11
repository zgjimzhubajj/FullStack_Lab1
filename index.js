
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import Recipe from "./model/recipe.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

// Show all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve a specific recipe by title
app.get("/api/recipes/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const recipe = await Recipe.findOne({ title: title });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new recipe
app.post("/api/recipes", async (req, res) => {
  const { title } = req.body;
  try {
    const existingRecipe = await Recipe.findOne({ title: title });
    if (existingRecipe) {
      return res.status(409).json({ message: "Recipe already exists" });
    }
    const recipe = new Recipe(req.body);
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a recipe
app.put("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    Object.assign(recipe, req.body);
    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a recipe
app.delete("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    await Recipe.deleteOne({ _id: id });
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

