const db = require("../database/dbConfig");

module.exports = {
  addTodo,
  find,
  findBy,
  findById,
  update,
  del
};

function find() {
  return db("todos");
}

function findById(id) {
  return db("todos")
    .where({ id })
    .first();
}

function findBy(filter) {
  return db("todos").where(filter);
}

async function addTodo(todo) {
  let newTodo = {
    title: todo.title,
    description: todo.description,
    is_completed: todo.is_completed || false,
    admin_id: todo.admin_id,
    volunteer_id: todo.volunteer_id
  };
  const [id] = await db("todos").insert(newTodo, "id");
  return await findById(id);
}

async function update(id, changes) {
  await db("todos")
    .where({ id })
    .update(changes);

  return findById(id);
}

async function del(id) {
  const todo = await db("todos")
    .where({ id })
    .del();

  return todo;
}
