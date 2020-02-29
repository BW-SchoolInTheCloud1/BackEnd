const db = require("../database/dbConfig");

module.exports = {
  find,
  findBy,
  findById,
  update,
  del
};

function find() {
  return db("volunteer");
}

function findBy(filter) {
  return db("volunteer").where(filter);
}

function findById(id) {
  return db("volunteer")
    .where({ id })
    .first();
}

async function update(id, changes) {
  await db("volunteer")
    .where({ id })
    .update(changes);

  return findById(id);
}

async function del(id) {
  const removed = await db("volunteer")
    .where({ id })
    .del();

  return removed;
}
