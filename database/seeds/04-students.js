exports.seed = function(knex) {
  return knex("student").insert([
    {
      id: 3,
      user_id: 1
    }
  ]);
};
