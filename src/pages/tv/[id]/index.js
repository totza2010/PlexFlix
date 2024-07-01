import DominantColor from "components/DominantColor/DominantColor";
import MetaWrapper from "components/MetaWrapper";
import Recommendations from "components/Recommendations/Recommendations";
import TVDetails from "components/TVInfo/TVDetails";
import TVFacts from "components/TVInfo/TVFacts";
import TVTab from "components/TVInfo/TVTab";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import { fetchOptions, getCleanTitle, getReleaseYear, mergeEpisodeCount } from "src/utils/helper";
import { Error404, ModulesWrapper } from "styles/GlobalComponents";

const TvShow = ({
  id,
  airDate,
  title,
  adult,
  status,
  type,
  overview,
  backdropPath,
  posterPath,
  releaseYear,
  endYear,
  cast,
  seasons,
  reviews,
  networks,
  companies,
  socialIds,
  error,
  language,
  crewData,
  genres,
  rating,
  recommendations,
  homepage,
  tagline,
  keywords,
  convertedData,
  trailerLink,
  technicalDetails,
}) => {
  return (
    <Fragment>
      <MetaWrapper
        title={
          error ? "Not Found - PlexFlix" : `${title} (${releaseYear} - ${endYear}) - PlexFlix`
        }
        description={overview}
        image={`https://image.tmdb.org/t/p/w780${backdropPath}`}
        url={`${process.env.BUILD_URL}/tv/${getCleanTitle(id, title)}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <Fragment>
          {/* tv info hero section */}
          <TVDetails
            tvData={{
              id,
              airDate,
              title,
              adult,
              genres,
              overview,
              tagline,
              rating,
              backdropPath,
              posterPath,
              socialIds,
              crewData,
              trailerLink,
              homepage,
              releaseYear,
              technicalDetails
            }}
            seasons={seasons}
            keywords={keywords}
          />

          {/* tv facts */}
          <TVFacts facts={{ status, type, language }} networks={networks} companies={companies} />

          {/* tv tabs */}
          <TVTab
            cast={cast}
            reviews={reviews}
            images={convertedData}
          />

          {/* recommendations */}
          {recommendations?.length > 0 ? (
            <ModulesWrapper className='relative'>
              <DominantColor image={backdropPath} tint isUsingBackdrop />
              <div className='relative z-10'>
                <h2 className='text-[calc(1.375rem_+_1.5vw)] xl:text-[2.5rem] font-bold text-white text-center mb-4 lg:mb-8'>
                  Recommendations
                </h2>
                <Recommendations data={recommendations} type='tv' />
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
    const tvId = id.split("-")[0];

    const [tvResponse, languagesResponse, keywordsRes, imagesRes] = await Promise.all([
      fetch(apiEndpoints.tv.tvDetails(tvId), fetchOptions()),
      fetch(apiEndpoints.language, fetchOptions()),
      fetch(apiEndpoints.keywords.tags({ id: tvId, type: "tv" }), fetchOptions()),
      fetch(apiEndpoints.tv.images(tvId), fetchOptions())
    ]);

    if (!tvResponse.ok) {
      const errorDetails = await tvResponse.text();
      throw new Error(`Failed to fetch movieResponse details: ${tvResponse.status} - ${errorDetails}`);
    }

    const [tvData, languages, keywords, images] = await Promise.all([
      tvResponse.json(),
      languagesResponse.json(),
      keywordsRes.json(),
      imagesRes.json()
    ]);

    if (!tvData) throw new Error("List not found");

    const expectedUrl = getCleanTitle(tvData?.id, tvData?.name);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/tv/${expectedUrl}`,
          permanent: false,
        },
      };
    }

    const releaseYear = getReleaseYear(tvData?.first_air_date);
    const endYear =
      tvData?.status === "Ended" || tvData.status === "Canceled"
        ? new Date(tvData?.last_air_date).getFullYear()
        : "";

    const language = languages.find((item) => item.iso_639_1 === tvData.original_language);

    const status = tvData?.status || "TBA";
    const networks = tvData?.networks || "TBA";
    const companies = tvData?.production_companies || "TBA";
    const adult = tvData?.adult || false;
    const crewData = [
      ...tvData?.created_by?.slice(0, 2),
      ...tvData?.aggregate_credits?.crew
        ?.filter((credit) => credit.job === "Characters")
        .slice(0, 2)
    ];

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

    const trailer = tvData?.videos?.results?.find(
      (item) => item?.site === "YouTube" && item?.type === "Trailer"
    );

    const imdbId = tvData?.external_ids?.imdb_id;

    const technicalDetails = await fetch(apiEndpoints.cfWorker, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: imdbId
      })
    });

    const technicalDetailsData = await technicalDetails.json();

    return {
      props: {
        id: tvData?.id,
        title: tvData?.name,
        adult,
        airDate: tvData?.first_air_date,
        releaseYear,
        genres: tvData?.genres,
        tagline: tvData?.tagline,
        overview: tvData?.overview,
        rating: tvData?.vote_average,
        posterPath: tvData?.poster_path,
        backdropPath: tvData?.backdrop_path,
        crewData,
        trailerLink: trailer?.key ?? "",
        socialIds: tvData?.external_ids,
        homepage: tvData?.homepage,
        status,
        language: language?.english_name || language?.name || "TBA",
        networks,
        companies,
        type: tvData?.type,
        endYear,
        cast: {
          totalCount: tvData?.aggregate_credits?.cast?.length,
          data: mergeEpisodeCount(
            tvData?.aggregate_credits?.cast
              ?.map(({ roles, ...rest }) => roles.map((role) => ({ ...rest, ...role })))
              .flat()
          ).slice(0, 15)
        },
        seasons: tvData?.seasons,
        reviews: tvData?.reviews?.results ?? [],
        recommendations: tvData?.recommendations?.results,
        technicalDetails: technicalDetailsData || null,
        keywords,
        convertedData,
        error: false
      }
    };
  } catch (error) {
    console.log(error);
    props: {
      return { error: true };
    }
  }
};

export default TvShow;
