import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
    try {
        // queries inventories database
        const data = await knex("inventories")
        .join("warehouses", "warehouses.id", "inventories.warehouse_id")
        .select("inventories.id",
            "warehouses.warehouse_name",
            "inventories.item_name",
            "inventories.description",
            "inventories.category",
            "inventories.status",
            "inventories.quantity");
        
        // sends a response with the appropriate status code
        res.status(200).json(data);
    } catch (err) {
        res.status(500).send(`Error retrieving inventory: ${err}`);
    }
}

const findOne = async (req, res) => {
    try {
        // gets id to make the request
        const { id } = req.params;

        // checks for valid id
        if (isNaN(id)) {
            return res.status(400).json({
                message: `Inventory with ID ${id} is invalid`
            });
        }

        // queries inventories database with the id
        const inventoryFound = await knex("inventories")
            .where("inventories.id", id)
            .join("warehouses", "warehouses.id", "inventories.warehouse_id")
            .select("inventories.id",
                "warehouses.warehouse_name",
                "inventories.item_name",
                "inventories.description",
                "inventories.category",
                "inventories.status",
                "inventories.quantity");

        // checks if no inventory has the id
        if (inventoryFound.length === 0) {
            return res.status(404).json({
                message: `Inventory with ID ${id} not found` 
            });
        }

        // returns response with the data
        const inventoryData = inventoryFound[0];
        res.json(inventoryData);
    } catch (err) {
        res.status(500).json({
            message: `Unable to retrieve inventory data for inventory with ID ${id}`,
        });
    }
}

const remove = async (req, res) => {
    try {
        // gets id to make the request
        const { id } = req.params;

        // checks for valid id
        if (isNaN(id)) {
            return res.status(400).json({
                message: `Inventory with ID ${id} is invalid`
            });
        }

        // queries inventories database with the id
        const rowsDeleted = await knex("inventories")
        .where({ id: id })
        .delete();

        // checks if no inventory has the id
        if (rowsDeleted === 0) {
            return res
                .status(404)
                .json({ message: `Inventory with ID ${id} not found` });
        }

        // No Content response
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            message: `Unable to delete inventory: ${error}`
        });
    }
};

export { index, findOne, remove }