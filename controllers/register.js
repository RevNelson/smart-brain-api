const client = require('./authorization').client;
const createSessions = require('./authorization').createSessions;


const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password, 10);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
          .into("users")
          .returning("*");
      })
      .then(user => {
          return user[0].id && user[0].email ? createSessions(user[0]) : Promise.reject(user[0]);
        })
      .then(session => res.json(session))
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister
};