import { addToWatchlist, setFavorite } from "api/user";
import DominantColor from "components/DominantColor/DominantColor";
import AddToListModal from "components/List/AddToListModal";
import Modal from "components/Modal/Modal";
import KeywordList from "components/MovieInfo/KeywordList";
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
import { BsStarHalf } from "react-icons/bs";
import { FaYoutube, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import {
  framerTabVariants,
  getCleanTitle,
  getRating,
  getRuntime,
  getReleaseYear
} from "src/utils/helper";
import { useMediaContext } from "Store/MediaContext";
import { useUserContext } from "Store/UserContext";
import {
  Button,
  DetailsHeroWrap,
  HeroBg,
  HeroBgContainer,
  HeroDetailsContainer,
  HeroImg,
  HeroImgWrapper,
} from "styles/GlobalComponents";
import MovieCollection from "./MovieCollection";
import {
  Divider,
  Rounded,
  GenreWrap,
  HeroInfoWrapper,
  RatingWrapper,
  HeroInfoTitle,
  RtoR,
  Span,
  CreditsWrapper,
  CollectionWrapper,
  Credits,
  Tagline,
  ReleaseDateWrapper,
  Overview,
  Light,
  EasterText,
  LightsInOut,
  Gradient,
  MovieEaster
} from "./MovieDetailsStyles";

const MovieDetails = ({
  movieDetails: {
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
    homepage,
    technicalDetails
  },
  easter,
  keywords
}) => {
  const { userInfo } = useUserContext();
  const { renderEaster, hasSeen, showEaster, easterHandler } = easter;
  const {
    favoriteMovies,
    moviesWatchlist,
    validateMoviesWatchlist,
    validateFavoriteMovies,
    ratedMovies,
  } = useMediaContext();
  const { isToastVisible, showToast, toastMessage } = useToast();
  const savedRating =
    ratedMovies?.find((item) => item?.id === id)?.rating ?? false;

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);

  const [actionType, setActionType] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);

  // splice genres
  genres.length > 3 && genres.splice(3);

  const isAddedToWatchlist = moviesWatchlist
    ?.map((item) => item.id)
    ?.includes(id);
  const isAddedToFavorites = favoriteMovies
    ?.map((item) => item.id)
    ?.includes(id);

  const openConfirmationModal = () => setIsConfirmationModalVisible(true);
  const closeConfirmationModal = () => setIsConfirmationModalVisible(false);
  const openRatingModal = () => setIsRatingModalVisible(true);
  const closeRatingModal = () => setIsRatingModalVisible(false);

  const favoriteHandler = async () => {
    if (userInfo?.accountId) {
      if (isAddedToFavorites) {
        setActionType('unfavorite');
        setItemToRemove({ name: title, release_date: releaseDate });
        openConfirmationModal();
        return;
      }
      const response = await setFavorite({
        mediaType: "movie",
        mediaId: id,
        favoriteState: !isAddedToFavorites,
      });

      if (response?.success) {
        if (isAddedToFavorites) {
          validateFavoriteMovies({
            state: "removed",
            id,
          });
        } else {
          const updatedMedia = [...favoriteMovies];

          updatedMedia.unshift({
            id,
            poster_path: moviePoster,
            title,
            release_date: releaseDate,
          });

          validateFavoriteMovies({
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
        setItemToRemove({ name: title, release_date: releaseDate });
        openConfirmationModal();
        return;
      }
      const response = await addToWatchlist({
        mediaType: "movie",
        mediaId: id,
        watchlistState: !isAddedToWatchlist,
      });

      if (response?.success) {
        if (isAddedToWatchlist) {
          validateMoviesWatchlist({
            state: "removed",
            id,
          });
        } else {
          const updatedMedia = [...moviesWatchlist];

          updatedMedia.unshift({
            id,
            poster_path: moviePoster,
            title,
            release_date: releaseDate,
          });

          validateMoviesWatchlist({
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
        mediaType: "movie",
        mediaId: id,
        watchlistState: false,
      });

      if (response?.success) {
        validateMoviesWatchlist({ state: "removed", id });
        showToast({ message: "Removed from watchlist" });
      } else {
        showToast({ message: "Something went wrong, try again later" });
      }
    } else if (actionType === 'unfavorite') {
      const response = await setFavorite({
        mediaType: "movie",
        mediaId: id,
        favoriteState: false,
      });

      if (response?.success) {
        validateFavoriteMovies({ state: "removed", id });
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
      <HeroDetailsContainer className="relative mb-auto">
        <HeroBgContainer className="absolute">
          <HeroBg className="absolute text-center">
            <Image
              src={
                backdropPath
                  ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
                  : "/Images/Hex.webp"
              }
              alt="movie-backdrop"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </HeroBg>

          {/* color gradient overlay */}
          <DominantColor image={moviePoster} />
        </HeroBgContainer>

        <DetailsHeroWrap>
          <HeroImgWrapper>
            <HeroImg className="relative text-center">
              <Image
                src={
                  moviePoster
                    ? `https://image.tmdb.org/t/p/w500${moviePoster}`
                    : "/Images/DefaultImage.png"
                }
                alt="movie-poster"
                fill
                style={{ objectFit: "cover" }}
                priority
                className="cursor-pointer"
                placeholder="blur"
                blurDataURL={blurPlaceholder}
              />
            </HeroImg>

            <div className="w-full">
              {trailerLink && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailerLink}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="watch trailer"
                  className="mb-3 block"
                >
                  <Button
                    className="w-full gap-3"
                    as={motion.button}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaYoutube size="1.5rem" />
                    <Span className="font-semibold">Watch Trailer</Span>
                  </Button>
                </a>
              )}

              <TechnicalDetails data={technicalDetails} />

              <div className="mb-3 flex justify-start gap-3">
                <AddToListModal mediaType="movie" mediaId={id} />
              </div>

              <div className="flex justify-start gap-3">
                <Button
                  className="w-full mediaCTA"
                  loading={+isToastVisible}
                  aria-label="watchlist button"
                  as={motion.button}
                  whileTap={{ scale: 0.95 }}
                  onClick={watchlistHandler}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`watchlist - ${isAddedToWatchlist.toString()}`}
                      variants={framerTabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.5 }}
                    >
                      {isAddedToWatchlist ? (
                        <BiListCheck size="22px" />
                      ) : (
                        <BiListPlus size="22px" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>

                <Button
                  className="w-full mediaCTA"
                  aria-label="favorite button"
                  onClick={favoriteHandler}
                  as={motion.button}
                  loading={+isToastVisible}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`favorite - ${isAddedToFavorites.toString()}`}
                      variants={framerTabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.5 }}
                    >
                      {isAddedToFavorites ? (
                        <FaHeart size="20px" />
                      ) : (
                        <FaRegHeart size="20px" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>

                <Button
                  className="w-full mediaCTA"
                  aria-label="rating button"
                  as={motion.button}
                  loading={+isToastVisible}
                  whileTap={{ scale: 0.95 }}
                  onClick={ratingModalHandler}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`rating - ${savedRating.toString()}`}
                      variants={framerTabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.5 }}
                    >
                      {savedRating ? (
                        <RatingOverlay className="media-page">
                          <AiFillStar size="16px" />
                          <p className="m-0 leading-tight font-semibold">
                            {savedRating}
                          </p>
                        </RatingOverlay>
                      ) : (
                        <BsStarHalf size="20px" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>

                <Link href={`/movies/${getCleanTitle(id, title)}/lists`} className="w-full mediaCTA">
                  <Button as={motion.button} whileTap={{ scale: 0.95 }}>
                    <MdOutlineFormatListBulleted size="20px" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* social media links */}
            <SocialMediaLinks
              links={socialIds}
              homepage={homepage}
              mediaDetails={{
                title: title,
                description: overview,
              }}
            />
          </HeroImgWrapper>
          <Gradient />

          {/* right side info */}
          <HeroInfoWrapper className="max-w-5xl">
            <HeroInfoTitle className="mb-2">
              {title} ({releaseYear})
            </HeroInfoTitle>
            {renderEaster ? <Light onClick={easterHandler} /> : null}
            <RtoR className="my-4">
              <ReleaseDateWrapper>
                <Span className="font-medium">{releaseDate}</Span>
              </ReleaseDateWrapper>
              {genres.length > 0 ? (
                <GenreWrap className="font-bold">
                  <Divider />
                  {genres.map((item, i) => (
                    <Link
                      key={item.id}
                      href={`/genre/${getCleanTitle(
                        item.id,
                        item.name
                      )}/movies`}
                      passHref
                      scroll={false}
                    >
                      <Rounded className={genres.length == i + 1 ? "sep" : ""}>
                        {item.name}
                      </Rounded>
                    </Link>
                  ))}
                  <Divider />
                </GenreWrap>
              ) : null}

              <Span className="font-medium">{getRuntime(runtime)}</Span>
            </RtoR>
            <i>
              <Tagline className="my-4 block gap-4">
                {adult && <Rounded>Adult</Rounded>}
                <KeywordList keywords={keywords?.keywords} />
                {tagline && tagline}
              </Tagline>
            </i>
            {overview ? (
              <Overview className="font-normal">{overview}</Overview>
            ) : null}
            {rating ? (
              <RatingWrapper>
                <Fragment>
                  <Span className="text-[calc(1.525rem_+_3.3vw)] xl:text-6xl font-bold">
                    {getRating(rating)}
                  </Span>
                  <span> / 10</span>
                </Fragment>
              </RatingWrapper>
            ) : null}
            {crewData?.length > 0 ? (
              <CreditsWrapper>
                {crewData.map((item) => (
                  <Credits key={item.credit_id}>
                    <Span className="block font-normal">{item.job}</Span>
                    <Link href={`/person/${getCleanTitle(item.id, item.name)}`}>
                      <Span className="block font-bold credit">
                        {item.name}
                      </Span>
                    </Link>
                  </Credits>
                ))}
              </CreditsWrapper>
            ) : null}
            {collection ? (
              <CollectionWrapper>
                <MovieCollection collection={collection} />
              </CollectionWrapper>
            ) : null}
          </HeroInfoWrapper>
        </DetailsHeroWrap>
      </HeroDetailsContainer>

      {renderEaster ? (
        <Fragment>
          {!hasSeen ? (
            <EasterText className="text-xl md:text-2xl px-5" show={showEaster}>
              Congratulations, you have found the easter egg.
            </EasterText>
          ) : (
            <EasterText className="text-xl md:text-2xl" show={showEaster}>
              Aren&apos;t you scared?
            </EasterText>
          )}
          <LightsInOut show={showEaster} onClick={easterHandler} />
          <MovieEaster show={showEaster} />
        </Fragment>
      ) : null}

      <Toast isToastVisible={isToastVisible}>
        <Span className="toast-message">{toastMessage}</Span>
      </Toast>

      <RatingModal
        mediaType="movie"
        mediaId={id}
        posterPath={moviePoster}
        releaseDate={releaseDate}
        title={title}
        isOpen={isRatingModalVisible}
        closeModal={closeRatingModal}
        mediaName={`${title} (${releaseYear})`}
      />
    </Fragment>
  );
};

export default MovieDetails;
