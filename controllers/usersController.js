const UserProfile = require("../models/UserProfile");

exports.getAllUsers = (req, res) => {
  UserProfile.findAll()
    .then((users) => {
      res.status(200).json({
        message: "Users list retrieved successfully",
        data: {
          users,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "something went wrong",
      });
    });
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  UserProfile.findByPk(id)
    .then((user) => {
      res.status(user ? 200 : 400).json({
        message: user ? "Users found" : `User with id: ${id} unknown`,
        user: user || {},
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "something went wrong",
      });
    });
};
