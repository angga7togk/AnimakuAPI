"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parser_1 = __importDefault(require("./parser"));
const app = express_1.default.Router();
app.get("/", async (req, res) => {
    const query = req.query;
    const animes = await parser_1.default.getAnimes(query);
    res.json({
        message: "Success!",
        hasNext: animes.hasNext,
        data: animes.data,
    });
});
app.get("/detail/:slug", async (req, res) => {
    const { slug } = req.params;
    if (!slug)
        return res.status(404).json({
            message: "Slug is required",
        });
    const anime = await parser_1.default.getAnime(slug);
    if (!anime)
        return res.status(404).json({
            message: "Anime not found",
        });
    return res.json({
        message: "Success",
        data: anime,
    });
});
app.get("/streams/:episodeSlug", async (req, res) => {
    const { episodeSlug } = req.params;
    if (!episodeSlug)
        return res.status(404).json({
            message: "Slug is required",
        });
    const streams = await parser_1.default.getStreams(episodeSlug);
    if (!streams)
        return res.status(404).json({
            message: "Anime not found",
            data: [],
        });
    return res.json({
        message: "Success",
        data: streams,
    });
});
exports.default = app;
