const Rating = require('../database/dbfunctions/rating');
const Recipes = require('../database/dbfunctions/recipes');

const RatingController = {
// Create and Save a new Recipes
  create: async (req, res) => {
    try {
      const { id } = req.params;
      // check if recipe exist
      const recipeExist = await Recipes.fetchById(id);
      if (!recipeExist) {
        return res.status(400).send({
          success: false,
          message: `Recipe with id ${id} does not exist`,
        });
      }

      // define variables
      const { Rate } = req.body;

      // validate Rate
      if ((typeof Rate !== 'number') || (Rate <= 0) || (Rate > 5)) {
        return res.status(400).send({
          success: false,
          message: 'Rate should be a number between 1 and 5',
        });
      }

      const rating = {
        RecipeId: id,
        Rate,
      };

      // Save rating in the database
      const rate = await Rating.saveRating(rating);
      if (!rate) {
        return res.status(400).send({
          success: false,
          message: 'Failed to save rating!',
        });
      }

      return res.status(201).send({
        success: true,
        data: rate,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'An error occured while saving rating',
      });
    }
  },
};

module.exports = RatingController;
