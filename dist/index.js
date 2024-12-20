"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const route_1 = __importDefault(require("./provider/animasu/route"));
exports.app = (0, express_1.default)();
axios_1.default.defaults.validateStatus = () => true;
axios_1.default.defaults.headers.common["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54";
exports.app.use((0, cors_1.default)());
exports.app.get("/", async (req, res) => {
    res.send("ANIMAKU API IS UP 🚀");
});
exports.app.use("/animasu", route_1.default);
exports.app.listen(process.env.PORT || 3001, () => {
    console.warn("\nAnimakuAPI is running on http://localhost:3001");
});
