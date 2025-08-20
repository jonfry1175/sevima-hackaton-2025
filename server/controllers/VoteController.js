require("dotenv").config();
const { Vote, Event, Candidate, User } = require("../models");
const { serverError } = require("../utils/serverError");

class VoteController {
  // Submit a vote
  static async submitVote(req, res) {
    try {
      const { event_id, candidate_id } = req.body;
      const user_id = req.user.id;
      const ip_address = req.ip || req.connection.remoteAddress;

      // Check if event exists and is active
      const event = await Event.findByPk(event_id);
      if (!event) {
        return res.status(404).json({
          status: 404,
          message: "Event not found"
        });
      }

      // Check if event is active and within voting period
      const now = new Date();
      if (!event.is_active) {
        return res.status(400).json({
          status: 400,
          message: "Voting event is not active"
        });
      }

      if (now < event.start_date || now > event.end_date) {
        return res.status(400).json({
          status: 400,
          message: "Voting is not open at this time"
        });
      }

      // Check if candidate exists and belongs to the event
      const candidate = await Candidate.findOne({
        where: {
          id: candidate_id,
          event_id: event_id
        }
      });

      if (!candidate) {
        return res.status(404).json({
          status: 404,
          message: "Candidate not found for this event"
        });
      }

      // Check if user has already voted for this event
      const existingVote = await Vote.findOne({
        where: {
          user_id: user_id,
          event_id: event_id
        }
      });

      if (existingVote) {
        return res.status(400).json({
          status: 400,
          message: "You have already voted for this event"
        });
      }

      // Create the vote
      const vote = await Vote.create({
        user_id,
        event_id,
        candidate_id,
        ip_address
      });

      res.status(201).json({
        status: 201,
        message: "Vote submitted successfully",
        data: {
          vote_id: vote.id,
          event_id,
          candidate_name: candidate.name,
          voted_at: vote.createdAt
        }
      });
    } catch (error) {
      // Handle the unique constraint violation
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          status: 400,
          message: "You have already voted for this event"
        });
      }
      
      if (error.message === "User has already voted for this event") {
        return res.status(400).json({
          status: 400,
          message: error.message
        });
      }

      serverError(error, res, "Failed to submit vote");
    }
  }

  // Check if user has voted for a specific event
  static async checkUserVoteStatus(req, res) {
    try {
      const { eventId } = req.params;
      const user_id = req.user.id;

      const vote = await Vote.findOne({
        where: {
          user_id: user_id,
          event_id: eventId
        },
        include: [
          {
            model: Candidate,
            as: "candidate",
            attributes: ["id", "name", "photo_url"]
          }
        ]
      });

      if (vote) {
        res.status(200).json({
          status: 200,
          message: "User has voted for this event",
          data: {
            has_voted: true,
            vote_id: vote.id,
            candidate: vote.candidate,
            voted_at: vote.createdAt
          }
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "User has not voted for this event",
          data: {
            has_voted: false
          }
        });
      }
    } catch (error) {
      serverError(error, res, "Failed to check vote status");
    }
  }

  // Get user's voting history
  static async getUserVoteHistory(req, res) {
    try {
      const user_id = req.user.id;

      const votes = await Vote.findAll({
        where: { user_id },
        include: [
          {
            model: Event,
            as: "event",
            attributes: ["id", "title", "description", "start_date", "end_date"]
          },
          {
            model: Candidate,
            as: "candidate",
            attributes: ["id", "name", "photo_url", "nim", "faculty"]
          }
        ],
        order: [["createdAt", "DESC"]]
      });

      res.status(200).json({
        status: 200,
        message: "Success get user vote history",
        data: votes
      });
    } catch (error) {
      serverError(error, res, "Failed to get vote history");
    }
  }
}

module.exports = VoteController;