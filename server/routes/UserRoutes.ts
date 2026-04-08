import express from "express";
import createAdmin from "../controller/User/createAdmin";
import loginAdmin from "../controller/User/loginAdmin";

const router = express.Router();

router.post("/register", createAdmin);
router.post("/login", loginAdmin);

export default router;
