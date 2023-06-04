// Import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const { check, validationResult } = require('express-validator');
const app = require('../app');

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

// Define test cases
describe('GET /api/courses', () => {
  it('should return an array of courses', (done) => {
    chai.request(app)
      .get('/api/courses')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
});

describe('GET /api/search', () => {
  it('should return an array of courses', (done) => {
    chai.request(app)
      .get('/api/search')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
});


// describe('GET /api/:userId', () => {
//   it('should return an user with his id', (done) => {
//     const id = "642a69471e6ca36bba784a2f";
//     chai.request(app)
//       .get("/api/"+id)
//       .end((err, res) => {
//         res.should.have.status(200);
//         // res.body.should.be.a('object');
//         done();
//       });
//   });
// });


// describe('POST /api/login', () => {
//   it('should return a JWT token for valid credentials', (done) => {
//     chai.request(app)
//       .post('/api/login')
//       .send({
//         email: 'admin@iiits.in',
//         password: '111111'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
// });

describe('Protected Routes', () => {
  let token;

  before((done) => {
    // Log in and get JWT token
    chai.request(app)
      .post('/api/login')
      .send({ email: 'educator0@iiits.in', password: '111111' })
      .end((err, res) => {
        if (err) done(err);
        token = res.body.token;
        done();
      });
  });

  describe('GET /api/courses/:userId', () => {
    it('should return a 401 error without a valid token', (done) => {
      const id = "644a26125411d4c996bb4de1";
      chai.request(app)
        .get('/api/courses/'+id)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return a success message with a valid token', (done) => {
      const id = "644a26125411d4c996bb4de1";
      chai.request(app)
        .get('/api/courses/'+id)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});


