import { Span } from "components/MovieInfo/MovieDetailsStyles";
import { RatingOverlay } from "components/ProfilePage/ProfilePageStyles";
import RatingModal from "components/RatingModal/RatingModal";
import Toast, { useToast } from "components/Toast/Toast";
import { SeasonsRelease } from "components/TVInfo/TVStyles";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import { BsStarHalf } from "react-icons/bs";
import {
  getRating,
  getReleaseDate,
  getRuntime 
} from "src/utils/helper";
import { useMediaContext } from "Store/MediaContext";
import { useUserContext } from "Store/UserContext";

import {
  EpisodeImg,
  SeasonCommonOverview,
  SeasonEpisodesWrapper,
  SeasonShowcaseWrapper,
  TrWrapper,
  Pill,
} from "styles/GlobalComponents";

const SeasonEpisodes = ({ episodes, ShowId, ShowName, seasonNumber }) => {
  const router = useRouter();
  const routeRef = useRef(router.asPath);
  const { userInfo } = useUserContext();
  const { ratedTvShowsEpisode } = useMediaContext();
  const { isToastVisible, showToast, toastMessage } = useToast();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [episodeNumber, setEpisodeNumber] = useState(null);
  const [episodeName, setEpisodeName] = useState(null);
  const [backdrop, setBackdrop] = useState(null);
  const [airDateEp, setReleaseDate] = useState(null);

  const ratingModalHandler = (episodeNumber, episodeName, backdrop, airDateEp) => {
    setEpisodeNumber(episodeNumber);
    setEpisodeName(episodeName);
    setBackdrop(backdrop);
    setReleaseDate(airDateEp);

    if (userInfo?.accountId) {
      setIsModalVisible(true);
    } else {
      showToast({ message: 'Please login first to use this feature' });
    }
  };

  return (
    <Fragment>
      {episodes?.length > 0 && (
        <SeasonEpisodesWrapper>

          {episodes?.map((item, i) => (
            <SeasonShowcaseWrapper key={item.id} className='episodesBox'>
              <EpisodeImg className='relative text-center'>
                <Image
                  src={
                    item.still_path
                      ? `https://image.tmdb.org/t/p/w300${item.still_path}`
                      : "/Images/DefaultBackdrop.png"
                  }
                  alt='TV-season-episode-poster'
                  fill
                  style={{ objectFit: "cover" }}
                  placeholder='blur'
                  blurDataURL={blurPlaceholder}
                />
              </EpisodeImg>

              <div className='self-start'>
                <h3 className='text-[calc(1.325rem_+_.9vw)] lg:text-[2rem] leading-8 font-bold'>
                  {item.episode_number || i + 1}. {item.name}
                </h3>

                <TrWrapper className='flex-wrap'>
                  <SeasonsRelease className='text-alt'>
                    {getReleaseDate(item.air_date)}
                  </SeasonsRelease>
                  <Pill>
                    <p>{getRating(item.vote_average)}</p>
                  </Pill>

                  <Pill>
                    {ratedTvShowsEpisode?.find(rate => rate?.show_id === ShowId && rate?.season_number === seasonNumber && rate?.episode_number === item.episode_number)?.rating || false ? (
                      <RatingOverlay className='media-page cursor-pointer' onClick={() =>
                        ratingModalHandler(
                          item.episode_number,
                          item.name,
                          item.still_path,
                          getReleaseDate(item.air_date)
                        )} >
                        <AiFillStar size='16px' />
                        <p className='m-0 font-semibold leading-tight'>{ratedTvShowsEpisode?.find(rate => rate?.show_id === ShowId && rate?.season_number === seasonNumber && rate?.episode_number === item.episode_number)?.rating || false}</p>
                      </RatingOverlay>
                    ) : (
                      <BsStarHalf size='20px' className="cursor-pointer" onClick={() =>
                        ratingModalHandler(
                          item.episode_number,
                          item.name,
                          item.still_path,
                          getReleaseDate(item.air_date)
                        )} />
                    )}
                  </Pill>

                  <Span className='font-semibold text-lg'>{getRuntime(item.runtime)}</Span>

                  {new Date(getReleaseDate(item.air_date)) < new Date() ? (
                    <Link href={`${routeRef.current}/episode/${item.episode_number}`}>
                      <Pill className='info text-[15px]'>
                        Episode Details
                        <BiChevronRight size='22' />
                      </Pill>
                    </Link>
                  ) : null}
                </TrWrapper>

                {item?.overview ? (
                  <SeasonCommonOverview className='clamp'>
                    {item.overview}
                  </SeasonCommonOverview>
                ) : null}
              </div>
            </SeasonShowcaseWrapper>
          ))}
        </SeasonEpisodesWrapper>
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
        releaseDate={airDateEp}
        isOpen={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        mediaName={`${ShowName} (${airDateEp}) Season ${seasonNumber} Episode ${episodeNumber}`}
      />
    </Fragment>
  );
};

export default SeasonEpisodes;
