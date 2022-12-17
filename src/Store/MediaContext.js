import { useSession } from 'next-auth/react';
import {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback
} from 'react';
import {
  getWatchlist,
  getFavorites,
  getRated,
  getRecommendations
} from '../apiEndpoints/user';
import { UserContext } from './UserContext';

export const MediaContext = createContext();

const MediaContextProvider = ({ children }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [moviesWatchlist, setMoviesWatchlist] = useState([]);
  const [favoriteTvShows, setFavoriteTvShows] = useState([]);
  const [tvShowsWatchlist, setTvShowsWatchlist] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [ratedTvShows, setRatedTvShows] = useState([]);
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [tvRecommendations, setTvRecommendations] = useState([]);
  const { userInfo } = useContext(UserContext);
  const { data } = useSession();

  const pagesRef = useRef({
    favoriteMoviesCurrentPage: 1,
    favoriteTvShowsCurrentPage: 1,
    moviesWatchlistCurrentPage: 1,
    tvShowsWatchlistCurrentPage: 1,
    ratedMoviesCurrentPage: 1,
    ratedTvShowsCurrentPage: 1,
    movieRecommendationsCurrentPage: 1,
    tvRecommendationsCurrentPage: 1
  });

  const logoutHelper = useCallback(() => {
    setFavoriteMovies([]);
    setFavoriteTvShows([]);

    setMoviesWatchlist([]);
    setTvShowsWatchlist([]);

    setRatedMovies([]);
    setRatedTvShows([]);

    setMovieRecommendations([]);
    setTvRecommendations([]);

    pagesRef.current = {
      favoriteMoviesCurrentPage: 1,
      favoriteTvShowsCurrentPage: 1,
      moviesWatchlistCurrentPage: 1,
      tvShowsWatchlistCurrentPage: 1,
      ratedMoviesCurrentPage: 1,
      ratedTvShowsCurrentPage: 1,
      movieRecommendationsCurrentPage: 1,
      tvRecommendationsCurrentPage: 1
    };
  }, []);

  const revalidateFavorites = useCallback((key) => {
    if (key === 'favoriteMovies') {
      setFavoriteMovies([]);
    } else {
      setFavoriteTvShows([]);
    }
  }, []);

  const revalidateWatchlist = useCallback((key) => {
    if (key === 'moviesWatchlist') {
      setMoviesWatchlist([]);
    } else {
      setTvShowsWatchlist([]);
    }
  }, []);

  const revalidateRated = useCallback((key) => {
    if (key === 'movie') {
      setRatedMovies([]);
    } else {
      setRatedTvShows([]);
    }
  }, []);

  useEffect(() => {
    if (favoriteMovies?.length === 0) {
      pagesRef.current = {
        ...pagesRef.current,
        favoriteMoviesCurrentPage: 1
      };
    }

    if (
      userInfo?.id &&
      data?.user?.sessionId &&
      favoriteMovies?.length ===
        (pagesRef.current.favoriteMoviesCurrentPage - 1) * 20
    ) {
      getFavorites(
        'movies',
        userInfo?.id,
        data?.user?.sessionId,
        pagesRef.current.favoriteMoviesCurrentPage
      ).then((data) => {
        if (
          data?.results?.length > 0 &&
          pagesRef.current.favoriteMoviesCurrentPage === data?.page
        ) {
          pagesRef.current = {
            ...pagesRef.current,
            favoriteMoviesCurrentPage: data.page + 1
          };

          setFavoriteMovies((prev) => prev.concat(data?.results ?? []));
        }
      });
    }
  }, [data?.user?.sessionId, favoriteMovies, userInfo?.id]);

  useEffect(() => {
    if (favoriteTvShows?.length === 0) {
      pagesRef.current = {
        ...pagesRef.current,
        favoriteTvShowsCurrentPage: 1
      };
    }

    if (
      userInfo?.id &&
      data?.user?.sessionId &&
      favoriteTvShows?.length ===
        (pagesRef.current.favoriteTvShowsCurrentPage - 1) * 20
    ) {
      getFavorites(
        'tv',
        userInfo?.id,
        data?.user?.sessionId,
        pagesRef.current.favoriteTvShowsCurrentPage
      ).then((data) => {
        if (
          data?.results?.length > 0 &&
          pagesRef.current.favoriteTvShowsCurrentPage === data?.page
        ) {
          pagesRef.current = {
            ...pagesRef.current,
            favoriteTvShowsCurrentPage: data.page + 1
          };

          setFavoriteTvShows((prev) => prev.concat(data?.results ?? []));
        }
      });
    }
  }, [data?.user?.sessionId, favoriteTvShows, userInfo?.id]);

  useEffect(() => {
    if (moviesWatchlist?.length === 0) {
      pagesRef.current = {
        ...pagesRef.current,
        moviesWatchlistCurrentPage: 1
      };
    }

    if (
      userInfo?.id &&
      data?.user?.sessionId &&
      moviesWatchlist?.length ===
        (pagesRef.current.moviesWatchlistCurrentPage - 1) * 20
    ) {
      getWatchlist(
        'movies',
        userInfo?.id,
        data?.user?.sessionId,
        pagesRef.current.moviesWatchlistCurrentPage
      ).then((data) => {
        if (
          data?.results?.length > 0 &&
          pagesRef.current.moviesWatchlistCurrentPage === data?.page
        ) {
          pagesRef.current = {
            ...pagesRef.current,
            moviesWatchlistCurrentPage: data.page + 1
          };

          setMoviesWatchlist((prev) => prev.concat(data?.results ?? []));
        }
      });
    }
  }, [data?.user?.sessionId, moviesWatchlist, userInfo?.id]);

  useEffect(() => {
    if (tvShowsWatchlist?.length === 0) {
      pagesRef.current = {
        ...pagesRef.current,
        tvShowsWatchlistCurrentPage: 1
      };
    }

    if (
      userInfo?.id &&
      data?.user?.sessionId &&
      tvShowsWatchlist?.length ===
        (pagesRef.current.tvShowsWatchlistCurrentPage - 1) * 20
    ) {
      getWatchlist(
        'tv',
        userInfo?.id,
        data?.user?.sessionId,
        pagesRef.current.tvShowsWatchlistCurrentPage
      ).then((data) => {
        if (
          data?.results?.length > 0 &&
          pagesRef.current.tvShowsWatchlistCurrentPage === data?.page
        ) {
          pagesRef.current = {
            ...pagesRef.current,
            tvShowsWatchlistCurrentPage: data.page + 1
          };

          setTvShowsWatchlist((prev) => prev.concat(data?.results ?? []));
        }
      });
    }
  }, [data?.user?.sessionId, tvShowsWatchlist, userInfo?.id]);

  useEffect(() => {
    if (ratedMovies?.length === 0) {
      pagesRef.current = {
        ...pagesRef.current,
        ratedMoviesCurrentPage: 1
      };
    }

    if (
      userInfo?.id &&
      data?.user?.sessionId &&
      ratedMovies?.length === (pagesRef.current.ratedMoviesCurrentPage - 1) * 20
    ) {
      getRated(
        'movies',
        userInfo?.id,
        data?.user?.sessionId,
        pagesRef.current.ratedMoviesCurrentPage
      ).then((data) => {
        if (
          data?.results?.length > 0 &&
          pagesRef.current.ratedMoviesCurrentPage === data?.page
        ) {
          pagesRef.current = {
            ...pagesRef.current,
            ratedMoviesCurrentPage: data.page + 1
          };

          setRatedMovies((prev) => prev.concat(data?.results ?? []));
        }
      });
    }
  }, [data?.user?.sessionId, ratedMovies, userInfo?.id]);

  useEffect(() => {
    if (ratedTvShows?.length === 0) {
      pagesRef.current = {
        ...pagesRef.current,
        ratedTvShowsCurrentPage: 1
      };
    }

    if (
      userInfo?.id &&
      data?.user?.sessionId &&
      ratedTvShows?.length ===
        (pagesRef.current.ratedTvShowsCurrentPage - 1) * 20
    ) {
      getRated(
        'tv',
        userInfo?.id,
        data?.user?.sessionId,
        pagesRef.current.ratedTvShowsCurrentPage
      ).then((data) => {
        if (
          data?.results?.length > 0 &&
          pagesRef.current.ratedTvShowsCurrentPage === data?.page
        ) {
          pagesRef.current = {
            ...pagesRef.current,
            ratedTvShowsCurrentPage: data.page + 1
          };

          setRatedTvShows((prev) => prev.concat(data?.results ?? []));
        }
      });
    }
  }, [data?.user?.sessionId, ratedTvShows, userInfo?.id]);

  useEffect(() => {
    if (
      userInfo?.id &&
      data?.user?.sessionId &&
      movieRecommendations.length < 40
    ) {
      getRecommendations(
        'movie',
        userInfo?.id,
        pagesRef.current.movieRecommendationsCurrentPage
      ).then((data) => {
        if (
          data?.results?.length > 0 &&
          pagesRef.current.movieRecommendationsCurrentPage === data?.page
        ) {
          pagesRef.current = {
            ...pagesRef.current,
            movieRecommendationsCurrentPage: data.page + 1
          };

          setMovieRecommendations((prev) => prev.concat(data?.results ?? []));
        }
      });
    }
  }, [userInfo?.id, movieRecommendations, data?.user?.sessionId]);

  useEffect(() => {
    if (
      userInfo?.id &&
      data?.user?.sessionId &&
      tvRecommendations?.length < 40
    ) {
      getRecommendations(
        'tv',
        userInfo?.id,
        pagesRef.current.tvRecommendationsCurrentPage
      ).then((data) => {
        if (
          data?.results?.length > 0 &&
          pagesRef.current.tvRecommendationsCurrentPage === data?.page
        ) {
          pagesRef.current = {
            ...pagesRef.current,
            tvRecommendationsCurrentPage: data.page + 1
          };

          setTvRecommendations((prev) => prev.concat(data?.results ?? []));
        }
      });
    }
  }, [userInfo?.id, tvRecommendations, data?.user?.sessionId]);

  return (
    <MediaContext.Provider
      value={{
        favoriteMovies,
        favoriteTvShows,
        moviesWatchlist,
        tvShowsWatchlist,
        ratedMovies,
        ratedTvShows,
        movieRecommendations,
        tvRecommendations,
        revalidateFavorites,
        revalidateWatchlist,
        revalidateRated,
        logoutHelper
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaContextProvider;
