'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

  it('GET request "/id" should return the note', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        return chai.request(app)
          .get(`/api/notes/${res.body[0].id}`)
          .then(function (res) {
            expect(res).to.exist;
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
            expect(res.body.title).to.be.a.string;
            expect(res.body.content).to.be.a.string;
          })
          .catch(function (_res) {
            expect(_res).to.have.status(404);
          });
      });
  });

  it('PUT request "/id" should return 200', function () {
    const obj = {
      id:'',
      title: 'foo',
      content: 'bar'
    };
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        obj.id = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${res.body[0].id}`)
          .send(obj);
      })
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
      })
      .catch(function(res) {
        expect(res).to.have.status(400);
      });
  });

  it('POST request should return 200', function () {
    const obj = {
      title: 'foo',
      content: 'bar',
      id: 1018
    };
    return chai.request(app)
      .post('/api/notes')
      .send(obj)
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(201);
      })
      .catch(function (res) {
        expect(res).to.have.status(400);
      });
  });

  it('DELETE request "/id" should return 204', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        const id = res.body[0].id;
        return chai.request(app)
          .delete(`/api/notes/${res.body[0].id}`)
          .then(function (res) {
            expect(res).to.have.status(204);
          })
          .catch(function (res) {
            expect(res).to.have.stutus(400);
          });
      });
  });
});
  
describe('404 handler', function () {
  
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/bad/path')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
  
});
