export const read_access_token = process.env.NEXT_PUBLIC_READ_ACCESS_TOKEN;

const baseUrlV3 = "https://api.themoviedb.org/3";
const baseUrlV4 = "https://api.themoviedb.org/4";
export const proxy = "https://corsproxy.scharde.workers.dev/?q=";

export const apiEndpoints = {
  auth: {
    requestToken: `${baseUrlV4}/auth/request_token`,

    accessToken: `${baseUrlV4}/auth/access_token`
  },
  user: {
    userInfo: ({ accountId }) => `${baseUrlV3}/account/${accountId}`,

    setFavorite: ({ accountId }) => `${baseUrlV3}/account/${accountId}/favorite`,

    getFavorites: ({ mediaType, accountId, pageQuery = 1 }) =>
      `${baseUrlV3}/account/${accountId}/favorite/${mediaType}?language=en-US&sort_by=created_at.desc&page=${pageQuery}`,

    addToWatchlist: ({ accountId }) => `${baseUrlV3}/account/${accountId}/watchlist`,

    getWatchlist: ({ mediaType, accountId, pageQuery = 1 }) =>
      `${baseUrlV3}/account/${accountId}/watchlist/${mediaType}?language=en-US&sort_by=created_at.desc&page=${pageQuery}`,

    getRated: ({ mediaType, accountId, pageQuery = 1 }) =>
      `${baseUrlV3}/account/${accountId}/rated/${mediaType}?language=en-US&sort_by=created_at.desc&page=${pageQuery}`,

    setRating: ({ mediaType, mediaId }) =>
      `${baseUrlV3}/${mediaType}/${mediaId}/rating`,

    setRatingEpisode: ({ mediaId, SeasonNumber, EpisodeNumber }) =>
      `${baseUrlV3}/tv/${mediaId}/season/${SeasonNumber}/episode/${EpisodeNumber}/rating`,

    deleteRating: ({ mediaType, mediaId }) =>
      `${baseUrlV3}/${mediaType}/${mediaId}/rating`,

    deleteRatingEpisode: ({ mediaId, SeasonNumber, EpisodeNumber }) =>
      `${baseUrlV3}/tv/${mediaId}/season/${SeasonNumber}/episode/${EpisodeNumber}/rating`,

    getRecommendations: ({ mediaType, accountId, pageQuery = 1 }) =>
      `${baseUrlV4}/account/${accountId}/${mediaType}/recommendations?page=${pageQuery}&language=en-US`,

    getCountryCode: (ip) => `https://ipwho.is/${ip}?fields=country_code`
  },
  search: {
    movieSearchWithYear: ({ query, year }) =>
      `${baseUrlV3}/search/movie?language=en-US&query=${query}&page=1&include_adult=false&year=${year}`,

    movieSearch: ({ query, pageQuery = 1 }) =>
      `${baseUrlV3}/search/movie?language=en-US&query=${query}&page=${pageQuery}&include_adult=false`,

    tvSearchWithYear: ({ query, year }) =>
      `${baseUrlV3}/search/tv?language=en-US&query=${query}&page=1&include_adult=false&first_air_date_year=${year}`,

    tvSearch: ({ query, pageQuery = 1 }) =>
      `${baseUrlV3}/search/tv?language=en-US&query=${query}&page=${pageQuery}&include_adult=false`,

    personSearch: ({ query, pageQuery = 1 }) =>
      `${baseUrlV3}/search/person?include_adult=true&query=${query}&page=${pageQuery}`,

    keywordSearch: ({ query, pageQuery = 1 }) =>
      `${baseUrlV3}/search/keyword?query=${query}&page=${pageQuery}`
  },
  movie: {
    popularMovies: `${baseUrlV3}/movie/popular?language=en-US&page=1`,

    trendingMovies: `${baseUrlV3}/trending/movie/day?language=en-US&page=1`,

    movieDetails: (id) =>
      `${baseUrlV3}/movie/${id}?language=en-US&append_to_response=videos,credits,reviews,recommendations,external_ids`,

    movieGenre: ({ genreId, pageQuery = 1 }) =>
      `${baseUrlV3}/discover/movie?language=en-US&include_adult=false&page=${pageQuery}&with_genres=${genreId}`,

    getMovieCredits: ({ id }) =>
      `${baseUrlV3}/movie/${id}?language=en-US&append_to_response=credits`,

    movieGenreList: `${baseUrlV3}/genre/movie/list?language=en-US`,

    nowPlaying: ({ region }) => `${baseUrlV3}/movie/now_playing?page=1&region=${region}`,

    images: (id) => `${baseUrlV3}/movie/${id}/images`,

    videos: (id) => `${baseUrlV3}/movie/${id}/videos`
  },
  tv: {
    popularTV: `${baseUrlV3}/tv/popular?language=en-US&page=1`,

    trendingTV: `${baseUrlV3}/trending/tv/day?language=en-US&page=1`,

    tvDetails: (id) =>
      `${baseUrlV3}/tv/${id}?language=en-US&append_to_response=videos,aggregate_credits,reviews,recommendations,external_ids`,

    tvRecommendations: ({ id, pageQuery = 1 }) =>
      `${baseUrlV3}/tv/${id}/recommendations?language=en-US&page=${pageQuery}`,

    tvDetailsNoAppend: (id) => `${baseUrlV3}/tv/${id}?language=en-US`,

    tvSeasonDetailsNoAppend: ({ id, sn }) => `${baseUrlV3}/tv/${id}/season/${sn}?language=en-US`,

    tvSeasonDetails: ({ id, seasonNumber }) =>
      `${baseUrlV3}/tv/${id}/season/${seasonNumber}?language=en-US&append_to_response=aggregate_credits`,

    episodeDetails: ({ id, seasonNumber, episodeNumber }) =>
      `${baseUrlV3}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US&append_to_response=images,credits&include_image_language=en,null`,

    tvGenre: ({ genreId, pageQuery = 1 }) =>
      `${baseUrlV3}/discover/tv?language=en-US&include_adult=false&page=${pageQuery}&with_genres=${genreId}`,

    getTvCredits: ({ id }) =>
      `${baseUrlV3}/tv/${id}?language=en-US&append_to_response=aggregate_credits`,

    tvGenreList: `${baseUrlV3}/genre/tv/list?language=en-US`,

    tvImages: (id) => `${baseUrlV3}/tv/${id}/images`,

    tvVideos: (id) => `${baseUrlV3}/tv/${id}/videos`,

    tvSeasonImages: ({ id, sn }) => `${baseUrlV3}/tv/${id}/season/${sn}/images`,

    tvSeasonVideos: ({ id, sn }) => `${baseUrlV3}/tv/${id}/season/${sn}/videos`,

    tvSeasonEpisodeImages: ({ id, sn, ep }) => `${baseUrlV3}/tv/${id}/season/${sn}/episode/${ep}/images`,

    tvSeasonEpisodeVideos: ({ id, sn, ep }) => `${baseUrlV3}/tv/${id}/season/${sn}/episode/${ep}/videos`
  },
  keywords: {
    tags: ({ id, type }) =>
      `${baseUrlV3}/${type}/${id}/keywords`,

    keywordMovie: ({ keywordId, pageQuery = 1 }) =>
      `${baseUrlV3}/discover/movie?include_adult=true&include_video=true&language=en-US&page=${pageQuery}&sort_by=popularity.desc&with_keywords=${keywordId}`,

    keywordTv: ({ keywordId, pageQuery = 1 }) =>
      `${baseUrlV3}/discover/tv?include_adult=true&language=en-US&page=${pageQuery}&sort_by=popularity.desc&with_keywords=${keywordId}`,

    keyword: (keywordId) =>
      `${baseUrlV3}/keyword/${keywordId}`
  },
  person: {
    personDetails: (id) =>
      `${baseUrlV3}/person/${id}?language=en-US&append_to_response=combined_credits,external_ids,images`
  },
  watchProviders: {
    movieWatchProviders: ({ region }) =>
      `${baseUrlV3}/watch/providers/movie?language=en-US&watch_region=${region}`,
    tvWatchProviders: ({ region }) =>
      `${baseUrlV3}/watch/providers/tv?language=en-US&watch_region=${region}`,
    watchProviderMovies: ({ region, pageQuery, providerId }) =>
      `${baseUrlV3}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageQuery}&sort_by=popularity.desc&watch_region=${region}&with_watch_providers=${providerId}`,
    watchProviderTv: ({ region, pageQuery, providerId }) =>
      `${baseUrlV3}/discover/tv?include_adult=false&include_video=false&language=en-US&page=${pageQuery}&sort_by=popularity.desc&watch_region=${region}&with_watch_providers=${providerId}`,
    regions: `${baseUrlV3}/watch/providers/regions`
  },
  network: {
    networkDetails: (id) => `${baseUrlV3}/network/${id}?append_to_response=images`,
    networkMedia: ({ id, pageQuery = 1 }) =>
      `${baseUrlV3}/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${pageQuery}&sort_by=popularity.desc&with_networks=${id}`
  },
  company: {
    companyDetails: (id) => `${baseUrlV3}/company/${id}?append_to_response=images`,
    companyTvMedia: ({ id, pageQuery = 1 }) =>
      `${baseUrlV3}/discover/tv?include_adult=true&language=en-US&page=${pageQuery}&sort_by=popularity.desc&with_companies=${id}`,
    companyMoviesMedia: ({ id, pageQuery = 1 }) =>
      `${baseUrlV3}/discover/movie?include_adult=true&include_video=true&language=en-US&page=${pageQuery}&sort_by=popularity.desc&with_companies=${id}`
  },
  collection: {
    collectionDetails: (id) => `${baseUrlV3}/collection/${id}`
  },
  lists: {
    getLists: ({ accountId, pageQuery = 1 }) =>
      `${baseUrlV4}/account/${accountId}/lists?page=${pageQuery}&sort_by=created_at.desc`,
    getListDetails: ({ id, pageQuery = 1 }) => `${baseUrlV4}/list/${id}?page=${pageQuery}`,
    createList: `${baseUrlV4}/list`,
    updateList: ({ id }) => `${baseUrlV4}/list/${id}`,
    listItems: ({ id }) => `${baseUrlV4}/list/${id}/items`,
    listItemStatus: ({ id, mediaId, mediaType }) =>
      `${baseUrlV4}/list/${id}/item_status?media_id=${mediaId}&media_type=${mediaType}`,
    getMovieLists: ({ movieId, pageQuery = 1 }) =>
      `${baseUrlV3}/movie/${movieId}/lists?language=en-US&page=${pageQuery}`,
    getTVLists: ({ tvId, pageQuery = 1 }) =>
      `${baseUrlV3}/tv/${tvId}/lists?language=en-US&page=${pageQuery}`
  },
  language: `${baseUrlV3}/configuration/languages`,
  cfWorker: "https://imdbtechnical.98mohitkumar.workers.dev"
};

export const blurPlaceholder =
  "data:image/webp;base64,UklGRgwCAABXRUJQVlA4WAoAAAAgAAAAAQAAAgAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggHgAAAJABAJ0BKgIAAwAHQJYlpAAC51m2AAD+5R4qGAAAAA==";
