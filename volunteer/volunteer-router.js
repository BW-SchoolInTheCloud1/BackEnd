const router = require("express").Router();

const Todos = require("../todos/todos-model.js");
const Volunteers = require("./volunteer-model.js");

// /api/volunteer

router.get("/", (req, res) => {
  Volunteers.find()
    .then(volunteers => {
      if (!volunteers) {
        res.status(400).json({ message: "There are no volunteers!" });
      } else {
        res.status(200).json(volunteers);
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
});

router.get("/:id", (req, res, next) => {
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

router.get("/:id/todos", (req, res, next) => {
  const { id } = req.params;
  Todos.findBy({ volunteer_id: id })
    .then(todos => {
      if (!todos) {
        next(`There are no todos for volunteer_id: ${id}`);
      } else {
        res.status(200).json(todos);
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
});

router.put("/:id", async (req, res, next) => {
  if (!req.body) {
    return next("missing volunteer data");
  } else {
    const updates = req.body;
    const id = req.params.id;
    Volunteers.findById(id)
      .then(volunteer => {
        if (!volunteer) {
          next(`There is no volunteer with the id of ${id} to update`);
        } else {
          Volunteers.update(id, updates)
            .then(updatedVol => {
              res.status(201).json(updatedVol);
            })
            .catch(error => {
              res.status(500).json({ message: error.message });
            });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  }
});

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  Volunteers.findById(id)
    .then(volunteer => {
      if (!volunteer) {
        next(`There is no volunteer with the id of ${id} to delete`);
      } else {
        Volunteers.del(id).then(removed => {
          res.status(200).json({
            message: `Removed ${removed} volunteer from the database`,
            removedVolunteer: volunteer
          });
        });
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
});

module.exports = router;
