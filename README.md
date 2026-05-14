# Movie Discovery & Recommendation Platform

A React movie discovery application with search, filters, and an optional real-time REST API integration.

## Features
- Display trending movies and search results
- Search and filter controls for a better experience
- Component-based layout with reusable cards
- Local sample data fallback when no TMDB key is available

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Optional TMDB Integration
Create a `.env` file with:
```bash
VITE_TMDB_API_KEY=your_tmdb_api_key
```

If no API key is provided, the app uses sampleMovies fallback data.
