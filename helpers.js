// Helper Functions for Tinyapp

// Checks if user corresponds with a user in the userDatabase */
const cookieHasUser = function(cookie, userDatabase) {
  for (const user in userDatabase) {
    if (cookie === user) {
      return true;
    }
  } return false;
};

// Checks if given email corresponds to a user in a given database, returns true or false */
const emailHasUser = function(email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
  return false;
};

//Takes an email and userDatabase and returns the user ID for the user with the given email address */
const userIdFromEmail = function(email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user].id;
    }
  }
};

//generates a Random String of 6 letters
const generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};

// Returns user urls
const urlsForUser = (userid, database) => {
  let userUrls = {};

  for (const shortURL in database) {

    if (database[shortURL].userId === userid) {
      userUrls[shortURL] = database[shortURL];
    }
  }
  return userUrls;
};

module.exports = {
  generateRandomString,
  emailHasUser,
  userIdFromEmail,
  urlsForUser,
  cookieHasUser
};