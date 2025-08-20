const voteRouter = require("express").Router();
const {
  submitVote,
  checkUserVoteStatus,
  getUserVoteHistory
} = require("../controllers/VoteController");
const authMiddleware = require("../middlewares/auth");

// All vote routes require authentication
voteRouter.post("/", authMiddleware, submitVote);
voteRouter.get("/status/:eventId", authMiddleware, checkUserVoteStatus);
voteRouter.get("/history", authMiddleware, getUserVoteHistory);

module.exports = voteRouter;