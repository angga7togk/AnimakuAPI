import express, { Request, Response } from "express";
import parser from "./parser";

const app = express.Router();

app.get("/", async (req: Request, res: Response) => {
  const query = req.query;
  const animes = await parser.getAnimes(query);
  res.json({
    message: "Success!",
    hasNext: animes.hasNext,
    data: animes.data,
  });
});

app.get("/detail/:slug", async (req: Request, res: Response): Promise<any> => {
  const { slug } = req.params;
  if (!slug)
    return res.status(404).json({
      message: "Slug is required",
    });
  const anime = await parser.getAnime(slug);
  if (!anime)
    return res.status(404).json({
      message: "Anime not found",
    });
  return res.json({
    message: "Success",
    data: anime,
  });
});

app.get(
  "/streams/:episodeSlug",
  async (req: Request, res: Response): Promise<any> => {
    const { episodeSlug } = req.params;
    if (!episodeSlug)
      return res.status(404).json({
        message: "Slug is required",
      });
    const streams = await parser.getStreams(episodeSlug);
    if (!streams)
      return res.status(404).json({
        message: "Anime not found",
        data: [],
      });
    return res.json({
      message: "Success",
      data: streams,
    });
  }
);

export default app;
