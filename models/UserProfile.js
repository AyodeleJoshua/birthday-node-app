const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const UserProfile = sequelize.define(
  "user-profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    date_of_birth: { type: DataTypes.DATE, alloWNull: false },
    phone_number: { type: DataTypes.STRING, alloWNull: false },
    email: { type: DataTypes.STRING, alloWNull: false, unique: true },
  },
  {
    freezeTableName: true,
  }
);

module.exports = UserProfile;
