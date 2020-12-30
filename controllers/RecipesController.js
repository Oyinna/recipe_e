const Recipes = require('../database/dbfunctions/recipes');

const RecipesController = {
// Retrieve and return all recipes from the database.
  getAll: async (req, res) => {
    try {
      let { search } = req.query;
      if (!search) {
        search = '';
      }

      // pagination
      const page = parseInt(req.query.page, 10);
      const limit = parseInt(req.query.limit, 10);

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};
      const totalRecipes = await Recipes.totalNo();

      if (endIndex < totalRecipes) {
        results.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit,
        };
      }

      results.results = await Recipes.allRecipes(limit, startIndex, search);

      return res.status(200).send({
        success: true,
        data: results,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: err.message || 'Some error occurred while retrieving recipes.',
      });
    }
  },

  // Create and Save a new Recipes
  create: async (req, res) => {
    try {
      // define variables
      const {
        Name, Difficulty, Vegetarian,
      } = req.body;

      // validate vegetarian
      if (typeof Vegetarian !== 'boolean') {
        return res.status(400).send({
          success: false,
          message: 'Vegetarian field should be boolean',
        });
      }
      // validate Name
      if (!req.body.Name) {
        return res.status(400).send({
          success: false,
          message: 'Name field can not be empty',
        });
      }

      // validate Difficulty
      if ((typeof Difficulty !== 'number') || (Difficulty <= 0) || (Difficulty > 3)) {
        return res.status(400).send({
          success: false,
          message: 'Difficulty field should be a number',
        });
      }

      const recipesDetail = {
        Name,
        Difficulty,
        Vegetarian,
      };

      // Save user in the database
      const recipes = await Recipes.saveRecipes(recipesDetail);
      if (!recipes) {
        return res.status(500).send({
          success: false,
          message: 'Failed to save recipes!',
        });
      }

      return res.status(201).send({
        success: true,
        data: recipes,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'An error occured while saving recipes',
      });
    }
  },

  // Find a single recipes with an id
  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      // retrive recipes info
      const recipes = await Recipes.fetchById(id);
      if (!recipes) {
        return res.status(400).send({
          success: false,
          message: `Recipe with id ${id} does not exist`,
        });
      }

      return res.send({
        success: true,
        data: recipes,
      });
    } catch (err) {
      return res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving club details.',
      });
    }
  },

  // Update the recipes identified by the parameter
  update: async (req, res) => {
    try {
      // validate Difficulty if it exist
      if (req.body.Difficulty) {
        if ((typeof req.body.Difficulty !== 'number') || (req.body.Difficulty <= 0) || (req.body.Difficulty > 3)) {
          return res.status(400).send({
            success: false,
            message: 'Difficulty field should be a number',
          });
        }
      }
      // validate Vegetarian if it exist
      if (req.body.Vegetarian) {
        if (typeof req.body.Vegetarian !== 'boolean') {
          return res.status(400).send({
            success: false,
            message: 'Vegetarian field should be boolean',
          });
        }
      }

      const { id } = req.params;

      // check if recipe exist
      const recipeExist = await Recipes.fetchById(id);
      if (!recipeExist) {
        return res.status(400).send({
          success: false,
          message: `Recipe with id ${id} does not exist`,
        });
      }

      const recipesDetail = req.body;
      // Find recipe and update it with the request body
      const recipes = await Recipes.fetchByIdAndUpdate(id, recipesDetail);
      if (!recipes) {
        return res.status(500).send({
          success: false,
          message: 'Recipe update failed',
        });
      }
      return res.status(200).send({
        success: true,
        data: recipes,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: 'An error occured while updating recipes',
      });
    }
  },

  // Delete the recipes identified by the parameter
  delete: async (req, res) => {
    try {
      // define variables
      const { id } = req.params;

      // Find recipe and delete
      const recipes = await Recipes.fetchByIdAndDelete(id);
      if (!recipes) {
        return res.status(400).send({
          success: false,
          message: 'Invalid ID',
        });
      }
      return res.status(200).send({
        success: true,
        message: 'Recipe successfully deleted',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: 'An error occured while deleting recipe',
      });
    }
  },
};

module.exports = RecipesController;
