import DominantColor from "components/DominantColor/DominantColor";
import MetaWrapper from "components/MetaWrapper";
import MovieDetails from "components/MovieInfo/MovieDetails";
import MovieFacts from "components/MovieInfo/MovieFacts";
import MovieTab from "components/MovieInfo/MovieTab";
import Recommendations from "components/Recommendations/Recommendations";
import { apiEndpoints } from "globals/constants";
import { Fragment, useEffect, useState } from "react";
import { fetchOptions, getCleanTitle, getReleaseDate, getReleaseYear } from "src/utils/helper";
import { Error404, ModulesWrapper } from "styles/GlobalComponents";

const Movie = ({
  id,
  title,
  adult,
  releaseYear,
  releaseDate,
  genres,
  runtime,
  tagline,
  overview,
  rating,
  moviePoster,
  backdropPath,
  crewData,
  collection,
  trailerLink,
  socialIds,
  homepage,
  status,
  companies,
  language,
  country,
  budget,
  revenue,
  cast,
  reviews,
  isEasterMovie,
  recommendations,
  keywords,
  convertedData,
  error
}) => {
  const [showEaster, setShowEaster] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    let easterSeen = localStorage.getItem("easterSeen");
    if (isEasterMovie && easterSeen !== "seen") {
      setShowEaster(true);
      document.body.style.overflow = "hidden";
    }

    if (easterSeen === "seen") {
      setHasSeen(true);
    }
  }, [isEasterMovie]);

  const easterHandler = () => {
    setShowEaster(!showEaster);
    window.scrollTo(0, 0);
    setHasSeen(true);
    localStorage.setItem("easterSeen", "seen");

    if (showEaster) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };
  
  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${title} (${releaseYear}) - PlexFlix`}
        image={`https://image.tmdb.org/t/p/w780${backdropPath}`}
        description={overview}
        url={`${process.env.BUILD_URL}/movies/${getCleanTitle(id, title)}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <Fragment>
          {/* movie info hero section */}
          <MovieDetails
            easter={{
              renderEaster: isEasterMovie,
              hasSeen,
              showEaster,
              easterHandler
            }}
            movieDetails={{
              id,
              title,
              adult,
              overview,
              releaseYear,
              releaseDate,
              backdropPath,
              runtime,
              trailerLink,
              genres,
              tagline,
              rating,
              moviePoster,
              crewData,
              collection,
              socialIds,
              homepage
            }}
            keywords={keywords}
          />

          {/* movie facts */}
          <MovieFacts
            facts={{
              status,
              budget,
              revenue,
              language
            }}
            country={country}
            companies={companies}
          />

          {/* movie tabs */}
          <MovieTab cast={cast} reviews={reviews} images={convertedData} />

          {/* recommendations */}
          {recommendations?.length > 0 ? (
            <ModulesWrapper className='relative'>
              <DominantColor image={backdropPath} tint isUsingBackdrop />
              <div className='relative z-10'>
                <h2 className='text-[calc(1.375rem_+_1.5vw)] xl:text-[2.5rem] font-bold text-white text-center mb-4 lg:mb-8'>
                  Recommendations
                </h2>

                <Recommendations data={recommendations} type='movies' />
              </div>
            </ModulesWrapper>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const movieId = id.split("-")[0];

    const [movieResponse, languagesResponse, keywordsRes, imagesRes] = await Promise.all([
      fetch(apiEndpoints.movie.movieDetails(movieId), fetchOptions()),
      fetch(apiEndpoints.language, fetchOptions()),
      fetch(apiEndpoints.keywords.tags({ mediaId: movieId, type: "movie" }), fetchOptions()),
      fetch(apiEndpoints.movie.images(movieId), fetchOptions())
    ]);

    if (!movieResponse.ok) {
      const errorDetails = await movieResponse.text();
      throw new Error(`Failed to fetch movieResponse details: ${movieResponse.status} - ${errorDetails}`);
    }

    const [movieDetails, languages, keywords, images] = await Promise.all([
      movieResponse.json(),
      languagesResponse.json(),
      keywordsRes.json(),
      imagesRes.json()
    ]);

    if (!movieDetails) throw new Error("List not found");

    const expectedUrl = getCleanTitle(movieDetails?.id, movieDetails?.title);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/movies/${expectedUrl}`,
          permanent: false,
        },
      };
    }

    let collectionDetails = null;
    if (movieDetails?.belongs_to_collection) {
      const [collectionResponse] = await Promise.all([
        fetch(apiEndpoints.collection.collectionDetails(movieDetails?.belongs_to_collection?.id), fetchOptions())
      ]);

      if (!collectionResponse.ok) throw new Error("error fetching collection details");

      [collectionDetails] = await Promise.all([
        collectionResponse.json()
      ]);
    }

    const country = movieDetails?.production_companies?.[0]?.origin_country || "US";
    const releaseYear = getReleaseYear(movieDetails?.release_date);
    const releaseDate = getReleaseDate(movieDetails?.release_date);
    const status = movieDetails?.status || "TBA";
    const companies = movieDetails?.production_companies || "TBA";
    const language = languages.find((item) => item.iso_639_1 === movieDetails.original_language);
    const adult = movieDetails?.adult || false;

    const trailers = movieDetails?.videos?.results?.find(
      (item) => item?.site === "YouTube" && item?.type === "Trailer"
    );

    // Function to map iso_639_1 values
    function mapLanguage(iso) {
      const language = languages.find(lang => lang.iso_639_1 === iso);
      return language ? language : { "iso_639_1": "null", "english_name": "No Language", "name": "No Language" };
    }

    // Convert the data
    const convertedData = {
      ...images,
      posters: images.posters.map(poster => ({
        ...poster,
        iso_639_1: mapLanguage(poster.iso_639_1)
      })),
      backdrops: images.backdrops.map(backdrop => ({
        ...backdrop,
        iso_639_1: mapLanguage(backdrop.iso_639_1)
      })),
      logos: images.logos.map(logo => ({
        ...logo,
        iso_639_1: mapLanguage(logo.iso_639_1)
      }))
    };

    const crewData = [
      ...movieDetails?.credits?.crew?.filter((credit) => credit?.job === "Director").slice(0, 2),
      ...movieDetails?.credits?.crew?.filter((credit) => credit?.job === "Writer").slice(0, 3),
      ...movieDetails?.credits?.crew?.filter((credit) => credit?.job === "Characters").slice(0, 2)
    ];
    return {
      props: {
        id: movieDetails?.id,
        title: movieDetails?.title,
        adult,
        releaseYear,
        releaseDate,
        genres: movieDetails?.genres,
        runtime: movieDetails?.runtime,
        tagline: movieDetails?.tagline,
        overview: movieDetails?.overview,
        rating: movieDetails?.vote_average,
        moviePoster: movieDetails?.poster_path,
        backdropPath: movieDetails?.backdrop_path,
        crewData,
        collection: collectionDetails ?? "",
        trailerLink: trailers?.key ?? "",
        socialIds: movieDetails?.external_ids,
        homepage: movieDetails?.homepage,
        status,
        companies,
        language: language?.english_name || language?.name || "TBA",
        country,
        budget: movieDetails?.budget,
        revenue: movieDetails?.revenue,
        cast: {
          totalCount: movieDetails?.credits?.cast?.length,
          data: movieDetails?.credits?.cast?.slice(0, 15)
        },
        isEasterMovie: movieDetails?.id === 345911,
        reviews: movieDetails?.reviews?.results ?? [],
        recommendations: movieDetails?.recommendations?.results,
        keywords,
        convertedData,
        error: false
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: true
      }
    };
  }
};

export default Movie;
