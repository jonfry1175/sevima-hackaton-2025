const router = require("express").Router();
const { exec, execSync } = require("child_process");
const roleRouter = require("./roles");
const userRouter = require("./users");

router.get("/", async (req, res) => {
  res.send("Hello World!");
});

router.get("/total-commit", (req, res) => {
  exec("git rev-list --count HEAD", (err, stdout) => {
    if (err) return res.status(500).send("Error");

    // Get last 5 commit messages and format as list
    const lastCommitMessages = execSync("git log -5 --pretty=%B")
      .toString()
      .trim()
      .split("\n")
      .filter((msg) => msg.trim()) // Remove empty lines
      .filter((msg) => !msg.toLowerCase().includes("backup db")) // Remove backup db messages
      .map((msg) => `• ${msg.trim()}`)
      .join("\n");

    const withDots = stdout.trim().split("").join(".");
    res.send({
      data: `v ${withDots}`,
    });
  });
});

// execute package.json script build
router.post("restart", (req, res) => {
  exec("cd .. && pnpm run build", (err, stdout, stderr) => {
    if (err) {
      console.error("Error executing build script:", err);
      return res.status(500).send("Error executing build script");
    }
    console.log("Build output:", stdout);
    res.send("Build script executed successfully");
  });
});

router.use("/users", userRouter);
router.use("/roles", roleRouter);

module.exports = router;
