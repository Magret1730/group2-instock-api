import express from 'express';
import * as userController from '../controllers/warehouse-controller.js';

const router = express.Router();

router.route("/").get(userController.index);

export default router;