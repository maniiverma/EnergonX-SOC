const vulnerabilityRoutes = require("./routes/vulnerabilityRoutes")
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const scanRoutes = require("./routes/scanRoutes");

const app = express();

app.use("/api/vulnerability", vulnerabilityRoutes)
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    system: "EnergonX",
    status: "Running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);

module.exports = app;
