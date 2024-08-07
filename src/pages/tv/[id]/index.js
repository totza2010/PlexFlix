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
  credits,
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
  videos
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
            credits={credits}
            reviews={reviews}
            images={convertedData}
            videos={videos}
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

    const [tvResponse, recommendationsResponse1, recommendationsResponse2, languagesResponse, keywordsRes, imagesRes, videosRes] = await Promise.all([
      fetch(apiEndpoints.tv.tvDetails(tvId), fetchOptions()),
      fetch(apiEndpoints.tv.tvRecommendations({id: tvId, pageQuery: 1}), fetchOptions()),
      fetch(apiEndpoints.tv.tvRecommendations({id: tvId, pageQuery: 2}), fetchOptions()),
      fetch(apiEndpoints.language, fetchOptions()),
      fetch(apiEndpoints.keywords.tags({ id: tvId, type: "tv" }), fetchOptions()),
      fetch(apiEndpoints.tv.tvImages(tvId), fetchOptions()),
      fetch(apiEndpoints.tv.tvVideos(tvId), fetchOptions())
    ]);

    if (!tvResponse.ok) {
      const errorDetails = await tvResponse.text();
      throw new Error(`Failed to fetch tvResponse details: ${tvResponse.status} - ${errorDetails}`);
    }

    const [tvData, recommendations1, recommendations2, languages, keywords, images, videoDatas] = await Promise.all([
      tvResponse.json(),
      recommendationsResponse1.json(),
      recommendationsResponse2.json(),
      languagesResponse.json(),
      keywordsRes.json(),
      imagesRes.json(),
      videosRes.json()
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

    const recommendations = recommendations1["results"].concat(recommendations2.results);
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

    // Function to map iso_639_1 values
    function mapLanguage(iso) {
      const language = languages.find(lang => lang.iso_639_1 === iso);
      return language ? language : { "iso_639_1": "null", "english_name": "No Language", "name": "No Language" };
    }

    const convertedData = {
      ...images,
      posters: images.posters ? images.posters.map(poster => ({
        ...poster,
        iso_639_1: mapLanguage(poster.iso_639_1)
      })) : [], // Default to an empty array if posters is undefined
      backdrops: images.backdrops ? images.backdrops.map(backdrop => ({
        ...backdrop,
        iso_639_1: mapLanguage(backdrop.iso_639_1)
      })) : [], // Default to an empty array if backdrops is undefined
      logos: images.logos ? images.logos.map(logo => ({
        ...logo,
        iso_639_1: mapLanguage(logo.iso_639_1)
      })) : [] // Default to an empty array if logos is undefined
    };
    
    const videos = {
      ...videoDatas,
      results: videoDatas?.results ? videoDatas.results.map(result => ({
        ...result,
        iso_639_1: mapLanguage(result.iso_639_1)
      })) : [] // Default to an empty array if results is undefined
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

    const technicalDetailsData = imdbId ? await technicalDetails.json() : null;
    const crewData = [
      ...tvData?.created_by?.slice(0, 2),
      ...tvData?.aggregate_credits?.crew
        ?.filter((credit) => credit.job === "Characters")
        .slice(0, 2)
    ];
    const cast = mergeEpisodeCount(
      tvData?.aggregate_credits?.cast
        ?.map(({ roles, ...rest }) => roles.map((role) => ({ ...rest, ...role })))
        .flat()
    ).sort((a, b) => b.popularity - a.popularity || b.episode_count - a.episode_count).slice(0, 12)
    const crew = mergeEpisodeCount(
      tvData?.aggregate_credits?.crew
        ?.map(({ jobs, ...rest }) => jobs.map((job) => ({ ...rest, ...job })))
        .flat()
    ).sort((a, b) => b.popularity - a.popularity || b.episode_count - a.episode_count).slice(0, 5)
    const credits = cast.concat(crew)

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
        credits: {
          data: credits
        },
        seasons: tvData?.seasons,
        reviews: tvData?.reviews?.results ?? [],
        recommendations: recommendations || [],
        technicalDetails: technicalDetailsData || null,
        keywords,
        convertedData,
        videos: videos?.results || [],
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

export default TvShow;
