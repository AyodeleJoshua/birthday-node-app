const Joi = require("joi");
const UserProfile = require("../models/UserProfile");
const { Op, literal } = require("sequelize");
const sequelize = require("sequelize");

exports.getAllUsers = (req, res) => {
  const { dob } = req.query;
  const filterDob = dob?.split("-");
  let checkDob = [];
  if (dob && filterDob.length < 2) {
    res.status(400).json({
      message: "Date of birth must be in mm-dd format",
    });
    return;
  }
  if (dob && (filterDob.length > 2 || filterDob.length === 2)) {
    checkDob = [
      filterDob[filterDob.length - 1],
      filterDob[filterDob.length - 2],
    ];
  }

  UserProfile.findAll(
    dob
      ? {
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn("MONTH", sequelize.col("date_of_birth")),
                checkDob[1]
              ),
              sequelize.where(
                sequelize.fn("DAY", sequelize.col("date_of_birth")),
                checkDob[0]
              ),
            ],
          },
        }
      : {}
  )
    .then((users) => {
      res.status(200).json({
        message: "Users list retrieved successfully",
        users,
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
        message: user ? "User found" : `User with id: ${id} unknown`,
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

exports.postCreateUser = (req, res, next) => {
  const { firstName, lastName, dateOfBirth, phoneNumber, email } = req.body;

  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    dateOfBirth: Joi.date().iso().required(),
    phoneNumber: Joi.string()
      .regex(/^[0-9]{11}$/)
      .message("Phone number must be 11 digits")
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "co"] },
      })
      .required(),
  });

  const { error } = schema.validate({
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    email,
  });

  if (error) {
    res.status(400).json({
      message: error,
    });

    return;
  }

  UserProfile.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        res.status(400).json({
          message: "User with email already exist",
        });
        return Promise.resolve(null);
      }

      return UserProfile.create({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        phone_number: phoneNumber,
        email,
      });
    })
    .then((user) => {
      if (!user) {
        return;
      }
      res.status(201).json({
        message: "User created successfully",
        data: {
          user,
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

exports.patchEditUser = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      message: "Invalid user id",
    });
    return;
  }
  const { firstName, lastName, dateOfBirth, phoneNumber, email } = req.body;
  let userInfo = {};
  UserProfile.findByPk(id)
    .then((user) => {
      if (!user) {
        res.status(400).json({
          message: "No user with the supplied id",
        });
        return;
      }

      userInfo = user;

      const schema = Joi.object({
        firstName: Joi.string().min(3).max(30),
        lastName: Joi.string().min(3).max(30),
        dateOfBirth: Joi.date().iso(),
        phoneNumber: Joi.string().regex(/^[0-9]{11}$/),
        email: Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "co"] },
        }),
      });

      const { error } = schema.validate({
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        email,
      });

      if (error) {
        res.status(400).json({
          message: error,
        });

        return Promise.resolve(null);
      }

      return UserProfile.update(
        {
          first_name: firstName || user.first_name,
          last_name: lastName || user.last_name,
          email: email || user.last_name,
          date_of_birth: dateOfBirth || user.date_of_birth,
          phone_number: phoneNumber || user.phone_number,
        },
        { where: { id } }
      );
    })
    .then((updatedUser) => {
      if (!updatedUser) return;
      res.status(200).json({
        message: "User updated successfully",
        updatedUser: updatedUser ? updatedUser[0] : 0,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "something went wrong",
      });
    });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Invalid user id",
    });
    return;
  }
  UserProfile.findByPk(id)
    .then((user) => {
      if (!user) {
        res.status(400).json({
          message: "Invalid user id",
        });
        return;
      }
      return user.destroy();
    })
    .then(() => {
      res.status(200).json({
        message: `User with id: ${id} deleted successfully`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "something went wrong",
      });
    });
};
