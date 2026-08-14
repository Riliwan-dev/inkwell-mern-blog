import express from "express";
import { getUsers, updateUserRole, deleteUser } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getUsers);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;
