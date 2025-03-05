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
}

const findOne = async ( req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(404).json({
                message: `Warehouse with ID ${id} not found`
            });
        }
        const warehouseFound = await knex("warehouses")
            .where({ id: id });

        if (warehouseFound.length === 0) {
            return res.status(404).json({
                message: `Warehouse with ID ${id} not found` 
            });
            }
        const warehouseData = warehouseFound[0];
        res.status(200).json(warehouseData);
    } catch (err) {
        res.status(500).json({
            message: `Unable to retrieve warehouse data for warehouse with ID ${id}`
        });
    }
}



export {
    index,
    findOne,
}