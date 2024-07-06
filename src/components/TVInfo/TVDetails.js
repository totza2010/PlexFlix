import { setFavorite, addToWatchlist } from "api/user";
import DominantColor from "components/DominantColor/DominantColor";
import AddToListModal from "components/List/AddToListModal";
import Modal from "components/Modal/Modal";
import KeywordList from "components/MovieInfo/KeywordList";
import {
  Credits,
  CreditsWrapper,
  GenreWrap,
  Gradient,
  HeroInfoTitle,
  HeroInfoWrapper,
  Overview,
  RatingWrapper,
  Rounded,
  RtoR,
  Span,
  Tagline,
  SeeMore
} from "components/MovieInfo/MovieDetailsStyles";
import { RatingOverlay } from "components/ProfilePage/ProfilePageStyles";
import RatingModal from "components/RatingModal/RatingModal";
import SocialMediaLinks from "components/SocialMediaLinks/SocialMediaLinks";
import TechnicalDetails from "components/TechnicalDetails/TechnicalDetails";
import Toast, { useToast } from "components/Toast/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BiListPlus, BiListCheck } from "react-icons/bi";
import { BsChevronRight, BsStarHalf } from "react-icons/bs";
import { FaYoutube, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { framerTabVariants, getCleanTitle, getRating, getReleaseYear } from "src/utils/helper";
import { useMediaContext } from "Store/MediaContext";
import { useUserContext } from "Store/UserContext";
import {
  Button,
  DetailsHeroWrap,
  HeroBg,
  HeroBgContainer,
  HeroDetailsContainer,
  HeroImg,
  HeroImgWrapper
} from "styles/GlobalComponents";
import TVSeasons from "./TVSeasons";

const TVDetails = ({
  tvData: {
    id,
    title,
    adult,
    airDate,
    overview,
    backdropPath,
    posterPath,
    socialIds,
    rating,
    genres,
    tagline,
    trailerLink,
    homepage,
    crewData,
    releaseYear,
    technicalDetails
  },
  seasons,
  keywords
}) => {
  const { userInfo } = useUserContext();
  const {
    favoriteTvShows,
    tvShowsWatchlist,
    validateFavoriteTvShows,
    validateTvWatchlist,
    ratedTvShows
  } = useMediaContext();
  const { isToastVisible, showToast, toastMessage } = useToast();
  const savedRating = ratedTvShows?.find((item) => item?.id === id)?.rating ?? false;

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);

  const [actionType, setActionType] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);

  // splice genres
  genres.length > 3 && genres.splice(3);

  const isAddedToFavorites = favoriteTvShows?.map((item) => item.id)?.includes(id);
  const isAddedToWatchlist = tvShowsWatchlist?.map((item) => item.id)?.includes(id);

  const openConfirmationModal = () => setIsConfirmationModalVisible(true);
  const closeConfirmationModal = () => setIsConfirmationModalVisible(false);
  const openRatingModal = () => setIsRatingModalVisible(true);
  const closeRatingModal = () => setIsRatingModalVisible(false);

  const favoriteHandler = async () => {
    if (userInfo?.accountId) {
      if (isAddedToFavorites) {
        setActionType('unfavorite');
        setItemToRemove({ name: title, release_date: airDate });
        openConfirmationModal();
        return;
      }
      const response = await setFavorite({
        mediaType: "tv",
        mediaId: id,
        favoriteState: !isAddedToFavorites,
      });

      if (response?.success) {
        if (isAddedToFavorites) {
          validateFavoriteTvShows({
            state: "removed",
            id,
          });
        } else {
          const updatedMedia = [...favoriteTvShows];

          updatedMedia.unshift({
            id,
            title,
            poster_path: posterPath,
            release_date: airDate,
          });

          validateFavoriteTvShows({
            state: "added",
            id,
            media: updatedMedia,
          });
        }

        showToast({
          message: isAddedToFavorites
            ? "Removed from favorites"
            : "Added to favorites",
        });
      } else {
        showToast({ message: "Something went wrong, try again later" });
      }
    } else if (!isToastVisible) {
      showToast({ message: "Please login first to use this feature" });
    }
  };

  const watchlistHandler = async () => {
    if (userInfo?.accountId) {
      if (isAddedToWatchlist) {
        setActionType('unwatchlist');
        setItemToRemove({ name: title, release_date: airDate });
        openConfirmationModal();
        return;
      }
      const response = await addToWatchlist({
        mediaType: "tv",
        mediaId: id,
        watchlistState: !isAddedToWatchlist,
      });

      if (response?.success) {
        if (isAddedToWatchlist) {
          validateTvWatchlist({
            state: "removed",
            id,
          });
        } else {
          const updatedMedia = [...tvShowsWatchlist];

          updatedMedia.unshift({
            id,
            title,
            poster_path: posterPath,
            release_date: airDate,
          });

          validateTvWatchlist({
            state: "added",
            id,
            media: updatedMedia,
          });
        }
        showToast({
          message: isAddedToWatchlist
            ? "Removed from watchlist"
            : "Added to watchlist",
        });
      } else {
        showToast({ message: "Something went wrong, try again later" });
      }
    } else if (!isToastVisible) {
      showToast({ message: "Please login first to use this feature" });
    }
  };

  const confirmRemoveHandler = async () => {
    if (actionType === 'unwatchlist') {
      const response = await addToWatchlist({
        mediaType: "tv",
        mediaId: id,
        watchlistState: false,
      });

      if (response?.success) {
        validateTvWatchlist({ state: "removed", id });
        showToast({ message: "Removed from watchlist" });
      } else {
        showToast({ message: "Something went wrong, try again later" });
      }
    } else if (actionType === 'unfavorite') {
      const response = await setFavorite({
        mediaType: "tv",
        mediaId: id,
        favoriteState: false,
      });

      if (response?.success) {
        validateFavoriteTvShows({ state: "removed", id });
        showToast({ message: "Removed from favorites" });
      } else {
        showToast({ message: "Something went wrong, try again later" });
      }
    }
    closeConfirmationModal();
  };

  const ratingModalHandler = () => {
    if (userInfo?.accountId) {
      openRatingModal();
    } else {
      showToast({ message: "Please login first to use this feature" });
    }
  };

  return (
    <Fragment>

      {/* Modal for confirming removal */}
      <Modal closeModal={closeConfirmationModal} isOpen={isConfirmationModalVisible} align='items-center' width='max-w-lg'>
        <div>
          <h4 className='text-2xl mb-4 font-semibold'>Confirm Action</h4>
          <p className='text-lg'>
            Are you sure you want to {actionType === 'unwatchlist' ? 'remove from watchlist' : 'remove from favorites'} <span className='font-bold'>{`${itemToRemove?.name} (${getReleaseYear(itemToRemove?.release_date)})`}</span>?
          </p>

          <div className='mt-6 flex gap-3'>
            <Button
              as={motion.button}
              whileTap={{ scale: 0.95 }}
              className='w-full secondary'
              onClick={closeConfirmationModal}
              type='button'>
              Close
            </Button>
            <Button
              as={motion.button}
              whileTap={{ scale: 0.95 }}
              className='w-full danger'
              onClick={confirmRemoveHandler}
              type='button'>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      <HeroDetailsContainer className='relative mb-auto'>
        <HeroBgContainer className='absolute'>
          <HeroBg className='absolute text-center'>
            <Image
              src={
                backdropPath
                  ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
                  : "/Images/Hex.webp"
              }
              alt='tv-backdrop'
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </HeroBg>
          <DominantColor image={posterPath} />
        </HeroBgContainer>
        <DetailsHeroWrap>
          <HeroImgWrapper>
            <HeroImg className='relative text-center'>
              <Image
                src={
                  posterPath
                    ? `https://image.tmdb.org/t/p/w500${posterPath}`
                    : "/Images/DefaultImage.png"
                }
                alt='tv-poster'
                fill
                style={{ objectFit: "cover" }}
                priority
                placeholder='blur'
                blurDataURL={blurPlaceholder}
              />
            </HeroImg>

            <div className='w-full'>
              {trailerLink && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailerLink}`}
                  target='_blank'
                  rel='noreferrer'
                  aria-label='watch trailer'
                  className='block mb-3'>
                  <Button className='w-full gap-3' as={motion.button} whileTap={{ scale: 0.95 }}>
                    <FaYoutube size='1.5rem' />
                    <Span className='font-semibold'>Watch Trailer</Span>
                  </Button>
                </a>
              )}

              <TechnicalDetails data={technicalDetails} />

              <div className='mb-3'>
                <AddToListModal mediaType='tv' mediaId={id} />
              </div>

              <div className='flex justify-start gap-3'>
                <Button
                  className='mediaCTA w-full'
                  loading={+isToastVisible}
                  aria-label='watchlist button'
                  as={motion.button}
                  whileTap={{ scale: 0.95 }}
                  onClick={watchlistHandler}>
                  <AnimatePresence mode='wait' initial={false}>
                    <motion.div
                      key={`watchlist - ${isAddedToWatchlist.toString()}`}
                      variants={framerTabVariants}
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                      transition={{ duration: 0.5 }}>
                      {isAddedToWatchlist ? (
                        <BiListCheck size='22px' />
                      ) : (
                        <BiListPlus size='22px' />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>

                <Button
                  className='mediaCTA w-full'
                  loading={+isToastVisible}
                  aria-label='favorite button'
                  onClick={favoriteHandler}
                  as={motion.button}
                  whileTap={{ scale: 0.95 }}>
                  <AnimatePresence mode='wait' initial={false}>
                    <motion.div
                      key={`favorite - ${isAddedToFavorites.toString()}`}
                      variants={framerTabVariants}
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                      transition={{ duration: 0.5 }}>
                      {isAddedToFavorites ? <FaHeart size='20px' /> : <FaRegHeart size='20px' />}
                    </motion.div>
                  </AnimatePresence>
                </Button>

                <Button
                  className='mediaCTA w-full'
                  loading={+isToastVisible}
                  aria-label='rating button'
                  as={motion.button}
                  whileTap={{ scale: 0.95 }}
                  onClick={ratingModalHandler}>
                  <AnimatePresence mode='wait' initial={false}>
                    <motion.div
                      key={`rating - ${savedRating.toString()}`}
                      variants={framerTabVariants}
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                      transition={{ duration: 0.5 }}>
                      {savedRating ? (
                        <RatingOverlay className='media-page'>
                          <AiFillStar size='16px' />
                          <p className='m-0 font-semibold leading-tight'>{savedRating}</p>
                        </RatingOverlay>
                      ) : (
                        <BsStarHalf size='20px' />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>

                <Link href={`/tv/${getCleanTitle(id, title)}/lists`} className="w-full mediaCTA">
                  <Button as={motion.button} whileTap={{ scale: 0.95 }}>
                    <MdOutlineFormatListBulleted size="20px" />
                  </Button>
                </Link>
              </div>
            </div>
            <SocialMediaLinks
              links={socialIds}
              homepage={homepage}
              mediaDetails={{
                title,
                description: overview
              }}
            />
          </HeroImgWrapper>

          <Gradient />

          <HeroInfoWrapper className='max-w-5xl'>
            <HeroInfoTitle className='mb-2'>
              {title} ({releaseYear})
            </HeroInfoTitle>

            <RtoR className='my-4'>
              {genres.length > 0 ? (
                <GenreWrap className='font-bold'>
                  {genres.map((item, i) => (
                    <Link
                      key={item.id}
                      href={`/genre/${getCleanTitle(item.id, item.name)}/tv`}
                      passHref
                      scroll={false}>
                      <Rounded className={genres.length == i + 1 && "sep"}>{item.name}</Rounded>
                    </Link>
                  ))}
                </GenreWrap>
              ) : null}
            </RtoR>

            {tagline ? (
              <i>
                <Tagline className="my-4 block gap-4">
                  {adult && <Rounded>Adult</Rounded>}
                  <KeywordList keywords={keywords?.results} />
                  {tagline && tagline}
                </Tagline>
              </i>
            ) : null}
            {overview ? <Overview className='font-normal'>{overview}</Overview> : null}
            {rating ? (
              <RatingWrapper>
                <Fragment>
                  <Span className='text-[calc(1.525rem_+_3.3vw)] xl:text-6xl font-bold'>
                    {getRating(rating)}
                  </Span>
                  <span> / 10</span>
                </Fragment>
              </RatingWrapper>
            ) : null}

            {crewData.length > 0 && (
              <CreditsWrapper>
                {crewData.map((item) => (
                  <Credits key={item.credit_id}>
                    <Span className='block font-normal'>{item.job ?? "Creator"}</Span>
                    <Link href={`/person/${getCleanTitle(item.id, item.name)}`}>
                      <Span className='block font-bold credit'>{item.name}</Span>
                    </Link>
                  </Credits>
                ))}
                <Link href={`/tv/${getCleanTitle(id, title)}/crew`}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.1 },
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-auto"
                    aria-label="full cast"
                  >
                    <SeeMore>
                      <BsChevronRight size="22" />
                    </SeeMore>
                    <Span className="mt-1 font-bold movieCastHead block">
                      Full Crew
                    </Span>
                  </motion.div>
                </Link>
              </CreditsWrapper>
            )}
          </HeroInfoWrapper>
        </DetailsHeroWrap>
        <TVSeasons seasons={seasons} />
      </HeroDetailsContainer>

      <Toast isToastVisible={isToastVisible}>
        <Span className='movieCastHead'>{toastMessage}</Span>
      </Toast>

      <RatingModal
        mediaType='tv'
        mediaId={id}
        posterPath={posterPath}
        title={title}
        releaseDate={airDate}
        isOpen={isRatingModalVisible}
        closeModal={closeRatingModal}
        mediaName={`${title} (${releaseYear})`}
      />
    </Fragment>
  );
};

export default TVDetails;
