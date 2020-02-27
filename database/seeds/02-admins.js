exports.seed = function(knex) {
  return knex("admin").insert([
    {
      id: 1,
      user_id: 1
    }
  ]);
};
