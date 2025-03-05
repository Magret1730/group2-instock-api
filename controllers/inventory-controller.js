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

const findOne = async (req, res) => {
    try {
        const inventoryFound = await knex("inventories")
            .where("inventories.id", req.params.id)
            .join("warehouses", "warehouses.id", "inventories.warehouse_id")
            .select("inventories.id",
                "warehouses.warehouse_name",
                "inventories.item_name",
                "inventories.description",
                "inventories.category",
                "inventories.status",
                "inventories.quantity");

        if (inventoryFound.length === 0) {
            return res.status(404).json({
                message: `Inventory with ID ${req.params.id} not found` 
            });
        }

        const inventoryData = inventoryFound[0];
        res.json(inventoryData);
    } catch (err) {
        res.status(500).json({
            message: `Unable to retrieve inventory data for inventory with ID ${req.params.id}`,
        });
    }
}

export { index, findOne }