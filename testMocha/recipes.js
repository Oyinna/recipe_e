/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../database/models/users');
// assertion style
chai.should();
chai.use(chaiHttp);
let id;
let token;

describe('test the recipes API', () => {
  before(async () => {
    // create a test user
    const password = bcrypt.hashSync('okay', 10);
    await User.create({ username: 'admin', password });

    // get access token
    const res1 = await chai.request(app).get('/login').send({ username: 'admin', password: 'okay' });

    token = res1.body.accessToken;
    // eslint-disable-next-line no-underscore-dangle
  });
  // test create recipes
  describe('POST /recipes', () => {
    it('it should save new recipe to db', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipes = {
        Name: 'Chicken Nuggets',
        Difficulty: 2,
        Vegetarian: true,
      };
      chai.request(app)
        .post('/recipes')
        .send(recipes)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          // eslint-disable-next-line no-underscore-dangle
          id = res.body.data._id;
          done();
        });
    });

    it('it should not save new recipe to db, invalid vegetarian feild,', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipe = {
        Name: 'Chicken Nuggets',
        Difficulty: 3,
        Vegetarian: 'true',
      };
      chai.request(app)
        .post('/recipes')
        .send(recipe)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Vegetarian field should be boolean');
          done();
        });
    });

    it('it should not save new users to db, empty Name field', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipe = {
        Difficulty: 2,
        Vegetarian: true,
      };
      chai.request(app)
        .post('/recipes')
        .send(recipe)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Name field can not be empty');
          done();
        });
    });

    it('it should not save new users to db, invalid Difficulty field', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipe = {
        Name: 'Jollof Rice',
        Difficulty: '2',
        Vegetarian: true,
      };
      chai.request(app)
        .post('/recipes')
        .send(recipe)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Difficulty field should be a number');
          done();
        });
    });

    it('it should not save new recipe to db, invalid token', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipes = {
        Name: 'Chicken Nuggets',
        Difficulty: 2,
        Vegetarian: true,
      };
      chai.request(app)
        .post('/recipes')
        .send(recipes)
        .set('Authorization', 'Bearer iuhbfwdfy65434567ub')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eq('Unauthorized');
          done();
        });
    });
  });

  // test get all recipe
  describe('GET /recipes', () => {
    before(async () => {
    });
    it('It should retrive all the recipes in db', (done) => {
      chai.request(app)
        .get('/recipes')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          res.body.data.results.should.be.a('array');
          done();
        });
    });
  });
  // test get a particular recipe
  describe('GET /recipes/:id', () => {
    it('Retrive a particular recipes in db', (done) => {
      chai.request(app)
        .get(`/recipes/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          done();
        });
    });

    it('It should not retrive any recipes from db, invalid id passed', (done) => {
      chai.request(app)
        .get('/recipes/5fb8f36031ea2a10a0ccd111')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Recipe with id 5fb8f36031ea2a10a0ccd111 does not exist');
          done();
        });
    });
  });

  // Test update recipe
  describe('PATCH /recipes/:id', () => {
    it('update the recipe record in db', (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipes = {
        Name: 'Chicken Nuggets',
      };
      chai.request(app)
        .patch(`/recipes/${id}`)
        .send(recipes)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          done();
        });
    });

    it('it should not update recipe in db, invalid Difficulty field', (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipe = {
        Name: 'Jollof Rice',
        Difficulty: '2',
      };
      chai.request(app)
        .patch(`/recipes/${id}`)
        .send(recipe)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Difficulty field should be a number');
          done();
        });
    });

    it('it should not update recipe in db, invalid vegetarian feild,', (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipe = {
        Difficulty: 3,
        Vegetarian: 'true',
      };
      chai.request(app)
        .patch(`/recipes/${id}`)
        .send(recipe)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Vegetarian field should be boolean');
          done();
        });
    });

    it('it should not update recipe in db, invalid id passed', (done) => {
      // DATA YOU WANT TO UPDATE IN DB
      const recipe = {
        Difficulty: 3,
      };
      chai.request(app)
        .patch('/recipes/5fb8f36031ea2a10a0ccd111')
        .send(recipe)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Recipe with id 5fb8f36031ea2a10a0ccd111 does not exist');
          done();
        });
    });

    it('it should not update recipe in db, invalid token', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const recipes = {
        Name: 'Chicken Nuggets',
      };
      chai.request(app)
        .patch(`/recipes/${id}`)
        .send(recipes)
        .set('Authorization', 'Bearer iuhbfwdfy65434567ub')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eq('Unauthorized');
          done();
        });
    });
  });

  // test delete recipe
  describe('DELETE /recipes/:id', () => {
    it('Delete the identified recipe', (done) => {
      chai.request(app)
        .delete(`/recipes/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('message').eq('Recipe successfully deleted');
          done();
        });
    });

    it('Failed to delete the identified recipe, invalid ID passed', (done) => {
      chai.request(app)
        .delete(`/recipes/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Invalid ID');
          done();
        });
    });

    it('Failed to delete the identified recipe, invalid token', (done) => {
      chai.request(app)
        .delete(`/recipes/${id}`)
        .set('Authorization', 'Bearer iuhbfwdfy65434567ub')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eq('Unauthorized');
          done();
        });
    });
  });
});
