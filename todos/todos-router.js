const router = require("express").Router();

const Todos = require("./todos-model");

// api/todos
router.get("/", (req, res) => {
  Todos.find()
    .then(todos => {
      res.status(200).json(todos);
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Todos.findById(id)
    .then(todo => {
      if (todo) {
        res.status(200).json(todo);
      } else {
        res
          .status(404)
          .json({ message: `There is no todo with id: ${id} to delete` });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await Todos.del(id);
    res.status(200).json(removed);
  } catch (error) {
    res.status(500).json({
      message: `Removed ${removed} todo from the database`
    });
  }
});

module.exports = router;
