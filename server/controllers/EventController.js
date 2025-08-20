require("dotenv").config();
const { Event, Candidate, Vote, User } = require("../models");
const { serverError } = require("../utils/serverError");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

class EventController {
  // Get all events
  static async getAllEvents(req, res) {
    try {
      const events = await Event.findAll({
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "name", "NIK"]
          },
          {
            model: Candidate,
            as: "candidates",
            attributes: ["id", "name", "photo_url"]
          }
        ],
        order: [["createdAt", "DESC"]]
      });

      res.status(200).json({
        status: 200,
        message: "Success get events",
        data: events
      });
    } catch (error) {
      serverError(error, res, "Failed to get events");
    }
  }

  // Get event by ID with full details
  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id, {
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "name", "NIK"]
          },
          {
            model: Candidate,
            as: "candidates",
            attributes: ["id", "name", "nim", "photo_url", "vision", "mission", "faculty"]
          }
        ]
      });

      if (!event) {
        return res.status(404).json({
          status: 404,
          message: "Event not found"
        });
      }

      res.status(200).json({
        status: 200,
        message: "Success get event",
        data: event
      });
    } catch (error) {
      serverError(error, res, "Failed to get event");
    }
  }

  // Create new event (Admin only)
  static async createEvent(req, res) {
    try {
      const { title, description, start_date, end_date, is_active } = req.body;
      const created_by = req.user.id;

      const event = await Event.create({
        title,
        description,
        start_date,
        end_date,
        is_active: is_active || false,
        created_by
      });

      res.status(201).json({
        status: 201,
        message: "Event created successfully",
        data: event
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ 
          status: 400,
          message: messages 
        });
      }
      serverError(error, res, "Failed to create event");
    }
  }

  // Update event (Admin only)
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { title, description, start_date, end_date, is_active } = req.body;

      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({
          status: 404,
          message: "Event not found"
        });
      }

      await event.update({
        title: title || event.title,
        description: description || event.description,
        start_date: start_date || event.start_date,
        end_date: end_date || event.end_date,
        is_active: is_active !== undefined ? is_active : event.is_active
      });

      res.status(200).json({
        status: 200,
        message: "Event updated successfully",
        data: event
      });
    } catch (error) {
      serverError(error, res, "Failed to update event");
    }
  }

  // Delete event (Admin only)
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({
          status: 404,
          message: "Event not found"
        });
      }

      await event.destroy();

      res.status(200).json({
        status: 200,
        message: "Event deleted successfully"
      });
    } catch (error) {
      serverError(error, res, "Failed to delete event");
    }
  }

  // Get candidates for an event
  static async getEventCandidates(req, res) {
    try {
      const { id } = req.params;

      const candidates = await Candidate.findAll({
        where: { event_id: id },
        order: [["name", "ASC"]]
      });

      res.status(200).json({
        status: 200,
        message: "Success get candidates",
        data: candidates
      });
    } catch (error) {
      serverError(error, res, "Failed to get candidates");
    }
  }

  // Add candidate to event (Admin only)
  static async addCandidate(req, res) {
    try {
      const { id } = req.params; // event_id
      const { name, nim, photo_url, vision, mission, faculty } = req.body;

      // Check if event exists
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({
          status: 404,
          message: "Event not found"
        });
      }

      const candidate = await Candidate.create({
        event_id: id,
        name,
        nim,
        photo_url,
        vision,
        mission,
        faculty
      });

      res.status(201).json({
        status: 201,
        message: "Candidate added successfully",
        data: candidate
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ 
          status: 400,
          message: messages 
        });
      }
      serverError(error, res, "Failed to add candidate");
    }
  }

  // Update candidate (Admin only)
  static async updateCandidate(req, res) {
    try {
      const { candidateId } = req.params;
      const { name, nim, photo_url, vision, mission, faculty } = req.body;

      const candidate = await Candidate.findByPk(candidateId);
      if (!candidate) {
        return res.status(404).json({
          status: 404,
          message: "Candidate not found"
        });
      }

      await candidate.update({
        name: name || candidate.name,
        nim: nim || candidate.nim,
        photo_url: photo_url || candidate.photo_url,
        vision: vision || candidate.vision,
        mission: mission || candidate.mission,
        faculty: faculty || candidate.faculty
      });

      res.status(200).json({
        status: 200,
        message: "Candidate updated successfully",
        data: candidate
      });
    } catch (error) {
      serverError(error, res, "Failed to update candidate");
    }
  }

  // Delete candidate (Admin only)
  static async deleteCandidate(req, res) {
    try {
      const { candidateId } = req.params;

      const candidate = await Candidate.findByPk(candidateId);
      if (!candidate) {
        return res.status(404).json({
          status: 404,
          message: "Candidate not found"
        });
      }

      await candidate.destroy();

      res.status(200).json({
        status: 200,
        message: "Candidate deleted successfully"
      });
    } catch (error) {
      serverError(error, res, "Failed to delete candidate");
    }
  }

  // Get event results with vote counts
  static async getEventResults(req, res) {
    try {
      const { id } = req.params;

      // Check if event exists
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({
          status: 404,
          message: "Event not found"
        });
      }

      // Get vote results
      const results = await Vote.findAll({
        where: { event_id: id },
        include: [
          {
            model: Candidate,
            as: "candidate",
            attributes: ["id", "name", "photo_url", "nim", "faculty"]
          }
        ],
        attributes: [
          "candidate_id",
          [sequelize.fn("COUNT", sequelize.col("candidate_id")), "vote_count"]
        ],
        group: ["candidate_id", "candidate.id", "candidate.name", "candidate.photo_url", "candidate.nim", "candidate.faculty"],
        order: [[sequelize.fn("COUNT", sequelize.col("candidate_id")), "DESC"]]
      });

      // Get total votes
      const totalVotes = await Vote.count({
        where: { event_id: id }
      });

      // Calculate percentages and format results
      const formattedResults = results.map(result => ({
        candidate_id: result.candidate_id,
        candidate_name: result.candidate.name,
        candidate_photo: result.candidate.photo_url,
        candidate_nim: result.candidate.nim,
        candidate_faculty: result.candidate.faculty,
        vote_count: parseInt(result.dataValues.vote_count),
        percentage: totalVotes > 0 ? ((parseInt(result.dataValues.vote_count) / totalVotes) * 100).toFixed(2) : 0
      }));

      res.status(200).json({
        status: 200,
        message: "Success get event results",
        data: {
          event_id: id,
          event_title: event.title,
          total_votes: totalVotes,
          results: formattedResults
        }
      });
    } catch (error) {
      serverError(error, res, "Failed to get event results");
    }
  }
}

module.exports = EventController;