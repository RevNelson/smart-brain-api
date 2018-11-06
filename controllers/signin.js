const jwt = require("jsonwebtoken");

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

const getAuthTokenID = () => {
  console.log("auth ok");
};

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "2 days" });
};

const createSessions = user => {
  // JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return { success: "true", userId: id, token };
};

const authentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenID()
    : handleSignIn(db, bcrypt, req, res)
        .then(user => {
          return user.id && user.email ? createSessions(user) : Promise.reject(user);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = {
  authentication
};