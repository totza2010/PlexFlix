import Backdrops from "components/Backdrops/Backdrops";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs";
import { CastGrid, CastImg, CastWrapper } from "components/Cast/CastStyles";
import DominantColor from "components/DominantColor/DominantColor";
import MetaWrapper from "components/MetaWrapper";
import { useModal } from "components/Modal/Modal";
import { Span } from "components/MovieInfo/MovieDetailsStyles";
import { RatingOverlay } from "components/ProfilePage/ProfilePageStyles";
import RatingModal from "components/RatingModal/RatingModal";
import SocialMediaLinks from "components/SocialMediaLinks/SocialMediaLinks";
import Toast, { useToast } from "components/Toast/Toast";
import { SeasonsRelease } from "components/TVInfo/TVStyles";

import { motion } from "framer-motion";
import { apiEndpoints, blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import {
  fetchOptions,
  getCleanTitle,
  getRating,
  getReleaseDate,
  getReleaseYear,
  getRuntime
} from "src/utils/helper";
import { useMediaContext } from "Store/MediaContext";
import { useUserContext } from "Store/UserContext";
import {
  EpisodeInfoWrapper,
  EpisodeShowCaseWrapper,
  Error404,
  ModulesWrapper,
  Pill,
  SeasonCommonOverview,
  TrWrapper
} from "styles/GlobalComponents";

const Episode = ({
  error,
  releaseDate,
  overview,
  cast,
  seasonNumber,
  episodeNumber,
  rating,
  backdrop,
  episodeName,
  runtime,
  posters,
  tvData: { id, name, airDate }
}) => {
  const { userInfo } = useUserContext();
  const { ratedTvShowsEpisode } = useMediaContext();
  const { isToastVisible, showToast, toastMessage } = useToast();
  const ShowId = parseInt(id.split("-")[0]);
  const savedRating = ratedTvShowsEpisode?.find(item => item?.show_id === ShowId && item?.season_number === seasonNumber && item?.episode_number === episodeNumber)?.rating || false;
  const { isModalVisible, openModal, closeModal } = useModal();

  const ratingModalHandler = () => {
    if (userInfo?.accountId) {
      openModal();
    } else {
      showToast({ message: "Please login first to use this feature" });
    }
  };
  const links = [
    {
      href: `/tv/${id}`,
      label: "TV Show Details"
    },
    {
      href: `/tv/${id}/season/${seasonNumber}`,
      label: `Season ${seasonNumber}`
    },
    {
      href: "#",
      label: `${episodeName} (S${seasonNumber}E${episodeNumber})`
    }
  ];

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
          <div className='relative mb-auto'>
            <DominantColor image={backdrop} tint isUsingBackdrop flip />

            <EpisodeInfoWrapper className='relative z-10'>
              <Breadcrumbs links={links} />

              <h3 className='text-[calc(1.325rem_+_.9vw)] lg:text-[2rem] font-bold mb-4 pb-2'>
                {name} ({getReleaseYear(releaseDate)})
              </h3>

              <EpisodeShowCaseWrapper>
                <div className='image-wrapper'>
                  <Image
                    src={
                      backdrop
                        ? `https://image.tmdb.org/t/p/w500${backdrop}`
                        : "/Images/DefaultBackdrop.png"
                    }
                    alt='episde-backdrop'
                    fill
                    style={{ objectFit: "cover" }}
                    placeholder='blur'
                    blurDataURL={blurPlaceholder}
                  />
                </div>

                <div>
                  <h3 className='text-[calc(1.325rem_+_.9vw)] lg:text-[2rem] leading-8 m-0 font-bold'>
                    {episodeName} ({`S${seasonNumber}E${episodeNumber}`})
                  </h3>

                  <TrWrapper>
                    <SeasonsRelease className='text-alt'>
                      {getReleaseDate(releaseDate)}
                    </SeasonsRelease>

                    <Pill>
                      <p>{getRating(rating)}</p>
                    </Pill>

                    <Pill>
                      {savedRating ? (
                        <RatingOverlay loading={+isToastVisible} className='media-page cursor-pointer' onClick={ratingModalHandler} >
                          <AiFillStar size='16px' />
                          <p className='m-0 font-semibold leading-tight'>{savedRating}</p>
                        </RatingOverlay>
                      ) : (
                        <BsStarHalf size='20px' loading={+isToastVisible} className="cursor-pointer" onClick={ratingModalHandler} />
                      )}
                    </Pill>

                    <Span className='font-semibold text-lg'>{getRuntime(runtime)}</Span>
                  </TrWrapper>

                  <SocialMediaLinks
                    links={{}}
                    homepage={null}
                    mediaDetails={{
                      title: name,
                      description: overview
                    }}
                    className='!justify-start'
                  />

                  {overview ? <SeasonCommonOverview>{overview}</SeasonCommonOverview> : null}
                </div>
              </EpisodeShowCaseWrapper>
            </EpisodeInfoWrapper>

            {cast?.length > 0 ? (
              <ModulesWrapper className='relative z-10'>
                <span className='text-[calc(1.325rem_+_.9vw)] lg:text-[2rem] leading-8 mt-8 mb-6 font-bold block'>
                  Cast ({cast?.length})
                </span>

                <CastGrid className='justify-start'>
                  {cast.map((item) => (
                    <CastWrapper key={item.name}>
                      <Link href={`/person/${getCleanTitle(item.id, item.name)}`} passHref>
                        <motion.div
                          whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.1 }
                          }}
                          whileTap={{ scale: 0.95 }}>
                          <CastImg className='relative text-center'>
                            <Image
                              src={
                                item?.profile_path
                                  ? `https://image.tmdb.org/t/p/w276_and_h350_face${item.profile_path}`
                                  : "/Images/DefaultAvatar.png"
                              }
                              alt='cast-image'
                              fill
                              style={{ objectFit: "cover", objectPosition: "top" }}
                              placeholder='blur'
                              blurDataURL={blurPlaceholder}
                            />
                          </CastImg>
                        </motion.div>
                      </Link>

                      <div className='mt-3'>
                        <Span className='font-bold movieCastHead line-clamp-2'>
                          {item?.character}
                        </Span>
                        <Span className='movieCastName block'>{item?.name}</Span>
                      </div>
                    </CastWrapper>
                  ))}
                </CastGrid>
              </ModulesWrapper>
            ) : null}
          </div>

          {posters?.length > 0 ? (
            <Fragment>
              <ModulesWrapper>
                <span className='text-[calc(1.325rem_+_.9vw)] lg:text-[2rem] leading-8 mt-12 mb-6 font-bold block'>
                  Backdrops ({posters.length})
                </span>
                <Backdrops backdrops={posters} />
              </ModulesWrapper>
            </Fragment>
          ) : null}
        </Fragment>
      )}

      <Toast isToastVisible={isToastVisible}>
        <Span className='movieCastHead'>{toastMessage}</Span>
      </Toast>

      <RatingModal
        mediaType='tv/episodes'
        mediaId={ShowId}
        SeasonNumber={seasonNumber}
        EpisodeNumber={episodeNumber}
        posterPath={backdrop}
        title={episodeName}
        releaseDate={releaseDate}
        isOpen={isModalVisible}
        closeModal={closeModal}
        mediaName={`${name} (${airDate}) Season ${seasonNumber} Episode ${episodeNumber}`}
      />
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id, sn, episode } = ctx.query;
    const tvId = id.split("-")[0];

    const [response, tvRes] = await Promise.all([
      fetch(
        apiEndpoints.tv.episodeDetails({
          id: tvId,
          seasonNumber: sn,
          episodeNumber: episode
        }), fetchOptions()
      ),
      fetch(apiEndpoints.tv.tvDetailsNoAppend(tvId), fetchOptions())
    ]);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to fetch list details: ${response.status} - ${errorDetails}`);
    }

    const [res, tvData] = await Promise.all([
      response.json(),
      tvRes.json()
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

    const { cast, guest_stars } = res?.credits;

    return {
      props: {
        error: false,
        releaseDate: res?.air_date,
        overview: res?.overview,
        cast: cast.concat(guest_stars) || [],
        seasonNumber: res?.season_number,
        episodeNumber: res?.episode_number,
        episodeName: res?.name,
        rating: res?.vote_average,
        backdrop: res?.still_path,
        runtime: res?.runtime,
        posters: res?.images?.stills,
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

export default Episode;
