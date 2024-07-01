import useFetchAllPages from "hooks/useFetchAllPages";
import { createContext, useContext } from "react";

const MediaContext = createContext({});

export const useMediaContext = () => {
  const context = useContext(MediaContext);

  if (context === undefined) {
    throw new Error("useMediaContext must be used within MediaContextProvider");
  }

  return context;
};

const MediaContextProvider = ({ children }) => {
  const {
    media: moviesWatchlist,
    validateMedia: validateMoviesWatchlist,
    loading: moviesWatchlistLoading
  } = useFetchAllPages({
    endpoint: "watchlist",
    mediaType: "movies"
  });

  const {
    media: tvShowsWatchlist,
    validateMedia: validateTvWatchlist,
    loading: tvShowsWatchlistLoading
  } = useFetchAllPages({
    endpoint: "watchlist",
    mediaType: "tv"
  });

  const {
    media: favoriteMovies,
    validateMedia: validateFavoriteMovies,
    loading: favoriteMoviesLoading
  } = useFetchAllPages({
    endpoint: "favorites",
    mediaType: "movies"
  });

  const {
    media: favoriteTvShows,
    validateMedia: validateFavoriteTvShows,
    loading: favoriteTvShowsLoading
  } = useFetchAllPages({
    endpoint: "favorites",
    mediaType: "tv"
  });

  const {
    media: ratedMovies,
    validateMedia: validateRatedMovies,
    loading: ratedMoviesLoading
  } = useFetchAllPages({
    endpoint: "ratings",
    mediaType: "movies"
  });

  const {
    media: ratedTvShows,
    validateMedia: validateRatedTvShows,
    loading: ratedTvShowsLoading
  } = useFetchAllPages({
    endpoint: "ratings",
    mediaType: "tv"
  });

  const {
    media: ratedTvShowsEpisode,
    validateMedia: validateRatedTvShowsEpisode,
    loading: ratedTvShowsEpisodeLoading
  } = useFetchAllPages({
    endpoint: "ratings",
    mediaType: "tv/episodes"
  });

  const { media: movieRecommendations, loading: movieRecommendationsLoading } = useFetchAllPages({
    endpoint: "recommendations",
    mediaType: "movie"
  });

  const { media: tvRecommendations, loading: tvRecommendationsLoading } = useFetchAllPages({
    endpoint: "recommendations",
    mediaType: "tv"
  });

  return (
    <MediaContext.Provider
      value={{
        favoriteMovies,
        favoriteTvShows,
        moviesWatchlist,
        tvShowsWatchlist,
        ratedMovies,
        ratedTvShows,
        ratedTvShowsEpisode,
        movieRecommendations,
        tvRecommendations,

        moviesWatchlistLoading,
        tvShowsWatchlistLoading,
        favoriteMoviesLoading,
        favoriteTvShowsLoading,
        ratedMoviesLoading,
        ratedTvShowsLoading,
        ratedTvShowsEpisodeLoading,
        movieRecommendationsLoading,
        tvRecommendationsLoading,

        validateFavoriteMovies,
        validateFavoriteTvShows,
        validateMoviesWatchlist,
        validateTvWatchlist,
        validateRatedMovies,
        validateRatedTvShows,
        validateRatedTvShowsEpisode
      }}>
      {children}
    </MediaContext.Provider>
  );
};

export default MediaContextProvider;
