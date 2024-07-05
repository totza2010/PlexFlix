import { getTv } from "api/data";
import Loading from "components/Loading";
import { CardsContainerGrid, CardsContainerGrid2 } from "components/MediaTemplate/TemplateStyles";
import { useModal } from "components/Modal/Modal";
import PlaceholderText from "components/PlaceholderText";
import RatingModal from "components/RatingModal/RatingModal";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { framerTabVariants, getReleaseYear } from "src/utils/helper";
import { useMediaContext } from "Store/MediaContext";
import MediaCard from "./MediaCard";
import { ProfileRatingTab } from "./ProfilePage";
import { RatingOverlay } from "./ProfilePageStyles";

const RatingCTA = ({ mediaData }) => {
  const { isModalVisible, openModal, closeModal } = useModal();
  const { id, SeasonNumber, EpisodeNumber, name, releaseDate, type, posterPath, rating } = mediaData;
  return (
    <Fragment>
      <RatingModal
        mediaType={type}
        mediaId={id}
        SeasonNumber={SeasonNumber}
        EpisodeNumber={EpisodeNumber}
        isOpen={isModalVisible}
        posterPath={posterPath}
        releaseDate={releaseDate}
        title={name}
        closeModal={closeModal}
        mediaName={`${name} (${getReleaseYear(releaseDate)})`}
      />

      {rating && (
        <RatingOverlay as={motion.button} whileTap={{ scale: 0.95 }} onClick={openModal} className="w-8 !h-8">
          <AiFillStar size='20px' />
          <p className='m-0 font-semibold'>{rating}</p>
        </RatingOverlay>
      )}

    </Fragment>
  );
};

const Ratings = () => {
  const { ratedMovies, ratedTvShows, ratedTvShowsEpisode, ratedMoviesLoading, ratedTvShowsLoading, ratedTvShowsEpisodeLoading } = useMediaContext();

  const [tvData, setTvEpisodeNames] = useState([]);

  useEffect(() => {
    const fetchTvNames = async () => {
      if (ratedTvShowsEpisode.length > 0) {
        const names = await Promise.all(
          ratedTvShowsEpisode.map((tv) => getTv(tv?.show_id))
        );
        setTvEpisodeNames(names);
      }
    };
    fetchTvNames();
  }, [ratedTvShowsEpisode]);
// console.log(tvData)
  return (
    <Fragment>
      {ratedMoviesLoading || ratedTvShowsLoading || ratedTvShowsEpisodeLoading ? (
        <Loading />
      ) : (
        <ProfileRatingTab>
          {(tabState) => (
            <AnimatePresence mode='wait' initial={false}>
              {tabState === "movies" && (
                <motion.div
                  key={`${ratedMovies?.length}-movies`}
                  variants={framerTabVariants}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  transition={{ duration: 0.5 }}>
                  {ratedMovies.length > 0 ? (
                    <CardsContainerGrid className='xl-row-gap'>
                      {ratedMovies.map((movie) => (
                        <MediaCard
                          key={movie?.id}
                          data={movie}
                          link='movies'>
                          <RatingCTA
                            mediaData={{
                              id: movie?.id,
                              SeasonNumber: null,
                              EpisodeNumber: null,
                              name: movie?.title,
                              posterPath: movie?.poster_path,
                              releaseDate: movie?.release_date,
                              type: "movie",
                              rating: movie?.rating ?? false
                            }}
                          />
                        </MediaCard>
                      ))}
                    </CardsContainerGrid>
                  ) : (
                    <PlaceholderText>No movies rated yet</PlaceholderText>
                  )}
                </motion.div>
              )}

              {tabState === "tv_seasons" && (
                <motion.div
                  key={`${ratedTvShows?.length}-tv-seasons`}
                  variants={framerTabVariants}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  transition={{ duration: 0.5 }}>
                  {ratedTvShows.length > 0 ? (
                    <CardsContainerGrid className='xl-row-gap'>
                      {ratedTvShows.map((tv) => (
                        <MediaCard key={tv?.id} data={tv} link='tv'>
                          <RatingCTA
                            mediaData={{
                              id: tv?.id,
                              SeasonNumber: null,
                              EpisodeNumber: null,
                              name: tv?.name,
                              releaseDate: tv?.first_air_date,
                              type: "tv",
                              rating: tv?.rating ?? false
                            }}
                          />
                        </MediaCard>
                      ))}
                    </CardsContainerGrid>
                  ) : (
                    <PlaceholderText>No TV Shows rated yet</PlaceholderText>
                  )}
                </motion.div>
              )}

              {tabState === "tv_episodes" && (
                <motion.div
                  key={`${ratedTvShowsEpisode?.length}-tv-episodes`}
                  variants={framerTabVariants}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  transition={{ duration: 0.5 }}>
                  {ratedTvShowsEpisode.length > 0 ? (
                    <CardsContainerGrid2 className='xl-row-gap'>
                      {ratedTvShowsEpisode.map((tv) => (
                        <MediaCard key={tv?.id} data={tv} tvData={tvData.find((e) => e.id == tv?.show_id)} link='tv'>
                          <RatingCTA
                            mediaData={{
                              id: tv?.show_id,
                              SeasonNumber: tv?.season_number,
                              EpisodeNumber: tv?.episode_number,
                              name: tvData.find((e) => e.id == tv?.show_id)?.name,
                              releaseDate: tv?.air_date,
                              type: "tv/episodes",
                              rating: tv?.rating ?? false
                            }}
                          />
                        </MediaCard>
                      ))}
                    </CardsContainerGrid2>
                  ) : (
                    <PlaceholderText>No TV Shows rated yet</PlaceholderText>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </ProfileRatingTab>
      )}
    </Fragment>
  );
};

export default Ratings;
