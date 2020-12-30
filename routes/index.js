const express = require('express');

const router = express.Router();

const authenticateToken = require('./authenticateToken');
const RecipesController = require('../controllers/RecipesController');
const UserController = require('../controllers/UsersController');
const RatingController = require('../controllers/RatingController');

//  user routes
router.get('/login', UserController.login);

// recipes routes
router.post('/recipes', authenticateToken, RecipesController.create);
router.get('/recipes/', RecipesController.getAll);
router.get('/recipes/:id', RecipesController.getOne);
router.patch('/recipes/:id', authenticateToken, RecipesController.update);
router.delete('/recipes/:id', authenticateToken, RecipesController.delete);

// rating routes
router.post('/recipes/:id/rate', RatingController.create);

module.exports = router;
