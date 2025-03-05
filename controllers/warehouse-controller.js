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

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        message: `Warehouse ID ${id} is invalid`,
      });
    }

    const warehouseDeleted = await knex("warehouses")
      .where({ id: id })
      .delete();

    if (warehouseDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${id} not found` });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      message: `Unable to delete warehouse with ID ${id}`,
    });
  }
};

function validate(
  warehouse_name,
  address,
  city,
  country,
  contact_name,
  contact_position,
  contact_phone,
  contact_email
) {
  // Validate warehouse_name
  const warehouseNameRegex = /^[a-zA-Z0-9\s\-',.]+$/;
  if (!warehouseNameRegex.test(warehouse_name)) {
    return "Invalid warehouse name format. Warehouse name should only contain 'A-Z', 'a-z', '0-9', '-', ',', ' ', '.', '''.";
  }
  // Validate address
  const addressRegex = /^[a-zA-Z0-9\s\-',.#/()]+$/;
  if (!addressRegex.test(address)) {
    return "Invalid address format. Address should only contain 'A-Z', 'a-z', '0-9', '-', ',', ' ', '.', '#', '/', '()', '''.";
  }
  // Validate city, country, and contact_name
  const cityCountryContactnameRegex = /^[a-zA-Z\s\-']+$/;
  if (!cityCountryContactnameRegex.test(city)) {
    return "Invalid city format. City should only contain 'A-Z', 'a-z', '-', ' ', '''.";
  }
  if (!cityCountryContactnameRegex.test(country)) {
    return "Invalid country format. Country should only contain 'A-Z', 'a-z', '-', ' ', '''.";
  }
  if (!cityCountryContactnameRegex.test(contact_name)) {
    return "Invalid contact name format. Contact name should only contain 'A-Z', 'a-z', '-', ' ', '''.";
  }
  // Validate contact_position
  const contactPositionRegex = /^[a-zA-Z0-9\s\-',./]+$/;
  if (!contactPositionRegex.test(contact_position)) {
    return "Invalid contact position format. Contact position should only contain 'A-Z', 'a-z', '-', ' ', ''', '.', '/'.";
  }
  // Validate phone number format
  const phoneRegex = /^\+?\d{1,3}[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
  if (!phoneRegex.test(contact_phone)) {
    return "Invalid phone number format. Expected format: +X (XXX) XXX-XXXX.";
  }
  // Validate email format
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(contact_email)) {
    return "Invalid email format. Example of valid format: user@example.com.";
  }
}

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

  if (
    validate(
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email
    )
  ) {
    return res.status(400).json({
      message: validate(
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email
      ),
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

export { index, findOne, getInventories, remove, add };
