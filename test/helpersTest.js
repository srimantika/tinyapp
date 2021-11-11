const { assert } = require('chai');

const { userIdFromEmail, emailHasUser} = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('userIdFromEmail', function() {
  it('should return a user with valid email', function() {
    const user = userIdFromEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });

  it('should return undefined when no user exists for a given email address', function() {
    const user = userIdFromEmail("me@test.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });

});

describe('emailHasUser', function() {
  
  it('should return false if email does not correspond to a user in the database', function() {
    const nonExistantEmail = emailHasUser("fake_email@test.com", testUsers);
    const expectedOutput = false;
    assert.equal(nonExistantEmail, expectedOutput);
  });

  it('should return true if email corresponds to a user in the database', function() {
    const existingEmail = emailHasUser("user2@example.com", testUsers);
    const expectedOutput = true;
    assert.equal(existingEmail, expectedOutput);
  });

});
