"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Provider_1 = __importDefault(require("@/provider/Provider"));
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class Animasu extends Provider_1.default {
    constructor() {
        super("Animasu", "https://v7.animasu.cc");
    }
    // https://v7.animasu.cc/pencarian/?genre%5B%5D=gourmet&genre%5B%5D=josei&genre%5B%5D=musik&karakter%5B%5D=ceroboh&karakter%5B%5D=dikagumi&karakter%5B%5D=kejam&season%5B%5D=fall-2008&season%5B%5D=fall-2013&season%5B%5D=fall-2018&status=completed&tipe=OVA&urutan=baru
    // https://v7.animasu.cc/pencarian/?status=&tipe=&urutan=update&halaman=50
    getAnimes(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get((params === null || params === void 0 ? void 0 : params.search) ? `${this.getBaseUrl()}/page/${params.page || 1}/` : `${this.getBaseUrl()}/pencarian/`, {
                    params: {
                        s: (params === null || params === void 0 ? void 0 : params.search) || "",
                        halaman: (params === null || params === void 0 ? void 0 : params.page) || 1,
                        urutan: (params === null || params === void 0 ? void 0 : params.sort) || "update",
                        "genre[]": (params === null || params === void 0 ? void 0 : params.genres) || [],
                        "season[]": (params === null || params === void 0 ? void 0 : params.seasons) || [],
                        "karakter[]": (params === null || params === void 0 ? void 0 : params.characterTypes) || [],
                        status: (params === null || params === void 0 ? void 0 : params.status) || "",
                        tipe: (params === null || params === void 0 ? void 0 : params.type) || "",
                    },
                });
                const $ = cheerio.load(res.data);
                const animes = [];
                $(".bs").each((index, el) => {
                    const title = $(el).find(".tt").text().trim();
                    const link = $(el).find("a").attr("href");
                    const slug = (link === null || link === void 0 ? void 0 : link.split("/")[4].trim()) || "";
                    const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
                    const type = $(el).find(".typez").text().trim();
                    const episode = $(el).find(".epx").text().trim();
                    let status = $(el).find(".sb").text().trim();
                    if (status == "🔥🔥🔥") {
                        status = "ONGOING";
                    }
                    else if (status == "Selesai ✓") {
                        status = "COMPLETE";
                    }
                    else {
                        status = "UPCOMING";
                    }
                    animes.push({
                        title,
                        slug,
                        link: link || "",
                        image: image || "",
                        type,
                        episode,
                        status: status,
                    });
                });
                const hasNext = $(".hpage .r").length > 0 || $(".pagination .next").length > 0;
                return {
                    data: animes,
                    hasNext,
                };
            }
            catch (error) {
                console.error("Error saat mengambil data anime:", error);
                return {
                    data: [],
                    hasNext: false,
                };
            }
        });
    }
    getAnime(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const res = yield axios_1.default.get(`${this.getBaseUrl()}/anime/${slug}/`);
                const $ = cheerio.load(res.data);
                const infox = $(".infox");
                // Parsing data utama
                const title = infox.find("h1[itemprop='headline']").text().trim();
                const synonym = infox.find(".alter").text().trim();
                const synopsis = $(".sinopsis p")
                    .text()
                    .trim();
                const image = $(".bigcontent .thumb img").attr("data-src") || "";
                const rating = $(".rating strong").text().trim() || "N/A";
                // Parsing genres
                const genres = [];
                infox
                    .find(".spe span")
                    .first()
                    .find("a")
                    .each((_, el) => {
                    const genreUrl = $(el).attr("href");
                    const genreName = $(el).text().trim();
                    const genreSlug = (genreUrl === null || genreUrl === void 0 ? void 0 : genreUrl.split("/")[4]) || "";
                    genres.push({
                        name: genreName,
                        slug: genreSlug,
                        url: genreUrl || "",
                    });
                });
                // Parsing status
                let status = "";
                infox.find(".spe span").each((_, el) => {
                    var _a;
                    const text = $(el).text().trim();
                    if (text.toLowerCase().startsWith("status:")) {
                        const value = (_a = text.split(":")[1]) === null || _a === void 0 ? void 0 : _a.trim();
                        status =
                            value === "🔥🔥🔥"
                                ? "ONGOING"
                                : value === "Selesai ✓"
                                    ? "COMPLETE"
                                    : "UPCOMING";
                    }
                });
                // Parsing elemen lain
                const aired = (_a = infox
                    .find(".spe span.split")
                    .filter((_, el) => $(el).text().toLowerCase().startsWith("rilis:"))
                    .text()
                    .split(":")[1]) === null || _a === void 0 ? void 0 : _a.trim();
                const type = (_b = infox
                    .find(".spe span")
                    .filter((_, el) => $(el).text().toLowerCase().startsWith("jenis:"))
                    .text()
                    .split(":")[1]) === null || _b === void 0 ? void 0 : _b.trim();
                const episode = (_c = infox
                    .find(".spe span")
                    .filter((_, el) => $(el).text().toLowerCase().startsWith("episode:"))
                    .text()
                    .split(":")[1]) === null || _c === void 0 ? void 0 : _c.trim();
                const duration = (_d = infox
                    .find(".spe span")
                    .filter((_, el) => $(el).text().toLowerCase().startsWith("durasi:"))
                    .text()
                    .split(":")[1]) === null || _d === void 0 ? void 0 : _d.trim();
                const author = infox
                    .find(".spe span")
                    .filter((_, el) => $(el).text().toLowerCase().startsWith("pengarang:"))
                    .find("a")
                    .text()
                    .trim();
                const studio = infox
                    .find(".spe span")
                    .filter((_, el) => $(el).text().toLowerCase().startsWith("studio:"))
                    .find("a")
                    .text()
                    .trim();
                const season = infox
                    .find(".spe span")
                    .filter((_, el) => $(el).text().toLowerCase().startsWith("musim:"))
                    .find("a")
                    .text()
                    .trim();
                const posted = infox
                    .find(".spe span[itemprop='author'] i")
                    .text()
                    .trim();
                const updateAt = infox
                    .find(".spe span.split time[itemprop='dateModified']")
                    .attr("datetime") || "";
                const episodes = [];
                $("#daftarepisode li").each((index, el) => {
                    const a = $(el).find(".lchx a");
                    const episode = a.text().trim();
                    const url = a.attr("href") || "";
                    const slug = url.split("/")[3] || "";
                    episodes.push({
                        episode,
                        slug,
                        url,
                    });
                });
                const batches = [];
                $(".soraddlx .soraurlx").each((index, el) => {
                    const resolution = $(el).find("strong").text().trim();
                    $(el).find("a").each((_index, _el) => {
                        const url = $(_el).attr("href") || "";
                        const name = $(_el).text().trim();
                        batches.push({
                            name,
                            resolution,
                            url
                        });
                    });
                });
                return {
                    slug,
                    url: `${this.getBaseUrl()}/anime/${slug}/`,
                    title,
                    synonym,
                    synopsis,
                    image,
                    rating: Number(rating.split(" ")[1]) || 0,
                    author,
                    genres,
                    status,
                    aired: aired || "Unknown",
                    type: type || "Unknown",
                    episode: episode || "Unknown",
                    duration: duration || "Unknown",
                    studio: studio || "Unknown",
                    season: season || "Unknown",
                    posted,
                    updateAt,
                    episodes,
                    batches
                };
            }
            catch (error) {
                console.error("Error saat mengambil data anime:", error);
            }
        });
    }
    getStreams(episodeSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const streams = [];
                const res = yield axios_1.default.get(`${this.getBaseUrl()}/${episodeSlug}/`);
                const $ = cheerio.load(res.data);
                $(".mirror option").each((index, el) => {
                    var _a, _b;
                    const value = (_a = $(el).attr("value")) === null || _a === void 0 ? void 0 : _a.trim();
                    if (value) {
                        const name = $(el).text().trim();
                        const $$ = cheerio.load(`<div>${atob(value)}</div>`);
                        streams.push({
                            name,
                            url: ((_b = $$("iframe").attr("src")) === null || _b === void 0 ? void 0 : _b.trim()) || ""
                        });
                    }
                });
                return streams;
            }
            catch (error) {
                return [];
            }
        });
    }
}
exports.default = Animasu;
