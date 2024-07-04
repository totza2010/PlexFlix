import { useModal } from "components/Modal/Modal";
import {
  Span,
  Gradient,
  HeroInfoTitle,
  HeroInfoWrapper
} from "components/MovieInfo/MovieDetailsStyles";
import NextPrev from "components/NextPrev/NextPrev";
import { RatingOverlay } from "components/ProfilePage/ProfilePageStyles";
import RatingModal from "components/RatingModal/RatingModal";
import SocialMediaLinks from "components/SocialMediaLinks/SocialMediaLinks";
import Toast, { useToast } from "components/Toast/Toast";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import {
  getRating,
  getReleaseYear,
  getReleaseDate,
  getRuntime,
  getCleanTitle
} from "src/utils/helper";
import { useMediaContext } from "Store/MediaContext";
import { useUserContext } from "Store/UserContext";
import {
  SeasonCommonOverview,
  TrWrapper,
  Pill,
  DetailsHeroWrap2,
  HeroDetailsContainer,
  HeroImg2,
  HeroImgWrapper2
} from "styles/GlobalComponents";

const EpisodeDetails = ({ episodeNumber, backdrop, episodeName, releaseDate, rating, runtime, overview, tvData, seasonData }) => {
  const expectedUrl = getCleanTitle(tvData?.id, tvData?.name);
  const { userInfo } = useUserContext();
  const { ratedTvShowsEpisode } = useMediaContext();
  const { isToastVisible, showToast, toastMessage } = useToast();
  const ShowId = tvData?.id;
  const savedRating = ratedTvShowsEpisode?.find(item => item?.show_id === ShowId && item?.season_number === seasonData?.season_number && item?.episode_number === episodeNumber)?.rating || false;
  const { isModalVisible, openModal, closeModal } = useModal();

  const ratingModalHandler = () => {
    if (userInfo?.accountId) {
      openModal();
    } else {
      showToast({ message: "Please login first to use this feature" });
    }
  };
  console.log(tvData)
  return (
    <Fragment>
      <HeroDetailsContainer className='relative mb-auto'>
        <NextPrev tvData={tvData} seasonData={seasonData} now={episodeNumber} />
        <DetailsHeroWrap2 className="!min-h-7">
          <HeroImgWrapper2>
            <HeroImg2 className='relative text-center'>
              <Image
                src={
                  backdrop
                    ? `https://image.tmdb.org/t/p/w500${backdrop}`
                    : "/Images/DefaultImage.png"
                }
                alt='TV-season-poster'
                fill
                style={{ objectFit: "cover" }}
                placeholder='blur'
                blurDataURL={blurPlaceholder}
              />
            </HeroImg2>
          </HeroImgWrapper2>

          <Gradient />

          <HeroInfoWrapper className='max-w-5xl'>
            <HeroInfoTitle className='mb-2'>
              <Link passHref href={`/tv/${expectedUrl}`}>
                {tvData?.name} ({getReleaseYear(tvData?.first_air_date)})
              </Link>
            </HeroInfoTitle>
            <div>

              <TrWrapper className='flex-wrap -mt-2 !gap-2'>
                <Link passHref href={`/tv/${expectedUrl}/season/${seasonData?.season_number}`}>
                  <h4 className='font-semibold text-[1.25rem]'>{seasonData?.name}</h4>
                </Link>
                <svg
                  className='w-[0.65rem] md:w-3 aspect-square text-gray-400'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 6 10'>
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 9 4-4-4-4'
                  />
                </svg>
                <h4 className='font-semibold text-[1.25rem]'>{episodeName}</h4>

                <SocialMediaLinks
                  links={{}}
                  homepage={null}
                  mediaDetails={{
                    title: episodeName,
                    description: overview
                  }}
                  className='!justify-start'
                />
              </TrWrapper>

              <TrWrapper className='flex-wrap mt-2'>
                <h3 className='text-[1.25rem] m-0 font-semibold'>
                  {getReleaseDate(releaseDate)}
                </h3>

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

                <h3 className='font-semibold text-[1.25rem]'>{getRuntime(runtime)}</h3>
              </TrWrapper>

              {overview && <SeasonCommonOverview>{overview}</SeasonCommonOverview>}
            </div>
          </HeroInfoWrapper>
        </DetailsHeroWrap2>
      </HeroDetailsContainer>

      <Toast isToastVisible={isToastVisible}>
        <Span className='movieCastHead'>{toastMessage}</Span>
      </Toast>

      <RatingModal
        mediaType='tv/episodes'
        mediaId={ShowId}
        SeasonNumber={seasonData?.season_number}
        EpisodeNumber={episodeNumber}
        posterPath={backdrop}
        title={episodeName}
        releaseDate={releaseDate}
        isOpen={isModalVisible}
        closeModal={closeModal}
        mediaName={`${tvData?.name} (${tvData?.first_air_date}) Season ${seasonData?.season_number} Episode ${episodeNumber}`}
      />
    </Fragment>
  );
};

export default EpisodeDetails;
