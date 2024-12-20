import Provider, { AnimesParams } from "../Provider";
import { AnimeDetail, Stream } from "../../types/AnimeTypes";
import { ResponsePagination } from "../../types/ResponseType";
export default class Animasu extends Provider {
    constructor();
    getAnimes(params?: AnimesParams): Promise<ResponsePagination>;
    getAnime(slug: string): Promise<AnimeDetail | undefined>;
    getStreams(episodeSlug: string): Promise<Stream[]>;
}
//# sourceMappingURL=Animasu.d.ts.map