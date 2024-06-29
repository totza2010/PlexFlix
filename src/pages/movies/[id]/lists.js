import DominantColor from "components/DominantColor/DominantColor";
import MetaWrapper from "components/MetaWrapper";
import { HeroInfoTitle } from "components/MovieInfo/MovieDetailsStyles";
import PlaceholderText from "components/PlaceholderText";
import Recommendations from "components/Recommendations/Recommendations";
import { AnimatePresence, motion } from "framer-motion";
import { apiEndpoints } from "globals/constants";
import useInfiniteQuery from "hooks/useInfiniteQuery";
import { Fragment } from "react";
import {
  fetchOptions,
  framerTabVariants,
  getCleanTitle,
  removeDuplicates,
  getReleaseYear,
} from "src/utils/helper";
import { Error404, LayoutContainer } from "styles/GlobalComponents";

const Lists = ({ error, lists, movie }) => {
  const { list } = useInfiniteQuery({
    type: "movieLists",
    initialPage: 2,
    movieId: movie?.id,
  });

  const { cleanedItems } = removeDuplicates(
    (lists?.results ?? [])?.concat(list)
  );
  //   const renderList = lists.concat(infiniteQueryLists);

  return (
    <Fragment>
      <MetaWrapper
        title={
          error
            ? "Not Found - PlexFlix"
            : `${movie?.title} (${getReleaseYear(
                movie?.release_date
              )}) - Lists - plexflix`
        }
        description={error ? "Not Found" : `${movie?.title} lists`}
        image={`https://image.tmdb.org/t/p/w780${movie?.backdrop}`}
        url={`${process.env.BUILD_URL}/movies/${getCleanTitle(
          movie?.id,
          movie?.title
        )}/lists`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <LayoutContainer className="relative list-wrapper grow">
          <DominantColor image={movie?.poster} flip tint />

          <div className="relative z-20">
            <AnimatePresence mode="wait">
              {
                <motion.div
                  key={`isCreateMode-false`}
                  variants={framerTabVariants}
                  initial={false}
                  animate="visible"
                  exit="hidden"
                >
                  <div className="text-center py-6">
                    <HeroInfoTitle className="mb-4">
                      {movie?.title} ({getReleaseYear(movie?.release_date)})
                    </HeroInfoTitle>

                    <div className="flex justify-between items-center py-2 max-sm:flex-col gap-5">
                      <h3 className="mb-0 text-2xl md:text-3xl font-semibold">{`Lists (${lists.total_results})`}</h3>
                    </div>
                  </div>

                  {cleanedItems?.length > 0 ? (
                    <Recommendations data={cleanedItems} type="lists" />
                  ) : (
                    <PlaceholderText height="large">
                      You don&apos;t have any lists yet. <br /> Click on the
                      button above to create one.
                    </PlaceholderText>
                  )}
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </LayoutContainer>
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const movieId = id.split("-")[0];

    const [movieRes, listsRes] = await Promise.all([
      fetch(apiEndpoints.movie.movieDetails(movieId), fetchOptions()),
      fetch(apiEndpoints.lists.getMovieLists({ movieId }), fetchOptions()),
    ]);

    if (!movieRes.ok) {
      const errorDetails = await movieRes.text();
      throw new Error(
        `Failed to fetch movie details: ${movieRes.status} - ${errorDetails}`
      );
    }

    if (!listsRes.ok) {
      const errorDetails = await listsRes.text();
      throw new Error(
        `Failed to fetch list details: ${listsRes.status} - ${errorDetails}`
      );
    }

    const [movie, lists] = await Promise.all([
      movieRes.json(),
      listsRes.json(),
    ]);

    if (!movie) throw new Error("Movie not found");

    const expectedUrl = getCleanTitle(movie?.id, movie?.title);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/movies/${expectedUrl}/lists`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        error: false,
        lists: lists || [],
        movie,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: true,
        lists: [],
      },
    };
  }
};

export default Lists;
