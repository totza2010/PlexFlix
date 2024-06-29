import MoviesTemplate from "components/MediaTemplate/MoviesTemplate";
import MetaWrapper from "components/MetaWrapper";
import { Span } from "components/MovieInfo/MovieDetailsStyles";
import PlaceholderText from "components/PlaceholderText";
import { SortBy } from "components/SortBy/SortBy";
import { apiEndpoints } from "globals/constants";
import useInfiniteQuery from "hooks/useInfiniteQuery";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { fetchOptions, getCleanTitle, removeDuplicates } from "src/utils/helper";
import { Error404, ModulesWrapper } from "styles/GlobalComponents/index";

const Movies = ({ Movies, genre, error }) => {
  
  const expectedUrl = getCleanTitle(genre?.id, genre?.name);

  const { list } = useInfiniteQuery({
    initialPage: 3,
    type: "movieGenre",
    genreId: genre?.id
  });

  const { query } = useRouter();
  const { sortBy, order } = query;
  const { cleanedItems } = removeDuplicates((Movies ?? [])?.concat(list));

  const getRenderList = (list) => {
    if (sortBy === "name") {
      if (order === "asc") {
        return [...list].sort((a, b) => (a.title > b.title ? 1 : -1));
      } else {
        return [...list].sort((a, b) => (a.title > b.title ? 1 : -1)).reverse();
      }
    } else if (sortBy === "releaseDate") {
      if (order === "asc") {
        return [...list].sort((a, b) => {
          return new Date(a.release_date) - new Date(b.release_date);
        });
      } else {
        return [...list].sort((a, b) => {
          return new Date(b.release_date) - new Date(a.release_date);
        });
      }
    } else if (sortBy === "rating") {
      if (order === "asc") {
        return [...list].sort((a, b) => {
          return a.vote_average - b.vote_average;
        });
      } else {
        return [...list].sort((a, b) => {
          return b.vote_average - a.vote_average;
        });
      }
    }

    return list;
  };

  const renderList = sortBy ? getRenderList(cleanedItems) : cleanedItems;

  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${genre?.name} Movies - PlexFlix`}
        description={error ? "Not Found" : `${genre?.name} Movies`}
        url={`${process.env.BUILD_URL}/genre/${expectedUrl}/movies`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <ModulesWrapper>
          {renderList?.length > 0 ? (
            <Fragment>
              <Span className='text-[calc(1.375rem_+_1.5vw)] xl:text-[2.5rem] leading-12 block text-center genre'>
                {genre?.name} Movies
              </Span>
              <SortBy />
              <MoviesTemplate movies={renderList} />
            </Fragment>
          ) : (
            <PlaceholderText height='large'>No Movies For Now</PlaceholderText>
          )}
        </ModulesWrapper>
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { item } = ctx.query;
    const genreId = item.split("-")[0];

    const [genreRes] = await Promise.all([
      fetch(apiEndpoints.movie.movieGenreList, fetchOptions())
    ]);

    if (
      !genreRes.ok
    ) throw new Error("Failed to fetch data");

    const [genreList] = await Promise.all([
      genreRes.json()
    ]);
    const genre = genreList?.genres.find(genre => genre.id === parseInt(genreId));

    if (!genre) throw new Error("Genre not found");
    const expectedUrl = getCleanTitle(genre?.id, genre?.name);

    if (item !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/genre/${expectedUrl}/movies`,
          permanent: false,
        },
      };
    }

    const [response, nextPage] = await Promise.all([
      fetch(apiEndpoints.movie.movieGenre({ genreId, pageQuery: 1 }), fetchOptions()),
      fetch(apiEndpoints.movie.movieGenre({ genreId, pageQuery: 2 }), fetchOptions())
    ]);

    if (
      !response.ok ||
      !nextPage.ok
    ) throw new Error("Failed to fetch data");

    const [moviesList, secondMoviesList] = await Promise.all([
      response.json(),
      nextPage.json()
    ]);

    const Movies = moviesList["results"].concat(secondMoviesList.results);

    return {
      props: {
        Movies,
        genre: genre || [],
        error: false
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: { error: true }
    };
  }
};

export default Movies;
