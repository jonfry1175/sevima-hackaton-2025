const eventRouter = require("express").Router();
const { ADMIN_ROLE_ID } = require("../config/config.env");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getEventResults
} = require("../controllers/EventController");
const authMiddleware = require("../middlewares/auth");
const { allowRoleId } = require("../middlewares/role");

// Public routes (accessible to all authenticated users)
eventRouter.get("/", authMiddleware, getAllEvents);
eventRouter.get("/:id", authMiddleware, getEventById);
eventRouter.get("/:id/candidates", authMiddleware, getEventCandidates);
eventRouter.get("/:id/results", authMiddleware, getEventResults);

// Admin only routes
eventRouter.post("/", authMiddleware, allowRoleId(ADMIN_ROLE_ID), createEvent);
eventRouter.put("/:id", authMiddleware, allowRoleId(ADMIN_ROLE_ID), updateEvent);
eventRouter.delete("/:id", authMiddleware, allowRoleId(ADMIN_ROLE_ID), deleteEvent);

// Candidate management (Admin only)
eventRouter.post("/:id/candidates", authMiddleware, allowRoleId(ADMIN_ROLE_ID), addCandidate);
eventRouter.put("/:eventId/candidates/:candidateId", authMiddleware, allowRoleId(ADMIN_ROLE_ID), updateCandidate);
eventRouter.delete("/:eventId/candidates/:candidateId", authMiddleware, allowRoleId(ADMIN_ROLE_ID), deleteCandidate);

module.exports = eventRouter;