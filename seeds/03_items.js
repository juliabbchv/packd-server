import items from "../seed-data/trip-items-data.js";

export async function seed(knex) {
  await knex("items").del();
  await knex("items").insert(items);
}
