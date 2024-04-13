const express = require("express");
const { getAllUsers, getUser } = require("../controllers/usersController");

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUser);

module.exports = router;
