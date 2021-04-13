const Recipes = require('../models/recipes');
const RecipesClass = {
  //  ------save data------
  saveRecipes: async (recipesDetail) => {
    return await Recipes.create(recipesDetail);
    
  },

  allRecipes: async () => {
    return await Recipes.find();
  },

  fetchById: async (id) => {
    return await Recipes.findById(id);
  },

  fetchByIdAndUpdate: async (id, recipesDetail) => {
    return await Recipes.findByIdAndUpdate(id, { $set: recipesDetail }, { new: true });
  },

  fetchByIdAndDelete: async (id) => {
    return await Recipes.findByIdAndDelete(id);
  },
};

module.exports = RecipesClass;
