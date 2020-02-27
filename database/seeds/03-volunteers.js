exports.seed = function(knex) {
  return knex("volunteer").insert([
    {
      id: 2,
      availability: "Monday - Thursday 8am - 2pm",
      country: "USA",
      user_id: 1
    }
  ]);
};
