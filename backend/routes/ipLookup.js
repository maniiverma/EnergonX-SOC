import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/lookup/:target", async (req, res) => {
  try {
    const { target } = req.params;
    // Fields filter karke fast lookup
    const response = await axios.get(
      `http://ip-api.com/json/${target}?fields=status,message,country,countryCode,city,timezone,isp,org,as,query`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "External API unreachable" });
  }
});

export default router;
