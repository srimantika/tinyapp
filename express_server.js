const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

// Setting ejs as the view engine
app.set("view engine", "ejs");
// Set the body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "1234": {
    id: "1234",
    email: "test1@tinyurl.com",
    password: "testuser1"
  },
  "12345": {
    id: "12345",
    email: "test2@tinyurl.com",
    password: "testuser2"
  }
};



//A new route handler for "/urls" with res.render() to pass the URL data to our template.
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

//A GET route to render the url submission form
app.get("/urls/new", (req, res) => {

  if (!validUser(req.cookies.user_id, users)) {
    res.redirect("/login");
  } else {
    const templateVars = {
      urls: urlDatabase,
      user: users[req.cookies["user_id"]]
    };
    res.render("urls_new", templateVars);
  }
});

// A GET route to match and handle the Post request of ShortURL form submission
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  } else {
    res.status(404).send("The short URL you are trying to access does not correspond with a long URL at this time.");
  }
});
//Another route to add another page to display a single URL and its shortened form
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]]};
  res.render("urls_show", templateVars);
});
//A GET route for Login
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars);
});

//A GET route for Register
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_registration", templateVars);
});

//Post Request receive form submission with randomly generated short url String
app.post("/urls", (req, res) => {

if (req.cookies.user_id) {
        const shortURL = generateRandomString();
        urlDatabase[shortURL] = req.body.longURL;
        res.redirect((`/urls/${shortURL}`));
      } else {
      res.status(401).send("You must be logged in to a valid account to create short URLs.");
      }
});

//Post Request for DELETE
app.post("/urls/:shortURL/delete", (req, res) => {
  const idToDelete = req.params.shortURL;
  delete urlDatabase[idToDelete];
  res.redirect("/urls");
});



//Post Request for EDIT
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.newURL;
  res.redirect('/urls');
});

//Post Request for Login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const pass = emailHasUser(email,users);
  if (pass === false) {
    res.status(403).send("There is no account associated with this email address");
  } else {
    const userID = userIdFromEmail(email, users);
    if (users[userID].password !== password) {
      res.status(403).send("Invalid Password!");
    } else {
      res.cookie("user_id", users[userID].id);
      res.redirect("/urls");
    }
  }
});


//Post Request for Register
app.post("/register", (req, res) => {
  const submittedEmail = req.body.email;
  const submittedPassword = req.body.password;
  if (!submittedEmail || !submittedPassword) {
    res.status(400).send("Please include a valid email and password to create an Account!");
  } else if (emailHasUser(submittedEmail, users)) {
    res.status(400).send("An account already exists for this email address!");
  } else {
    const newUserID = generateRandomString();
    users[newUserID] = {
      id: newUserID,
      email: submittedEmail,
      password: submittedPassword,
    };
    res.cookie("user_id", newUserID);
    res.redirect("/urls");
  }
});

//Post Request for Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Helper Functions

/* Checks if user corresponds with a user in the userDatabase */
const validUser = function(cookie, userDatabase) {
  for (const user in userDatabase) {
    if (cookie === user) {
      return true;
    }
  } return false;
};

/* Checks if given email corresponds to a user in a given database, returns true or false */
const emailHasUser = function(email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
  return false;
};

/* Takes an email and userDatabase and returns the user ID for the user with the given email address */
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



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
