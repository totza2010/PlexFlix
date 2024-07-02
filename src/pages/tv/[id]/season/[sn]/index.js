import DominantColor from "components/DominantColor/DominantColor";
import MetaWrapper from "components/MetaWrapper";
import SeasonDetails from "components/SeasonsInfo/SeasonDetails";
import SeasonTab from "components/SeasonsInfo/SeasonTab";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import {
  getReleaseYear,
  mergeEpisodeCount,
  getCleanTitle,
  fetchOptions
} from "src/utils/helper";

import {
  Error404
} from "styles/GlobalComponents";

const Seasons = ({
  error,
  releaseDate,
  overview,
  credits,
  images,
  videos,
  rating,
  episodes,
  seasonNumber,
  seasonName,
  seasonPoster,
  tvData: { id, name, airDate }
}) => {
  const ShowId = parseInt(id.split("-")[0]);
  const links = [
    {
      href: `/tv/${id}`,
      label: `${name} (${getReleaseYear(airDate)})`
    },
    {
      href: "#",
      label: `${seasonName} (${getReleaseYear(releaseDate)})`
    }
  ];

  const totalRuntime = episodes?.reduce((acc, item) => acc + item.runtime, 0);
  return (
    <Fragment>
      <MetaWrapper
        title={
          error
            ? "Not Found - PlexFlix"
            : `${name}: ${seasonName} (${getReleaseYear(releaseDate)}) - PlexFlix`
        }
        description={overview}
        image={`https://image.tmdb.org/t/p/w780${seasonPoster}`}
        url={`${process.env.BUILD_URL}/tv/${id}/season/${seasonNumber}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <Fragment>
          <DominantColor image={seasonPoster} tint flip />

          <SeasonDetails
            seasonPoster={seasonPoster}
            seasonName={seasonName}
            releaseDate={releaseDate}
            rating={rating}
            totalRuntime={totalRuntime}
            overview={overview}
            links={links}
          />

          <SeasonTab credits={credits} images={images} videos={videos} episodes={episodes} ShowId={ShowId} ShowName={name} seasonNumber={seasonNumber} />

        </Fragment>
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id, sn } = ctx.query;
    const tvId = id.split("-")[0];

    const [response, tvRes, languagesRes, imagesRes, videosRes] = await Promise.all([
      fetch(apiEndpoints.tv.tvSeasonDetails({ id: tvId, seasonNumber: sn }),
        fetchOptions()),
      fetch(apiEndpoints.tv.tvDetailsNoAppend(tvId), fetchOptions()),
      fetch(apiEndpoints.language, fetchOptions()),
      fetch(apiEndpoints.tv.tvSeasonImages({ id: tvId, sn }), fetchOptions()),
      fetch(apiEndpoints.tv.tvSeasonVideos({ id: tvId, sn }), fetchOptions())
    ]);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to fetch list details: ${response.status} - ${errorDetails}`);
    }

    const [res, tvData, languages, imageDatas, videoDatas] = await Promise.all([
      response.json(),
      tvRes.json(),
      languagesRes.json(),
      imagesRes.json(),
      videosRes.json()
    ]);

    if (!tvData) throw new Error("List not found");

    const expectedUrl = getCleanTitle(tvData?.id, tvData?.name);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/tv/${expectedUrl}/season/${sn}`,
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
      ...imageDatas,
      posters: imageDatas?.posters.map(poster => ({
        ...poster,
        iso_639_1: mapLanguage(poster.iso_639_1)
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

    const formattedCredits = (credits) =>
      mergeEpisodeCount(
        credits?.map(({ roles, jobs, ...rest }) =>
          (roles || jobs).map((roleOrJob) => ({ ...rest, ...roleOrJob }))
        ).flat()
      );

    return {
      props: {
        error: false,
        releaseDate: res?.air_date,
        overview: res?.overview,
        credits: {
          cast: formattedCredits(res.aggregate_credits?.cast),
          crew: formattedCredits(res.aggregate_credits?.crew),
        },
        images: images,
        videos: videos?.results || [],
        seasonPoster: res?.poster_path,
        seasonName: res?.name,
        seasonNumber: res?.season_number,
        rating: res?.vote_average,
        episodes: res?.episodes,
        tvData: {
          id: ctx.query.id,
          name: tvData?.name,
          airDate: tvData?.first_air_date
        }
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

export default Seasons;
