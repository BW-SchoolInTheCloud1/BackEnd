const router = require("express").Router();
const Todos = require("../todos/todos-model.js");

router.post("/:id/todos", async (req, res, next) => {
  const admin_id = req.params.id;
  if (!req.body) {
    next("missing todo data");
  } else {
    let { title, description, is_completed, volunteer_id } = req.body;
    if (!title || !description) {
      next("Todo title and description are required");
    } else if (!volunteer_id) {
      next("A valid volunteer_id is required");
    }
  } // todo validated
  const todo = {
    title,
    description,
    is_completed,
    admin_id,
    volunteer_id
  };

  try {
    const newTodo = await Todos.addTodo(todo, admin_id, volunteer_id);
    console.log("newTodo", newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/todos", async (req, res, next) => {
  if (!req.body) {
    return next("missing todo data");
  } else {
    const updates = req.body;
    const todos_id = updates.todos_id;
    try {
      const todo = await Todos.findBy({ todos_id });
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
  const { admin_id } = req.params;
  try {
    const todos = await Todos.findBy({ admin_id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
