import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
    try {
        const data = await knex("inventories")
        .join("warehouses", "warehouses.id", "inventories.warehouse_id")
        .select("inventories.id",
            "warehouses.warehouse_name",
            "inventories.item_name",
            "inventories.description",
            "inventories.category",
            "inventories.status",
            "inventories.quantity");
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(`Error retrieving inventory: ${err}`);
    }
}

export { index }