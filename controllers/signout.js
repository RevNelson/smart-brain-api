const client = require('./authorization').client;

const revoke = (req, res) => {
  const { authorization } = req.headers
  client.del(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({success: true})
  })
};

module.exports = {
  revoke
};