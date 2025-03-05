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

const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        message: `Warehouse ID ${id} is invalid`,
      });
    }
    const warehouseFound = await knex("warehouses").where({ id: id });

    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${id} not found`,
      });
    }
    const warehouseData = warehouseFound[0];
    res.status(200).json(warehouseData);
  } catch (err) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${id}`,
    });
  }
};

const getInventories = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        message: `Warehouse ID ${id} is invalid`,
      });
    }

    const inventories = await knex("inventories")
      .where("inventories.warehouse_id", id)
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
      message: `Unable to retrieve warehouse with ID ${id}`,
    });
  }
};

const add = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  // all fields are required - check for empty fields
  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({
      message:
        "Please provide all required warehouse properties in the request",
    });
  }

  // phone and email validation
  if (contact_phone.length < 9) {
    return res.status(400).json({
      message: "Please provide a valid phone number",
    });
  }
  if (
    !contact_email.includes("@") ||
    !contact_email.includes(".") ||
    contact_email.indexOf("@") >
      contact_email.indexOf(".", contact_email.indexOf("@"))
  ) {
    return res.status(400).json({
      message: "Please provide a valid email address",
    });
  }

  try {
    const result = await knex("warehouses").insert(req.body);
    const newWarehouseId = result[0];
    const createdWarehouse = await knex("warehouses").where({
      id: newWarehouseId,
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });
    res.status(201).json(createdWarehouse);
  } catch (err) {
    res.status(500).json({
      message: `Unable to create new warehouse: ${err}`,
    });
  }
};

export { index, findOne, getInventories, add };
