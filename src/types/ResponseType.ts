import { AnimeSimple } from "./AnimeTypes";

export interface ResponsePagination {
  data: AnimeSimple[],
  hasNext: boolean;
}