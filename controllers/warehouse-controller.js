import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

const getInventories = async (req, res) => {
  try {
    const inventories = await knex("inventories")
      .where("inventories.warehouse_id", req.params.id)
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    res.status(200).json(inventories);
  } catch (err) {
    res.status(404).send({
      message: `Unable to retrieve warehouse with ID ${req.params.id}`,
    });
  }
};

export { index, getInventories };
