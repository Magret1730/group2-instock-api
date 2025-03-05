import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/").get(warehouseController.index);
router.route("/:id/inventories").get(warehouseController.getInventories);

export default router;
