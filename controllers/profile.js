const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      console.log(user);
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Error getting user");
      }
    });
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput
  db('users')
    .where({ id })
    .update({ name })
    .then(response => {
      if (response) {
        res.json("success")
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => res.status(400).json('error updating user'))
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate
};