import { CastGrid, CastImg, CastWrapper } from "components/Credit/CreditStyles";
import DominantColor from "components/DominantColor/DominantColor";
import MetaWrapper from "components/MetaWrapper";
import { HeroInfoTitle, Span } from "components/MovieInfo/MovieDetailsStyles";
import PlaceholderText from "components/PlaceholderText";
import { LinearTabs } from "components/Tabs/Tabs";
import { AnimatePresence, motion } from "framer-motion";
import { apiEndpoints, blurPlaceholder } from "globals/constants";
import useTabs from "hooks/useTabs";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import {
  fetchOptions,
  framerTabVariants,
  getCleanTitle,
  getReleaseYear,
  mergeEpisodeCount
} from "src/utils/helper";
import { Error404, ModulesWrapper } from "styles/GlobalComponents";

const tabList = [
  {
    key: "cast",
    name: "Cast"
  },
  {
    key: "crew",
    name: "Crew"
  }
];

const Credits = ({ movieData, cast, crew, error }) => {
  const { activeTab, setTab } = useTabs({ tabLocation: "tvSeasonCreditTabState", defaultState: "cast" });
  const [filteredCast, setFilteredCast] = useState(cast);
  const [filteredCrew, setFilteredCrew] = useState(crew);
  const timeoutRef = useRef(null);

  const searchHandler = (e) => {
    clearTimeout(timeoutRef.current);
    const searchValue = e.target.value.toLowerCase().trim();

    timeoutRef.current = setTimeout(() => {
      if (activeTab === "cast") {
        if (searchValue.length === 0) {
          setFilteredCast(cast);
        } else {
          const filteredCast = cast.filter(
            ({ name, character }) =>
              name.toLowerCase().includes(searchValue) || character.toLowerCase().includes(searchValue)
          );
          setFilteredCast(filteredCast);
        }
      } else if (activeTab === "crew") {
        if (searchValue.length === 0) {
          setFilteredCrew(crew);
        } else {
          const filteredCrew = crew.filter(
            ({ name, job }) =>
              name.toLowerCase().includes(searchValue) || job.toLowerCase().includes(searchValue)
          );
          setFilteredCrew(filteredCrew);
        }
      }
    }, 300);
  };

  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${movieData.title} (${getReleaseYear(movieData?.release_date)}) - Credit - PlexFlix`}
        description={`${movieData.title} credit`}
        image={`https://image.tmdb.org/t/p/w780${movieData.backdrop_path}`}
        url={`${process.env.BUILD_URL}/movies/${getCleanTitle(movieData?.id, movieData?.title)}/credit`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <div className='relative mb-auto'>
          <DominantColor image={movieData?.poster_path} flip tint />
          <ModulesWrapper className='relative z-10'>
            <div className='text-center py-6'>
              <HeroInfoTitle className='mb-4'>
                <Link href={`/movies/${getCleanTitle(movieData?.id, movieData?.title)}`} passHref>
                  {movieData.title} ({getReleaseYear(movieData?.release_date)}) - Credits
                </Link>
              </HeroInfoTitle>

              <div className='flex justify-between items-center py-2 max-sm:flex-col gap-5'>
                <LinearTabs tabList={tabList} currentTab={activeTab} setTab={setTab} />
                <input
                  type='text'
                  placeholder='Search'
                  className='px-4 py-2 rounded-lg bg-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent min-w-[320px] text-lg max-sm:min-w-full'
                  onChange={searchHandler}
                />
              </div>
            </div>

            <AnimatePresence mode='wait'>
              {activeTab === "cast" && (
                filteredCast?.length > 0 ? (
                  <CastGrid
                    as={motion.div}
                    key={`cast-grid-${filteredCast.length}`}
                    variants={framerTabVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    transition={{ duration: 0.325 }}>
                    {filteredCast.map((item) => (
                      <CastWrapper key={item.credit_id}>
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
                                  item.profile_path
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
                          <Span className='movieCastName block'>{item.name}</Span>
                          <Span className='movieCastName block episode-count'>
                            {item?.episode_count} episodes
                          </Span>
                        </div>
                      </CastWrapper>
                    ))}
                  </CastGrid>
                ) : (
                  <motion.div
                    key='no-results'
                    variants={framerTabVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    transition={{ duration: 0.325 }}>
                    <PlaceholderText height='large'>No results found</PlaceholderText>
                  </motion.div>
                )
              )}
              {activeTab === "crew" && (
                filteredCrew?.length > 0 ? (
                  <CastGrid
                    as={motion.div}
                    key={`cast-grid-${filteredCrew.length}`}
                    variants={framerTabVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    transition={{ duration: 0.325 }}>
                    {filteredCrew.map((item) => (
                      <CastWrapper key={item.credit_id}>
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
                                  item.profile_path
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
                            {item?.name}
                          </Span>
                          <Span className='movieCastName block'>{item?.job}</Span>
                          <Span className='movieCastName block episode-count'>
                            {item?.episode_count} episodes
                          </Span>
                        </div>
                      </CastWrapper>
                    ))}
                  </CastGrid>
                ) : (
                  <motion.div
                    key='no-results'
                    variants={framerTabVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    transition={{ duration: 0.325 }}>
                    <PlaceholderText height='large'>No results found</PlaceholderText>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </ModulesWrapper>
        </div>
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const tvId = id.split("-")[0];

    const res = await fetch(apiEndpoints.movie.getMovieCredits({ id: tvId }), fetchOptions());

    if (!res.ok) {
      const errorDetails = await res.text();
      throw new Error(`Failed to fetch list details: ${res.status} - ${errorDetails}`);
    }

    const [data] = await Promise.all([
      res.json()
    ]);

    if (!data) throw new Error("List not found");

    const expectedUrl = getCleanTitle(data?.id, data?.title);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/movies/${expectedUrl}/credits`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        movieData: data,
        cast: mergeEpisodeCount(data?.credits?.cast).sort((a, b) => b.popularity - a.popularity),
        crew: mergeEpisodeCount(data?.credits?.crew).sort((a, b) => b.popularity - a.popularity),
        error: false
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        movieData: {},
        cast: [],
        crew: [],
        error: true
      }
    };
  }
};

export default Credits;
