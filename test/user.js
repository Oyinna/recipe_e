/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

// assertion style
chai.should();
chai.use(chaiHttp);

describe('test the users API', () => {
  // test login
  describe('GET /login', () => {
    it('authenticate user and sign him in', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'admin',
        password: 'okay',
      };
      chai.request(app)
        .get('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('accessToken');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          done();
        });
    });

    it('do not sign him in, empty password field', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'admin',
      };
      chai.request(app)
        .get('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('username or password can not be empty');
          done();
        });
    });

    it('do not sign him in, empty username field', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        password: 'okay',
      };
      chai.request(app)
        .get('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('username or password can not be empty');
          done();
        });
    });

    it('do not sign him in, username does not exist', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'chii',
        password: 'okay',
      };
      chai.request(app)
        .get('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Incorrect username or password');
          done();
        });
    });

    it('do not sign him in, incorrect password', (done) => {
      // DATA YOU WANT TO SAVE TO DB
      const user = {
        username: 'admin',
        password: 'okay1',
      };
      chai.request(app)
        .get('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('message').eq('Incorrect username or password');
          done();
        });
    });
  });
});
