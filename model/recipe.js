import mongoose from "mongoose";
const { Schema, model } = mongoose;

const recipeSchema = new Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  cookingTime: Number
});

const Recipe = model("Recipe", recipeSchema);
export default Recipe;
