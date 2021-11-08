const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// Setting ejs as the view engine
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//A new route handler for "/urls" with res.render() to pass the URL data to our template.
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//A GET route to render the url submission form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Another route to add another page to display a single URL and its shortened form
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

// Sending a simple string "Hello!"
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Sending JSON string : Representing the entire urlDatabase object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//Sending HTML : Response can contain HTML code, which would be rendered in the client browser
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
