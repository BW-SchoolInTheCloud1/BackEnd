const db = require("../database/dbConfig");

module.exports = {
  addUser,
  addAdmin,
  addVolunteer,
  addStudent,
  find,
  findBy,
  findById,
  findTypeBy,
  findTypeById
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
    .first();
}

function findTypeBy(filter, type) {
  return db(type)
    .where(filter)
    .first();
}

function findTypeById(id, type) {
  return db(type)
    .where({ id })
    .first();
}

async function addUser(user) {
  const [id] = await db("users").insert(user);

  return findById(id);
}

// function addUser(user) {
//   return db("users").insert(user);
// }

async function addAdmin(user) {
  console.log(user);
  const [id] = await db("admin")
    .insert(user)
    .returning("id");

  console.log("id", id);

  return db("admin")
    .where({ id })
    .first();
}

async function addVolunteer(user) {
  console.log(user);
  const [id] = await db("volunteer")
    .insert(user)
    .returning("id");

  console.log("id", id);

  return db("volunteer")
    .where({ id })
    .first();
}

async function addStudent(user) {
  console.log(user);
  const [id] = await db("student")
    .insert(user)
    .returning("id");

  console.log("id", id);

  return db("student")
    .where({ id })
    .first();
}
