const express = require("express");
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { PORT } = require("./config/config.env");
const router = require("./routes");
const { machineLoggerInfo } = require("./utils/logger");

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use("/api", router);


server.listen(PORT, () => {
  machineLoggerInfo(`Server started on http://localhost:${PORT}`);
});
