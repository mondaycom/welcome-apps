// --- OMDb API Service ---

/**
 * Configuration Constants
 * The OMDb API Key for querying movie data.
 */
const OMDB_API_KEY = "ae5ef701";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

/**
 * Fetches movie data by title from the OMDb API.
 * @param {string} title The title of the movie to search for.
 * @returns {Promise<object|null>} The movie data object or null if not found/error.
 */
export async function fetchMovieData(title) {
  // Construct the URL using the movie title and the provided API key
  const url = `${OMDB_BASE_URL}?t=${encodeURIComponent(
    title
  )}&apikey=${OMDB_API_KEY}&plot=full`;

  try {
    console.log(`Fetching movie data for "${title}"...`);
    // Use native fetch to make the API request
    const response = await fetch(url);

    if (!response.ok) {
      // Throw an error for bad HTTP statuses (404, 500, etc.)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the API returned an error message (e.g., movie not found, key deactivated)
    if (data.Response === "False") {
      console.error(`OMDb API Error: ${data.Error}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch movie data:", error.message);
    return null;
  }
}

/**
 * Extracts relevant movie information from the OMDb API response.
 * @param {object} movieData The movie data object from the API.
 * @returns {object} Formatted movie information.
 */
export function extractMovieInfo(movieData) {
  if (!movieData) {
    return null;
  }

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
