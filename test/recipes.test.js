/* eslint-disable no-undef */
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../database/models/users');
const UserService = require('../database/services/users');
const RecipeService = require('../database/services/recipes');

let id;
let token;

describe('test the recipes API', () => {
  beforeAll(async (done) => {
    // create a test user
    const password = bcrypt.hashSync('okay', 10);
    await User.create({ username: 'admin', password });

    // // get access token
    // const res1 = await request(app).get('/login').send({ username: 'admin', password: 'okay' });

    // token = res1.body.accessToken;
    // // eslint-disable-next-line no-underscore-dangle
    done();
  });

  afterAll(async (done) => {
    await User.deleteMany();
    done();
  });

  // test login
  describe('POST /login', () => {
    it('authenticate user and sign him in', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'admin',
        password: 'okay',
      };

      const res = await request(app)
        .post('/login')
        .send(user);

      token = res.body.accessToken;

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          accessToken: res.body.accessToken,
          success: true,
          data: expect.objectContaining({
            id: res.body.data.id,
            username: res.body.data.username,
          }),
        }),
      );
      done();
    });

    it('do not sign him in, password field can not be empty', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'admin',
      };
      const res = await request(app)
        .post('/login')
        .send(user);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'username or password can not be empty',
        }),
      );
      done();
    });

    it('do not sign him in, username field can not be empty', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        password: 'okay',
      };
      const res = await request(app)
        .post('/login')
        .send(user);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'username or password can not be empty',
        }),
      );
      done();
    });

    it('do not sign him in, username does not exist', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'chii',
        password: 'okay',
      };
      const res = await request(app)
        .post('/login')
        .send(user);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Incorrect username or password',
        }),
      );
      done();
    });

    it('do not sign him in, incorrect password', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'admin',
        password: 'okay1',
      };
      const res = await request(app)
        .post('/login')
        .send(user);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Incorrect username or password',
        }),
      );
      done();
    });

    it('do not sign him in, internal server error', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'admin',
        password: 'okay',
      };
      jest.spyOn(UserService, 'findByUsername').mockRejectedValueOnce(new Error());

      const res = await request(app).post('/login').send(user);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'login failed.',
        }),
      );
      done();
    });
  });

  // test create recipes
  describe('POST /recipes', () => {
    it('it should save new recipe to db', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipes = {
        name: 'Chicken Nuggets',
        difficulty: 2,
        vegetarian: true,
      };
      const res = await request(app)
        .post('/recipes')
        .send(recipes)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.any(Object),
        }),
      );
      // eslint-disable-next-line no-underscore-dangle
      id = res.body.data._id;
      done();
    });

    it('it should not save new recipe to db, invalid vegetarian value,', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipe = {
        name: 'Chicken Nuggets',
        difficulty: 3,
        vegetarian: 'true',
      };
      const res = await request(app)
        .post('/recipes')
        .send(recipe)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'vegetarian field should be boolean',
        }),
      );
      done();
    });

    it('it should not save new users to db, empty name field', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipe = {
        difficulty: 2,
        vegetarian: true,
      };
      const res = await request(app)
        .post('/recipes')
        .send(recipe)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'name field can not be empty',
        }),
      );
      done();
    });

    it('it should not save new users to db, invalid difficulty field', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipe = {
        name: 'Jollof Rice',
        difficulty: '2',
        vegetarian: true,
      };
      const res = await request(app)
        .post('/recipes')
        .send(recipe)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'difficulty field should be a number',
        }),
      );
      done();
    });

    it('it should not save new recipe to db, invalid token', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipes = {
        name: 'Chicken Nuggets',
        difficulty: 2,
        vegetarian: true,
      };
      const res = await request(app)
        .post('/recipes')
        .send(recipes)
        .set('Authorization', 'Bearer iuhbfwdfy65434567ub');
      expect(res.statusCode).toEqual(403);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      );
      done();
    });

    it('It should not save new recipe to db, internal server error.', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipes = {
        name: 'Chicken Nuggets',
        difficulty: 2,
        vegetarian: true,
      };
      jest.spyOn(RecipeService, 'saveRecipes').mockRejectedValueOnce(new Error());

      const res = await request(app)
        .post('/recipes')
        .send(recipes)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Failed to save recipes!',
        }),
      );
      done();
    });
  });

  // test get all recipe
  describe('GET /recipes', () => {
    it('It should retrive all the recipes in db', async (done) => {
      const res = await request(app)
        .get('/recipes');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.any(Object),
        }),
      );
      done();
    });

    it('It should not retrive any recipe from db, internal server error.', async (done) => {
      jest.spyOn(RecipeService, 'allRecipes').mockRejectedValueOnce(new Error());

      const res = await request(app).get('/recipes').send();

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Some error occurred while retrieving recipes.',
        }),
      );
      done();
    });
  });

  // test get a particular recipe
  describe('GET /recipes/:id', () => {
    it('Retrive a specified recipes in db', async (done) => {
      const res = await request(app)
        .get(`/recipes/${id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.any(Object),
        }),
      );
      done();
    });

    it('It should not retrive any recipes from db, invalid id passed', async (done) => {
      const res = await request(app)
        .get('/recipes/5fb8f36031ea2a10a0ccd111');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Recipe with id 5fb8f36031ea2a10a0ccd111 does not exist',
        }),
      );
      done();
    });
    it('It should not retrive any recipe from db, internal server error', async (done) => {
      // DATA YOU WANT TO SAVE TO DB

      jest.spyOn(RecipeService, 'fetchById').mockRejectedValueOnce(new Error());

      const res = await request(app).get(`/recipes/${id}`);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Some error occurred while retrieving recipe details.',
        }),
      );
      done();
    });
  });

  // Test update recipe
  describe('PATCH /recipes/:id', () => {
    it('update the recipe record in db', async (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipes = {
        name: 'Chicken Nuggets',
      };
      const res = await request(app)
        .patch(`/recipes/${id}`)
        .send(recipes)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.any(Object),
        }),
      );
      done();
    });

    it('it should not update recipe in db, invalid difficulty value', async (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipe = {
        name: 'Jollof Rice',
        difficulty: 'pp',
      };
      const res = await request(app)
        .patch(`/recipes/${id}`)
        .send(recipe)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'difficulty field should be a number',
        }),
      );
      done();
    });

    it('it should not update recipe in db, invalid vegetarian value,', async (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipe = {
        difficulty: 3,
        vegetarian: 'true',
      };
      const res = await request(app)
        .patch(`/recipes/${id}`)
        .send(recipe)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'vegetarian field should be boolean',
        }),
      );
      done();
    });

    it('it should not update recipe in db, invalid id passed', async (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipe = {
        difficulty: 3,
      };
      const res = await request(app)
        .patch('/recipes/5fb8f36031ea2a10a0ccd111')
        .send(recipe)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Recipe with id 5fb8f36031ea2a10a0ccd111 does not exist',
        }),
      );
      done();
    });

    it('it should not update recipe in db, invalid token', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipes = {
        name: 'Chicken Nuggets',
      };
      const res = await request(app)
        .patch(`/recipes/${id}`)
        .send(recipes)
        .set('Authorization', 'Bearer iuhbfwdfy65434567ub');
      expect(res.statusCode).toEqual(403);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      );
      done();
    });

    it('it should not update recipe in db, no update passed', async (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipes = {};
      const res = await request(app)
        .patch(`/recipes/${id}`)
        .send(recipes)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'field should not be empty',
        }),
      );
      done();
    });

    it('It should not update recipe in db, internal server error', async (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipes = {
        name: 'Chicken Nuggets',
      };

      jest.spyOn(RecipeService, 'fetchByIdAndUpdate').mockRejectedValueOnce(new Error());

      const res = await request(app)
        .patch(`/recipes/${id}`)
        .send(recipes)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'An error occured while updating recipe',
        }),
      );
      done();
    });
  });

  // test delete recipe
  describe('DELETE /recipes/:id', () => {
    it('Delete the specified recipe', async (done) => {
      const res = await request(app)
        .delete(`/recipes/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          message: 'Recipe successfully deleted',
        }),
      );
      done();
    });

    it('Fail to delete the specified recipe, invalid token', async (done) => {
      const res = await request(app)
        .delete(`/recipes/${id}`)
        .set('Authorization', 'Bearer iuhbfwdfy65434567ub');
      expect(res.statusCode).toEqual(403);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: 'Unauthorized',
        }),
      );
      done();
    });

    it('Fail to delete the specified recipe, internal server error', async (done) => {
      jest.spyOn(RecipeService, 'fetchByIdAndDelete').mockRejectedValueOnce(new Error());

      const res = await request(app)
        .delete(`/recipes/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'An error occured while deleting recipe',
        }),
      );
      done();
    });
  });
});
