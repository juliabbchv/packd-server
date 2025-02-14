import users from "../seed-data/users-data.js";

export async function seed(knex) {
  await knex("users").del();
  await knex("users").insert(users);
}
