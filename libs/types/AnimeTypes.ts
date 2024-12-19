export interface AnimeSimple {
  title: string;
  slug: string;
  link: string;
  image: string;
  type: string;
  episode: string;
  status: "COMPLETE" | "ONGOING" | "UPCOMING";
}

export interface Genre {
  name: string;
  slug: string;
  url: string;
}

export interface Episode {
  episode: string;
  slug: string;
  url: string;
}

export interface Batch {
  name: string;
  resolution: string;
  url: string;
}

export interface Stream {
  name: string;
  url: string;
}

export interface AnimeDetail {
  slug: string;
  url: string;
  title: string;
  synonym: string;
  synopsis: string;
  image: string;
  rating: number;
  author: string;
  genres: Genre[];
  status: string;
  aired: string;
  type: string;
  episode: string;
  duration: string;
  studio: string;
  season: string;
  posted: string;
  updateAt: string;
  episodes: Episode[];
  batches: Batch[];
}