import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getAllItems = async (req, res) => {
  try {
    const data = await knex("items");
    res.status(200).json(data);
  } catch {
    console.error("Error getting items:", err);
    res.status(500).send("Error getting items");
  }
};

export { getAllItems };
