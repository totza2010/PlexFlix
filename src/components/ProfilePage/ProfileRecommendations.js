import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, Fragment, useContext } from 'react';
import { MediaContext } from '../../Store/MediaContext';
import { NoDataText } from '../../styles/GlobalComponents';
import { CardsContainerGrid } from '../Popular/PopularStyles';
import Tabs from '../Tabs/Tabs';
import MediaCard from './MediaCard';

const ProfileRecommendations = () => {
  const [tabState, setTabState] = useState('movies');
  const { movieRecommendations, tvRecommendations } = useContext(MediaContext);

  const tabList = useMemo(
    () => [
      { key: 'movies', name: 'Movies' },
      { key: 'tv', name: 'TV Shows' }
    ],
    []
  );

  const cleanMovieList = useMemo(() => {
    let filtered = [];
    return movieRecommendations.map((item) => {
      if (filtered.includes(item.id)) {
        return { duplicate: true };
      } else {
        filtered.push(item.id);
        return item;
      }
    });
  }, [movieRecommendations]);

  const cleanTvList = useMemo(() => {
    let filtered = [];
    return tvRecommendations.map((item) => {
      if (filtered.includes(item.id)) {
        return { duplicate: true };
      } else {
        filtered.push(item.id);
        return item;
      }
    });
  }, [tvRecommendations]);

  return (
    <Fragment>
      <Tabs
        tabList={tabList}
        currentTab={tabState}
        setTab={setTabState}
        className='mb-3'
      />

      <AnimatePresence exitBeforeEnter initial={false}>
        {tabState === 'movies' && (
          <motion.div
            key={`${movieRecommendations?.length}-movies`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {cleanMovieList.length > 0 ? (
              <CardsContainerGrid>
                {cleanMovieList.map(
                  (movie) =>
                    !movie?.duplicate && (
                      <MediaCard
                        key={movie?.id}
                        data={movie}
                        link='movies'
                        recommendation
                      />
                    )
                )}
              </CardsContainerGrid>
            ) : (
              <NoDataText className='fw-bold text-center my-5'>
                No recommendations for now
              </NoDataText>
            )}
          </motion.div>
        )}

        {tabState === 'tv' && (
          <motion.div
            key={`${tvRecommendations?.length}-tv`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {cleanTvList.length > 0 ? (
              <CardsContainerGrid>
                {cleanTvList.map(
                  (tv) =>
                    !tv?.duplicate && (
                      <MediaCard
                        key={tv?.id}
                        data={tv}
                        link='tv'
                        recommendation
                      />
                    )
                )}
              </CardsContainerGrid>
            ) : (
              <NoDataText className='fw-bold text-center my-5'>
                No recommendations for now
              </NoDataText>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default ProfileRecommendations;
