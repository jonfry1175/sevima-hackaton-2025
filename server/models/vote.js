"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    static associate(models) {
      // Vote belongs to user
      Vote.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      
      // Vote belongs to event
      Vote.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
      
      // Vote belongs to candidate
      Vote.belongsTo(models.Candidate, { foreignKey: "candidate_id", as: "candidate" });
    }
  }

  Vote.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Events",
          key: "id",
        },
      },
      candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Candidates",
          key: "id",
        },
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Vote",
      indexes: [
        {
          unique: true,
          fields: ["user_id", "event_id"],
          name: "votes_user_event_unique",
        },
      ],
    }
  );

  // Hook to prevent double voting
  Vote.beforeCreate(async (vote, options) => {
    const existingVote = await Vote.findOne({
      where: {
        user_id: vote.user_id,
        event_id: vote.event_id,
      },
    });

    if (existingVote) {
      throw new Error("User has already voted for this event");
    }
  });

  return Vote;
};