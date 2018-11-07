const jwt = require("jsonwebtoken");
const redis = require('redis');

const client = redis.createClient(process.env.REDIS_HOST)

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }
  return client.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    return next();
  })
}

const getAuthTokenID = (req, res) => {
  const { authorization } = req.headers
  client.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({id: reply})
  })
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "2 days" });
};

const setToken = (token, id) => {
  return Promise.resolve(client.set(token, id))
}

const createSessions = (user) => {
  // JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userID: id, token }
    })
    .catch(Promise.reject('error saving token'))
};

module.exports = {
  requireAuth,
  client,
  getAuthTokenID,
  createSessions
}