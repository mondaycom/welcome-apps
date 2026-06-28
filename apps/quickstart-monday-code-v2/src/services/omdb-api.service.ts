const OMDB_API_KEY = "ae5ef701";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

export interface MovieData {
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Plot?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  Poster?: string;
  Response?: string;
  Error?: string;
}

export interface MovieInfo {
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  actors: string;
  plot: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  poster: string;
}

export async function fetchMovieData(title: string): Promise<MovieData | null> {
  const url = `${OMDB_BASE_URL}?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}&plot=full`;

  try {
    console.log(`Fetching movie data for "${title}"...`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as MovieData;

    if (data.Response === "False") {
      console.error(`OMDb API Error: ${data.Error}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch movie data:", (error as Error).message);
    return null;
  }
}

export function extractMovieInfo(movieData: MovieData | null): MovieInfo | null {
  if (!movieData) return null;

  return {
    title: movieData.Title || "N/A",
    year: movieData.Year || "N/A",
    rated: movieData.Rated || "N/A",
    released: movieData.Released || "N/A",
    runtime: movieData.Runtime || "N/A",
    genre: movieData.Genre || "N/A",
    director: movieData.Director || "N/A",
    actors: movieData.Actors || "N/A",
    plot: movieData.Plot || "N/A",
    imdbRating: movieData.imdbRating || "N/A",
    imdbVotes: movieData.imdbVotes || "N/A",
    imdbID: movieData.imdbID || "N/A",
    poster: movieData.Poster || "N/A",
  };
}
