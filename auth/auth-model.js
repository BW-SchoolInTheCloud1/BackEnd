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
    .select("*")
    .where(filter)
    .first();
}

async function findTypeById(id, type) {
  user = await db(type)
    .select("*")
    .where({ id })
    .first();

  return user;
}

async function addUser(user) {
  const [id] = await db("users").insert(user, "id");
  console.log("auth-model, addUser", id);

  return await findById(id);
}

async function addAdmin(user) {
  console.log(user);
  const [id] = await db("admin").insert(user, "id");
  const admin = await db("admin")
    .select("*")
    .where({ id })
    .first();

  return admin;
}

async function addVolunteer(user) {
  const [id] = await db("volunteer")
    .insert(user, "id")
    .returning("id");

  const volunteer = await db("volunteer")
    .select("*")
    .where({ id })
    .first();

  return volunteer;
}

async function addStudent(user) {
  const [id] = await db("student")
    .insert(user, "id")
    .returning("id");

  const student = await db("student")
    .select("*")
    .where({ id })
    .first();

  return student;
}
