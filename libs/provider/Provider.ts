import { AnimeDetail, AnimeSimple, Stream } from "../types/AnimeTypes";
import { ResponsePagination } from "../types/ResponseType";

export type AnimesParams = {
  search?: string;
  page?: number;
  genres?: string[];
  genre?: string;
  characterTypes?: string[];
  characterType?: string;
  type?: string;
  seasons?: string[];
  season?: string;
  status?: string;
  sort?: string;
};

export default abstract class Provider {
  private name: string = "";
  private baseUrl: string = "";

  constructor(name: string, baseUrl: string) {
    this.name = name;
    this.baseUrl = baseUrl;
  }

  public getName(): string {
    return this.name;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  public abstract getAnimes(params: AnimesParams): Promise<ResponsePagination>;

  public abstract getAnime(slug: string): Promise<AnimeDetail | undefined>;

  public abstract getStreams(episodeSlug: string): Promise<Stream[]>;
}
