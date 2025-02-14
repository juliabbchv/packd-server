import trips from "../seed-data/trips-data.js";

export async function seed(knex) {
  await knex("trips").del();
  await knex("trips").insert(trips);
}
