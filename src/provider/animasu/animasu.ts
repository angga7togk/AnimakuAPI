import {
  AnimeDetail,
  AnimeSimple,
  Batch,
  Character,
  Episode,
  Genre,
  Stream,
  ResponsePagination,
  AnimesParams,
} from "../../index";
import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://v7.animasu.cc";

async function getAnimes(params?: AnimesParams): Promise<ResponsePagination> {
  try {
    const res = await axios.get(
      params?.search
        ? `${BASE_URL}/page/${params.page || 1}/`
        : `${BASE_URL}/pencarian/`,
      {
        params: {
          s: params?.search || "",
          halaman: params?.page || 1,
          urutan: params?.sort || "update",
          "genre[]": params?.genres || [],
          "season[]": params?.seasons || [],
          "karakter[]": params?.characterTypes || [],
          status: params?.status || "",
          tipe: params?.type || "",
        },
      }
    );
    const $ = cheerio.load(res.data);
    const animes: AnimeSimple[] = [];

    $(".bs").each((index, el) => {
      const title = $(el).find(".tt").text().trim();
      const link = $(el).find("a").attr("href");

      const slug = link?.split("/")[4].trim() || "";

      const image =
        $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
      const type = $(el).find(".typez").text().trim();
      const episode = $(el).find(".epx").text().trim();

      let status = $(el).find(".sb").text().trim();
      if (status == "🔥🔥🔥") {
        status = "ONGOING";
      } else if (status == "Selesai ✓") {
        status = "COMPLETE";
      } else {
        status = "UPCOMING";
      }

      animes.push({
        title,
        slug,
        link: link || "",
        image: image || "",
        type,
        episode,
        status: status as "COMPLETE" | "ONGOING" | "UPCOMING",
      });
    });
    const hasNext =
      $(".hpage .r").length > 0 || $(".pagination .next").length > 0;

    return {
      data: animes,
      hasNext,
    };
  } catch (error) {
    console.error("Error saat mengambil data anime:", error);
    return {
      hasNext: false,
      data: [],
    };
  }
}

async function getAnime(slug: string): Promise<AnimeDetail | undefined> {
  try {
    const res = await axios.get(`${BASE_URL}/anime/${slug}/`);
    const $ = cheerio.load(res.data);

    const infox = $(".infox");

    // Parsing data utama
    const title = infox.find("h1[itemprop='headline']").text().trim();
    const synonym = infox.find(".alter").text().trim();
    const synopsis = $(".sinopsis p").text().trim();
    const image = $(".bigcontent .thumb img").attr("data-src") || "";
    const rating = $(".rating strong").text().trim() || "N/A";

    // Parsing genres
    const genres: Genre[] = [];
    infox
      .find(".spe span")
      .first()
      .find("a")
      .each((_, el) => {
        const genreUrl = $(el).attr("href");
        const genreName = $(el).text().trim();
        const genreSlug = genreUrl?.split("/")[4] || "";
        genres.push({
          name: genreName,
          slug: genreSlug,
          url: genreUrl || "",
        });
      });

    // Parsing status
    let status = "";
    infox.find(".spe span").each((_, el) => {
      const text = $(el).text().trim();
      if (text.toLowerCase().startsWith("status:")) {
        const value = text.split(":")[1]?.trim();
        status =
          value === "🔥🔥🔥"
            ? "ONGOING"
            : value === "Selesai ✓"
            ? "COMPLETE"
            : "UPCOMING";
      }
    });

    // Parsing elemen lain
    const aired = infox
      .find(".spe span.split")
      .filter((_, el) => $(el).text().toLowerCase().startsWith("rilis:"))
      .text()
      .split(":")[1]
      ?.trim();

    const type = infox
      .find(".spe span")
      .filter((_, el) => $(el).text().toLowerCase().startsWith("jenis:"))
      .text()
      .split(":")[1]
      ?.trim();

    const episode = infox
      .find(".spe span")
      .filter((_, el) => $(el).text().toLowerCase().startsWith("episode:"))
      .text()
      .split(":")[1]
      ?.trim();

    const duration = infox
      .find(".spe span")
      .filter((_, el) => $(el).text().toLowerCase().startsWith("durasi:"))
      .text()
      .split(":")[1]
      ?.trim();

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

    const posted = infox.find(".spe span[itemprop='author'] i").text().trim();

    const updateAt =
      infox
        .find(".spe span.split time[itemprop='dateModified']")
        .attr("datetime") || "";

    const episodes: Episode[] = [];
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

    const batches: Batch[] = [];
    $(".soraddlx .soraurlx").each((index, el) => {
      const resolution = $(el).find("strong").text().trim();
      $(el)
        .find("a")
        .each((_index, _el) => {
          const url = $(_el).attr("href") || "";
          const name = $(_el).text().trim();
          batches.push({
            name,
            resolution,
            url,
          });
        });
    });
    return {
      slug,
      url: `${BASE_URL}/anime/${slug}/`,
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
      batches,
    };
  } catch (error) {
    console.error("Error saat mengambil data anime:", error);
  }
}

async function getStreams(episodeSlug: string): Promise<Stream[]> {
  try {
    const streams: Stream[] = [];
    const res = await axios.get(`${BASE_URL}/${episodeSlug}/`);
    const $ = cheerio.load(res.data);

    $(".mirror option").each((index, el) => {
      const value = $(el).attr("value")?.trim();
      if (value) {
        const name = $(el).text().trim();
        const $$ = cheerio.load(`<div>${atob(value)}</div>`);
        streams.push({
          name,
          url: $$("iframe").attr("src")?.trim() || "",
        });
      }
    });
    return streams;
  } catch (error) {
    return [];
  }
}

async function getGenres(): Promise<Genre[]> {
  try {
    const res = await axios.get(`${BASE_URL}/kumpulan-genre-anime-lengkap/`);
    const $ = cheerio.load(res.data);
    const genres: Genre[] = [];
    $(".genrepage a").each((index, el) => {
      const name = $(el).text().trim();
      const url = $(el).attr("href") || "";
      const slug = url.split("/")[4] || "";
      genres.push({
        name,
        slug,
        url,
      });
    });
    return genres;
  } catch (error) {
    return [];
  }
}

async function getCharacters(): Promise<Character[]> {
  try {
    const res = await axios.get(`${BASE_URL}/kumpulan-tipe-karakter-lengkap/`);
    const $ = cheerio.load(res.data);
    const genres: Character[] = [];
    $(".genrepage a").each((index, el) => {
      const name = $(el).text().trim();
      const url = $(el).attr("href") || "";
      const slug = url.split("/")[4] || "";
      genres.push({
        name,
        slug,
        url,
      });
    });
    return genres;
  } catch (error) {
    return [];
  }
}

async function getAnimesByDay(
  day:
    | "senin"
    | "selasa"
    | "rabu"
    | "kamis"
    | "jumat"
    | "sabtu"
    | "minggu"
    | "random"
): Promise<AnimeSimple[]> {
  try {
    const res = await axios.get(`${BASE_URL}/jadwal/`);
    const $ = cheerio.load(res.data);
    const animes: AnimeSimple[] = [];

    $(".bixbox").each((index, el) => {
      const $$ = $(el);
      const $day = ($$.find(".releases h3 span").text().trim() || "")
        .toLowerCase()
        .replace("update acak", "random")
        .replace("'", "");
      if ($day == day) {
        $(el)
          .find(".bs")
          .each((_index, _el) => {
            const $$$ = $(_el);

            const title = $$$.find(".tt").text().trim();
            const link = $$$.find("a").attr("href");

            const slug = link?.split("/")[4].trim() || "";

            const image =
              $$$.find("img").attr("data-src") || $$$.find("img").attr("src");
            const type = $$$.find(".typez").text().trim();
            const episode = $$$.find(".epx").text().trim();

            let status = $$$.find(".sb").text().trim();
            if (status == "🔥🔥🔥") {
              status = "ONGOING";
            } else if (status == "Selesai ✓") {
              status = "COMPLETE";
            } else {
              status = "UPCOMING";
            }

            animes.push({
              title,
              slug,
              link: link || "",
              image: image || "",
              type,
              episode,
              status: status as "COMPLETE" | "ONGOING" | "UPCOMING",
            });
          });
      }
    });

    return animes;
  } catch (error) {
    return [];
  }
}

export default {
  getAnimes,
  getAnime,
  getStreams,
  getGenres,
  getCharacters,
  getAnimesByDay,
};
