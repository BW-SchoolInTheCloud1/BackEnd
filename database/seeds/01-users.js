exports.seed = function(knex) {
  return knex("users").insert([
    {
      id: 1,
      email: "admin@admin.com",
      password: "lambda",
      first_name: "john",
      last_name: "doe",
      role: "admin"
    },
    {
      id: 2,
      email: "volunteer@volunteer.com",
      password: "lambda",
      first_name: "jane",
      last_name: "doe",
      role: "volunteer"
    },
    {
      id: 3,
      email: "student@student.com",
      password: "lambda",
      first_name: "vivienne",
      last_name: "marie",
      role: "student"
    }
  ]);
};
