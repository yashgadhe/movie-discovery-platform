import sampleMovies from './data/sampleMovies.js';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim();
export const hasApiKey = Boolean(API_KEY);

function normalizeMovies(raw) {
  return raw.map((movie) => ({
    id: movie.id || movie.title,
    title: movie.title || movie.name || 'Untitled',
    release_date: movie.release_date || movie.first_air_date || 'TBA',
    vote_average: movie.vote_average ?? movie.rating ?? 0,
    overview: movie.overview || movie.description || 'No description available.',
    poster_path: movie.poster_path
      ? movie.poster_path.startsWith('http')
        ? movie.poster_path
        : `${TMDB_IMAGE_BASE}${movie.poster_path}`
      : null,
    genres: movie.genres || movie.genre_names || ['Drama'],
  }));
}

export function getDiscoverUrl(filter = 'trending') {
  const endpoints = {
    trending: `${TMDB_BASE}/trending/movie/week?api_key=${API_KEY}`,
    top_rated: `${TMDB_BASE}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
    upcoming: `${TMDB_BASE}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
  };

  return endpoints[filter] || endpoints.trending;
}

export function getSearchUrl(query) {
  return `${TMDB_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`;
}

export async function fetchMovies(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }
  const data = await response.json();
  return normalizeMovies(data.results || []);
}

export function getSampleMovies() {
  return sampleMovies;
}
