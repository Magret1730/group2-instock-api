import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
  try {
    // queries inventories database
    const data = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );

    // sends a response with the appropriate status code
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(`Error retrieving inventory: ${err}`);
  }
};

const findOne = async (req, res) => {
  try {
    // gets id to make the request
    const { id } = req.params;

    // checks for valid id
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        message: `Inventory with ID ${id} is invalid`,
      });
    }

    // queries inventories database with the id
    const inventoryFound = await knex("inventories")
      .where("inventories.id", id)
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );

    // checks if no inventory has the id
    if (inventoryFound.length === 0) {
      return res.status(404).json({
        message: `Inventory with ID ${id} not found`,
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
};

const remove = async (req, res) => {
  try {
    // gets id to make the request
    const { id } = req.params;

    // checks for valid id
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        message: `Inventory with ID ${id} is invalid`,
      });
    }

    // queries inventories database with the id
    const rowsDeleted = await knex("inventories").where({ id: id }).delete();

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
      message: `Unable to delete inventory: ${error}`,
    });
  }
};

//Create a New Inventory Item
const add = async (req, res) => {
  try {
    const { item_name, description, category, status, quantity, warehouse_id } =
      req.body;

    //Check if any fields are empty
    if (
      !item_name ||
      !description ||
      !category ||
      !status ||
      !warehouse_id ||
      quantity === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    //Check if warehouse ID exists
    const isWarehouseValid = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!isWarehouseValid) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${warehouse_id} not found` });
    }

    //Validate that quantity is a number
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        message: "Quantity must be a number greater than or equal to 0",
      });
    }

    const [newInventoryId] = await knex("inventories").insert(req.body);

    const newInventory = await knex("inventories")
      .where({ id: newInventoryId })
      .select(
        "id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity",
        "warehouse_id"
      );

    res.status(201).json(newInventory[0]);
  } catch (err) {
    res.status(500).json({ message: "Unable to create new inventory item" });
  }
};

const update = async (req, res) => {
  try {
    // get id to make the request
    const { id } = req.params;

    // check for valid id
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        message: `Inventory with ID ${id} is invalid`,
      });
    }

    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;

    // check if any fields are empty
    if (
      !warehouse_id ||
      !item_name ||
      !description ||
      !category ||
      !status ||
      quantity === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const newInventoryItem = {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    };

    // check if warehouse ID exists
    const isWarehouseValid = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!isWarehouseValid) {
      return res
        .status(400)
        .json({ message: `Warehouse with ID ${warehouse_id} not found` });
    }

    const rowsUpdated = await knex("inventories")
      .where({ id: id })
      .update(newInventoryItem);
    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Inventory item with ID ${id} not found`,
      });
    }

    // send only selected elements
    const updatedInventoryItem = await knex("inventories")
      .where({ id: id })
      .select(
        "id",
        "warehouse_id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      );
    res.status(200).json(updatedInventoryItem[0]);
  } catch (err) {
    res.status(500).json({
      message: `Unable to update inventory item with ID ${id}: ${err}`,
    });
  }
};

export { index, findOne, remove, add, update };
