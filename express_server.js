const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port 8080

const { generateRandomString, emailHasUser, userIdFromEmail, urlsForUser, cookieHasUser } = require("./helpers");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'tinyappsrimantika',
  keys: ['key1', 'key2']
}));


const urlDatabase = {};
const users = {};

// Home page with proper redirects
app.get("/", (req, res) => {
  if (cookieHasUser(req.session.user_id, users)) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

//A new route handler for "/urls" with res.render() to pass the URL data to our template.
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

//A GET route to render the url submission form
app.get("/urls/new", (req, res) => {

  if (cookieHasUser(req.session.user_id, users)) {
    let templateVars = {
      user: users[req.session.user_id]
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

//A GET route for Register
app.get("/register", (req, res) => {
  if (cookieHasUser(req.session.user_id, users)) {
    res.redirect("/urls");
  } else {
    let templateVars = {
      user: users[req.session.user_id]
    };
    res.render("urls_registration", templateVars);
  }
});

// A GET route to match and handle the Post request of ShortURL form submission
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    if (longURL === undefined) {
      res.status(302);
    } else {
      res.redirect(longURL);
    }
  } else {
    res.status(404).send("The short URL you are trying to access does not correspond with a long URL at this time.");
  }
});

//A GET route for Login
app.get("/login", (req, res) => {
  if (cookieHasUser(req.session.user_id, users)) {
    res.redirect("/urls");
  } else {
    let templateVars = {
      user: users[req.session.user_id]
    };
    res.render("urls_login", templateVars);
  }
});

//Another route to add another page to display a single URL and its shortened form
app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    let templateVars = { shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]};
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send("The short URL you entered does not correspond with a long URL at this time.");
  }
});


//Post Request receive form submission with randomly generated short url String
app.post("/urls", (req, res) => {

  if (req.session.user_id) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL : req.body.longURL,
      userId : req.session.user_id
    };
    res.redirect((`/urls`));
  } else {
    res.status(401).send("You must be logged in to a valid account to create short URLs.");
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
      password: bcrypt.hashSync(submittedPassword, 10),
    };
    req.session.user_id = newUserID;
    res.redirect("/urls");
  }
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
    if (!bcrypt.compareSync(password, users[userID].password)) {
      res.status(403).send("Invalid Password!");
    } else {
      req.session.user_id = userID;
      res.redirect("/urls");
    }
  }
});

//Post Request for Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//Post Request for DELETE
app.post("/urls/:shortURL/delete", (req, res) => {
  const userUrls = urlsForUser(req.session.user_id, urlDatabase);
  if (Object.keys(userUrls).includes(req.params.shortURL)) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(401).send("You do not have authorization to delete this short URL.");
  }
});


//Post Request for EDIT
app.post("/urls/:id", (req, res) => {
  const userUrls = urlsForUser(req.session.user_id, urlDatabase);
  const shortURL = req.params.id;
  if (Object.keys(userUrls).includes(shortURL)) {
    urlDatabase[shortURL].longURL = req.body.newURL;
    res.redirect('/urls');
  } else {
    res.status(401).send("You do not have authorization to delete this short URL.");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
