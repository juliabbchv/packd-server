import knex from "knex";
import knexConfig from "./knexfile.js";

const db = knex(knexConfig);

export default async function mockAuth(req, res, next) {
  try {
    const userId = 1;
    const user = await db("users").where({ id: userId }).first();

    if (!user) {
      return res.status(401).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Internal server error");
  }
}
