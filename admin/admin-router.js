const router = require("express").Router();
const Todos = require("../todos/todos-model.js");

// api/admin

router.post("/:id/todos", async (req, res, next) => {
  const admin_id = req.params.id;
  if (!req.body) {
    next("missing todo data");
  } else {
    const { title, description, is_completed, volunteer_id } = req.body;
    if (!title || !description) {
      next("Todo title and description are required");
    } else if (!volunteer_id) {
      next("A valid volunteer_id is required");
    } else {
      // todo validated
      const todo = {
        title: title,
        description: description,
        is_completed: is_completed,
        admin_id: admin_id,
        volunteer_id: volunteer_id
      };

      try {
        const newTodo = await Todos.addTodo(todo);
        console.log("newTodo", newTodo);
        res.status(201).json(newTodo);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
});

router.put("/:id/todos", async (req, res, next) => {
  if (!req.body) {
    return next("missing todo data");
  } else {
    const updates = req.body;
    const id = updates.id;
    try {
      const todo = await Todos.findById(id);
      if (!todo) {
        next(`There is no todo with id: ${id} to update`);
      } else {
        const updatedTodo = await Todos.update(id, updates);
        res.status(201).json(updatedTodo);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

router.get("/:id/todos", async (req, res) => {
  const { id } = req.params;
  try {
    const todos = await Todos.findBy({ admin_id: id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
