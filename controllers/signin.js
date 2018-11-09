const client = require('./authorization').client;
const getAuthTokenID = require('./authorization').getAuthTokenID;
const createSessions = require('./authorization').createSessions;

const handleSignIn = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const verified = bcrypt.compareSync(password, data[0].hash);
      if (verified) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => user[0])
          .catch(err => Promise.reject("unable to get user"));
      } else {
        Promise.reject("wrong credentials");
      }
    })
    .catch(err => Promise.reject("wrong credentials"));
};

const authentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenID(req, res)
    : handleSignIn(db, bcrypt, req, res)
        .then(user => {
          return user.id && user.email ? createSessions(user) : Promise.reject(user);
        })
        .then(session => res.json(session))
        .catch(err => console.log(err));
};

module.exports = {
  authentication
};