const express = require("express");
const {
  getAllUsers,
  getUser,
  postCreateUser,
  patchEditUser,
  deleteUser,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id", patchEditUser);
router.delete("/users/:id", deleteUser);
router.post("/create-user", postCreateUser);

module.exports = router;
