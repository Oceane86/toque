import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

export default Recipe;
