function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <div className="movie-poster">
        {movie.poster_path ? (
          <img src={movie.poster_path} alt={movie.title} />
        ) : (
          <div className="poster-placeholder">No image available</div>
        )}
      </div>
      <div className="movie-meta">
        <div className="movie-heading">
          <h2>{movie.title}</h2>
          <span>{new Date(movie.release_date).getFullYear()}</span>
        </div>
        <p className="movie-rating">Rating: {movie.vote_average.toFixed(1)}</p>
        <p className="movie-overview">{movie.overview}</p>
        <div className="genre-list">
          {movie.genres?.slice(0, 3).map((genre) => (
            <span key={genre} className="genre-pill">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
