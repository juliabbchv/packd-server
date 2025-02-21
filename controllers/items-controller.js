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

const deleteTripItem = async (req, res) => {
  try {
    const item = await knex("items").where({ id: req.params.id }).first();
    console.log(item);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await knex("items").where({ id: req.params.id }).delete();

    res.status(204).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "There was an error deleting the item" });
  }
};

export { getAllItems, deleteTripItem };
