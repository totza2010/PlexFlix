import DominantColor from "components/DominantColor/DominantColor";
import EpisodeDetails from "components/EpisodeInfo/EpisodeDetails";
import EpisodeTab from "components/EpisodeInfo/EpisodeTab";
import MetaWrapper from "components/MetaWrapper";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import {
  fetchOptions,
  getCleanTitle,
  getReleaseYear
} from "src/utils/helper";
import {
  Error404
} from "styles/GlobalComponents";

const Episode = ({
  error,
  releaseDate,
  overview,
  credits,
  images,
  videos,
  seasonNumber,
  episodeNumber,
  rating,
  backdrop,
  episodeName,
  runtime,
  tvData: { id, name, airDate },
  tvData2,
  seasonData
}) => {
  return (
    <Fragment>
      <MetaWrapper
        title={
          error
            ? "Not Found - PlexFlix"
            : `${name} (${getReleaseYear(
              airDate
            )}) S${seasonNumber}E${episodeNumber} - Details - PlexFlix`
        }
        description={overview}
        image={`https://image.tmdb.org/t/p/w780${backdrop}`}
        url={`${process.env.BUILD_URL}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <Fragment>
          <DominantColor image={backdrop} tint isUsingBackdrop flip />

          <EpisodeDetails
            episodeNumber={episodeNumber}
            backdrop={backdrop}
            episodeName={episodeName}
            releaseDate={releaseDate}
            rating={rating}
            runtime={runtime}
            overview={overview}
            tvData={tvData2}
            seasonData={seasonData}
          />

          <EpisodeTab credits={credits} images={images} videos={videos} />

        </Fragment>
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id, sn, episode } = ctx.query;
    const tvId = id.split("-")[0];

    const [response, tvRes, seasonRes, languagesRes, imagesRes, videosRes] = await Promise.all([
      fetch(
        apiEndpoints.tv.episodeDetails({
          id: tvId,
          seasonNumber: sn,
          episodeNumber: episode
        }), fetchOptions()
      ),
      fetch(apiEndpoints.tv.tvDetailsNoAppend(tvId), fetchOptions()),
      fetch(apiEndpoints.tv.tvSeasonDetailsNoAppend({ id: tvId, sn }), fetchOptions()),
      fetch(apiEndpoints.language, fetchOptions()),
      fetch(apiEndpoints.tv.tvSeasonEpisodeImages({ id: tvId, sn, ep: episode }), fetchOptions()),
      fetch(apiEndpoints.tv.tvSeasonEpisodeVideos({ id: tvId, sn, ep: episode }), fetchOptions())
    ]);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to fetch list details: ${response.status} - ${errorDetails}`);
    }

    const [res, tvData, seasonData, languages, imageDatas, videoDatas] = await Promise.all([
      response.json(),
      tvRes.json(),
      seasonRes.json(),
      languagesRes.json(),
      imagesRes.json(),
      videosRes.json()
    ]);

    if (!tvData) throw new Error("List not found");

    const expectedUrl = getCleanTitle(tvData?.id, tvData?.name);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/tv/${expectedUrl}/season/${sn}/episode/${episode}`,
          permanent: false,
        },
      };
    }

    // Function to map iso_639_1 values
    function mapLanguage(iso) {
      const language = languages.find(lang => lang.iso_639_1 === iso);
      return language ? language : { "iso_639_1": "null", "english_name": "No Language", "name": "No Language" };
    }

    // Convert the data
    const images = {
      backdrops: imageDatas?.stills.map(still => ({
        ...still,
        iso_639_1: mapLanguage(still.iso_639_1)
      }))
    };

    // Convert the data
    const videos = {
      ...videoDatas,
      results: videoDatas?.results.map(result => ({
        ...result,
        iso_639_1: mapLanguage(result.iso_639_1)
      }))
    };

    return {
      props: {
        error: false,
        releaseDate: res?.air_date,
        overview: res?.overview,
        credits: res?.credits,
        images: images,
        videos: videos?.results || [],
        seasonNumber: res?.season_number,
        episodeNumber: res?.episode_number,
        episodeName: res?.name,
        rating: res?.vote_average,
        backdrop: res?.still_path,
        runtime: res?.runtime,
        tvData: {
          id: ctx.query.id,
          name: tvData?.name,
          airDate: tvData?.first_air_date
        },
        tvData2: tvData,
        seasonData: seasonData
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

export default Episode;
