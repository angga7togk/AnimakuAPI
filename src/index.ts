import express from "express";
import cors from "cors";
import axios from "axios";
import animasu from "./provider/animasu/route"

export const app = express();
axios.defaults.validateStatus = () => true;
axios.defaults.headers.common["User-Agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54";

app.use(cors());
app.get("/", async (req, res) => {
  res.send("ANIMAKU API IS UP 🚀");
});

app.use("/animasu", animasu)

app.listen(process.env.PORT || 3001, () => {
  console.warn("\nAnimakuAPI is running on http://localhost:3001");
});

export default app;