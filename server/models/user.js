"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User has one role
      User.belongsTo(models.Role, { foreignKey: "role_id" });
      
      // User can create events (admin)
      User.hasMany(models.Event, { foreignKey: "created_by", as: "createdEvents" });
      
      // User can have many votes
      User.hasMany(models.Vote, { foreignKey: "user_id", as: "votes" });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
          min: 3,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
          min: 3,
          max: 20,
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      NIK: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "NIK cannot be empty",
          },
          notNull: {
            msg: "NIK cannot be null",
          },
          len: [7, 7], // memastikan panjang NIK tetap 9 karakter
        },
      },
      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      faculty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate(async (user, options) => {
    const existNIK = await User.findOne({
      where: { NIK: user.NIK },
      attributes: ["NIK"],
    });
    if (existNIK) {
      throw new Error("NIK already exists");
    }
  });

  return User;
};
