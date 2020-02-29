const router = require("express").Router();

const Todos = require("../todos/todos-model.js");
const Volunteers = require("./volunteer-model.js");

// /api/volunteer

router.get("/", (req, res) => {
  Volunteers.find()
    .then(volunteers => res.status(200).json(volunteers))
    .catch(error => res.status(500).json({ message: error.message }));
});

router.get("/:id/", (req, res, next) => {
  const { id } = req.params;
  Volunteers.findById(id)
    .then(volunteer => {
      if (!volunteer) {
        next(`No Todo with the id of ${id}`);
      } else {
        res.status(200).json(volunteer);
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
});

module.exports = router;
