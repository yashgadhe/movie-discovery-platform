import { useEffect, useState } from 'react';
import MovieCard from './components/MovieCard.jsx';
import sampleMovies from './data/sampleMovies.js';
import { fetchMovies, getDiscoverUrl, getSearchUrl, hasApiKey } from './api.js';

function App() {
  const [movies, setMovies] = useState(sampleMovies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('trending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [helperText, setHelperText] = useState(
    'Search for a movie, or browse trending films below.'
  );

  async function loadMovies(selectedFilter = 'trending') {
    if (!hasApiKey) {
      setHelperText(
        'No TMDB API key provided. Using fallback sample movies. Provide VITE_TMDB_API_KEY for live data.'
      );
      setMovies(sampleMovies);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const results = await fetchMovies(getDiscoverUrl(selectedFilter));
      setMovies(results);
      setHelperText(
        `Showing ${selectedFilter.replace('_', ' ')} movies. Search to refine results.`
      );
    } catch (err) {
      setError('Unable to load movies from the API. Showing fallback data.');
      setMovies(sampleMovies);
    } finally {
      setLoading(false);
    }
  }

  async function searchMovies(query) {
    const trimmed = query.trim();
    if (!trimmed) {
      setFilter('trending');
      loadMovies('trending');
      return;
    }

    if (!hasApiKey) {
      const filtered = sampleMovies.filter((movie) =>
        movie.title.toLowerCase().includes(trimmed.toLowerCase())
      );
      setMovies(filtered);
      setHelperText(
        filtered.length
          ? `Found ${filtered.length} local match(es) for "${trimmed}".`
          : `No local matches found for "${trimmed}".`
      );
      return;
    }

    try {
      setLoading(true);
      setError('');
      const results = await fetchMovies(getSearchUrl(trimmed));
      setMovies(results);
      setHelperText(
        results.length
          ? `Search results for "${trimmed}".`
          : `No movies found for "${trimmed}".`
      );
    } catch (err) {
      setError('Unable to load movies from the API. Showing fallback data.');
      setMovies(sampleMovies);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovies(filter);
  }, []);

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div>
          <span className="eyebrow">Movie Discovery</span>
          <h1>Discover trending movies and personalized recommendations.</h1>
          <p>
            Search, filter, and explore the latest titles or use fallback sample
            data when the external API key is not configured.
          </p>
        </div>
      </header>

      <section className="controls-panel">
        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            searchMovies(searchTerm);
          }}
        >
          <input
            aria-label="Search movies"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filter-group">
          <label htmlFor="movie-filter">Browse:</label>
          <select
            id="movie-filter"
            value={filter}
            onChange={(event) => {
              const nextFilter = event.target.value;
              setFilter(nextFilter);
              setSearchTerm('');
              loadMovies(nextFilter);
            }}
          >
            <option value="trending">Trending</option>
            <option value="top_rated">Top Rated</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </section>

      <section className="status-panel">
        <p>{helperText}</p>
        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="movies-grid">
        {loading ? (
          <div className="loading-state">Loading movies...</div>
        ) : movies.length ? (
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <div className="empty-state">No movies found. Try a different search.</div>
        )}
      </section>
    </div>
  );
}

export default App;
