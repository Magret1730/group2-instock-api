import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const validateBodyRequest = (body) => {
  const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = body;

  // Validate all fields are non-empty
  if (!warehouse_name || !address || !city || !country || !contact_name || !contact_position || !contact_phone || !contact_email) {
    return "All fields are required and cannot be empty.";
  }

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

  // Validate phone number format
  const phoneRegex = /^\+?\d{1,3}[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
  if (!phoneRegex.test(contact_phone)) {
    return "Invalid phone number format. Expected format: +1 (XXX) XXX-XXXX.";
  }

  // Validate email format
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(contact_email)) {
    return "Invalid email format. Example of valid format: user@example.com.";
  }

  // Validate contact_position
  const contactPositionRegex = /^[a-zA-Z0-9\s\-',./]+$/;
  if (!contactPositionRegex.test(contact_position)) {
    return "Invalid contact position format. Contact position should only contain 'A-Z', 'a-z', '-', ' ', ''', '.', '/'.";
  }

  // If all validations pass, return null
  return null;
};

const index = async (_req, res) => {
  try {
    const data = await knex("warehouses").select(
      "id",
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email"
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

const findOne = async (req, res) => {
  try {
    // Gets id to make request
    const { id } = req.params;

    // Checks for invalid ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        message: `Warehouse ID ${id} is invalid`,
      });
    }

    // Queries database
    const warehouseFound = await knex("warehouses").where({ id: id });

    // checks if the warehouse exist
    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${id} not found`,
      });
    }

    // returns data if found
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
    // Gets id to make request
    const { id } = req.params;

    // Checks for invalid ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        message: `Warehouse ID ${id} is invalid`,
      });
    }

     // Queries database
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

    // returns data if found
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

    if (isNaN(id) || id <= 0) {
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

const update = async (req, res) => {
  // Gets id to make request
  const { id } = req.params;

  // Checks for invalid ID
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      message: `Warehouse ID ${id} is invalid`,
    });
  }

   // Validate the request body
  const validationError = validateBodyRequest(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  // Create the updated warehouse object
  const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;

  const newWarehouse = {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email
  };

  try {
    const rowsUpdated = await knex("warehouses")
      .where({ id: id })
      .update(newWarehouse);

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${id} not found` 
      });
    }

    const updatedWarehouse = await knex("warehouses")
      .where({ id: id })
      .first();

    // Check if the warehouse was found
    if (!updatedWarehouse) {
      return res.status(404).json({
        message: `Warehouse with ID ${id} not found`,
      });
    }
    
    // Extract only the required fields
    const filteredWarehouse = {
      warehouse_name: updatedWarehouse.warehouse_name,
      address: updatedWarehouse.address,
      city: updatedWarehouse.city,
      country: updatedWarehouse.country,
      contact_name: updatedWarehouse.contact_name,
      contact_position: updatedWarehouse.contact_position,
      contact_phone: updatedWarehouse.contact_phone,
      contact_email: updatedWarehouse.contact_email
    };

    // Return the filtered warehouse as the response
    res.status(200).json(filteredWarehouse);
  } catch (error) {
      res.status(500).json({
      message: `Unable to update warehouse with ID ${id}: ${error.message}` 
    });
  }
};

export { index, findOne, getInventories, update, remove };
