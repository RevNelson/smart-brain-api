const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const helmet = require("helmet");
const knex = require("knex");

require("dotenv").config();

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const auth = require("./controllers/authorization")

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const app = express();
const port = 4400;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send('WORKING');
});

app.post("/signin", signin.authentication(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

app.put("/image", auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", auth.requireAuth, (req, res) => {
  image.handleAPI(req, res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));