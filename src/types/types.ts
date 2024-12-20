import { AnimeSimple } from "./AnimeTypes";

export type ResponsePagination = {
  data: AnimeSimple[],
  hasNext: boolean;
}

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