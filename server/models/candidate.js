"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    static associate(models) {
      // Candidate belongs to event
      Candidate.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
      
      // Candidate has many votes
      Candidate.hasMany(models.Vote, { foreignKey: "candidate_id", as: "votes" });
    }
  }

  Candidate.init(
    {
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Events",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      nim: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vision: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mission: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      faculty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Candidate",
    }
  );

  return Candidate;
};