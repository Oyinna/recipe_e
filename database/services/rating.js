const Rate = require('../models/rating');

const RatingClass = {
  //  ------save data------
  saveRating: async (rating) => {
    const rate = await Rate.create(rating);
    if (!rate) {
      return false;
    }
    console.log(rate);
    return rate;
  },

  deleteRatings: async (id) => {
    const rate = await Rate.deleteMany({ RecipeId: id });
    if (!rate) {
      return false;
    }
    return rate;
  },
};

module.exports = RatingClass;
