const db = require("../database/dbConfig");

module.exports = {
  addUser,
  addUserByType,
  find,
  findBy,
  findById
};

function find() {
  return db("users");
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .select("id", "username", "password");
}

async function addUser(user) {
  const [id] = await db("users").insert(user);

  return findById(id);
}

async function addUserByType(user, type) {
  const [id] = await db(type).insert(user);
  return db(type)
    .where({ id })
    .first();
}
