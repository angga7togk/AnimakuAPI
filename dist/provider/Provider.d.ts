import { AnimeDetail, Stream } from "../types/AnimeTypes";
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
    private name;
    private baseUrl;
    constructor(name: string, baseUrl: string);
    getName(): string;
    getBaseUrl(): string;
    setBaseUrl(baseUrl: string): void;
    abstract getAnimes(params: AnimesParams): Promise<ResponsePagination>;
    abstract getAnime(slug: string): Promise<AnimeDetail | undefined>;
    abstract getStreams(episodeSlug: string): Promise<Stream[]>;
}
//# sourceMappingURL=Provider.d.ts.map