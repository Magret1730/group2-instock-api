import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/").get(warehouseController.index).post(warehouseController.add);
router
  .route("/:id")
  .get(warehouseController.findOne)
  .delete(warehouseController.remove)
  .put(warehouseController.update);

router.route("/:id/inventories").get(warehouseController.getInventories);

export default router;
