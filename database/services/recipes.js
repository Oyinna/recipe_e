const Recipes = require('../models/recipes');
const Rating = require('./rating');

const RecipesClass = {
  //  ------save data------
  saveRecipes: async (recipesDetail) => {
    const recipes = await Recipes.create(recipesDetail);
    if (!recipes) {
      return false;
    }
    return recipes;
  },

  //  -----fetch data------
  totalNo: async () => {
    const no = await Recipes.countDocuments();
    return no;
  },

  allRecipes: async (limit, startIndex, search) => {
    const recipes = await Recipes.find({ Name: { $regex: search, $options: 'i' } })
      .limit(limit)
      .skip(startIndex)
      .sort('-createdOn');
    if (!recipes) {
      return false;
    }
    return recipes;
  },

  fetchById: async (id) => {
    const recipes = await Recipes.findById(id);
    if (!recipes) {
      return false;
    }
    return recipes;
  },

  fetchByIdAndUpdate: async (id, recipesDetail) => {
    const recipes = await Recipes.findByIdAndUpdate(id, { $set: recipesDetail }, { new: true });
    if (!recipes) {
      return false;
    }
    return recipes;
  },

  fetchByIdAndDelete: async (id) => {
    const recipes = await Recipes.findByIdAndDelete(id);
    if (!recipes) {
      return false;
    }
    // delete all the rating of this recipe
    const rating = await Rating.deleteRatings(id);
    if (!rating) {
      // undo the first stage and return false
      return false;
    }
    return recipes;
  },
};

module.exports = RecipesClass;
