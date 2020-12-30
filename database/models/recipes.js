const mongoose = require('../dbConection');

const { Schema } = mongoose;

const RecipesSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  PrepTime: {
    type: Date,
    default: new Date(),
  },
  Difficulty: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
  },
  Vegetarian: {
    type: Boolean,
    required: true,
  },

});

// club model
mongoose.model('recipes', RecipesSchema);

// module exports
module.exports = mongoose.model('recipes');
