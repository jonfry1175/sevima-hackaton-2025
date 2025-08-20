"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Event belongs to user (creator/admin)
      Event.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
      
      // Event has many candidates
      Event.hasMany(models.Candidate, { foreignKey: "event_id", as: "candidates" });
      
      // Event has many votes
      Event.hasMany(models.Vote, { foreignKey: "event_id", as: "votes" });
    }
  }

  Event.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: true,
          isDate: true,
        },
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: true,
          isDate: true,
          isAfterStartDate(value) {
            if (this.start_date && value <= this.start_date) {
              throw new Error("End date must be after start date");
            }
          },
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );

  return Event;
};