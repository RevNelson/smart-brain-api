const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI
});

const handleAPI = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(() => res.status(400).json("Error fetching image"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(400).json("Error incrementing entries");
      }
    })
    .catch(err => {
      res.status(400).json("Error getting entries");
    });
};

module.exports = {
  handleImage: handleImage,
  handleAPI: handleAPI
};