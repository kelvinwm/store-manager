let app = require('../js/index.js')
let assert = require('assert');
describe('Auth', function() {
  describe('Login', function() {
    it('should login a user', function(){
      assert.equal(app.testme(), "kenya");
    });
    it('should successfully add a new user', function(){
      assert.equal(0, [1,2,3].indexOf(1));
    });
  });

});