/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const Recipes = require('../database/models/recipes');

// assertion style
chai.should();
chai.use(chaiHttp);
let id;

describe('test the rating API', () => {
  before(async () => {
    // create a test recipe
    const recipe = await Recipes.create({
      Name: 'Meat pie',
      PrepTime: new Date(),
      Difficulty: 3,
      Vegetarian: false,
    });
    // eslint-disable-next-line no-underscore-dangle
    id = recipe._id;
  });
  // test create recipes
  describe('POST /recipes/:id/rate', () => {
    it('it should save new rating to db', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const rating = {
        Rate: 4,
      };
      chai.request(app)
        .post(`/recipes/${id}/rate`)
        .send(rating)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          done();
        });
    });

    it('it should not save new rating in db, invalid id passed', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const rating = {
        Rate: 4,
      };
      chai.request(app)
        .post('/recipes/5fb8f36031ea2a10a0ccd111/rate')
        .send(rating)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Recipe with id 5fb8f36031ea2a10a0ccd111 does not exist');
          done();
        });
    });

    it('it should not save new rating in db, invalid Rate field', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const rating = {
        Rate: '4',
      };
      chai.request(app)
        .post(`/recipes/${id}/rate`)
        .send(rating)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Rate should be a number between 1 and 5');
          done();
        });
    });

    it('it should not save new rating in db, invalid Rate field', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const rating = {
        Rate: 7,
      };
      chai.request(app)
        .post(`/recipes/${id}/rate`)
        .send(rating)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Rate should be a number between 1 and 5');
          done();
        });
    });
  });
});
