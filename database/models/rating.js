const mongoose = require('../dbConection');

const { Schema } = mongoose;

const RatingSchema = new Schema({
  RecipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recipes',
  },
  Rate: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  TheDate: {
    type: Date,
    default: new Date(),
    required: true,
  },

});

// rating model
mongoose.model('rating', RatingSchema);

// module exports
module.exports = mongoose.model('rating');
