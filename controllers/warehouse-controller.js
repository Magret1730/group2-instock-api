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

const remove = async (req, res) => {
  try {
    const warehouseDeleted = await knex("warehouses")
      .where({ id: req.params.id })
      .delete();

    if (warehouseDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      message: `Unable to delete warehouse with ID ${req.params.id}`,
    });
  }
};

export { index, remove };
