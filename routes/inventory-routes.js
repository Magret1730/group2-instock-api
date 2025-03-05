import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();

router.route("/").get(inventoryController.index);

router
  .route("/:id")
  .get(inventoryController.findOne)
  .delete(inventoryController.remove)
  .post(inventoryController.add);

export default router;
