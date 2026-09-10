const express = require("express");
const { registerUser, loginUser, createDemoUser, getCurrentUser } = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/demo", createDemoUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;
