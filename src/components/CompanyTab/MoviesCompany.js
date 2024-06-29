import MoviesTemplate from "components/MediaTemplate/MoviesTemplate";
import { SortBy } from "components/SortBy/SortBy";
import useInfiniteQuery from "hooks/useInfiniteQuery";
import { useRouter } from "next/router";
import { removeDuplicates } from "src/utils/helper";

const MoviesCompany = ({ movies, companyId }) => {
  const { list } = useInfiniteQuery({
    initialPage: 2,
    type: "companyMovie",
    companyId
  });

  const { query } = useRouter();
  const { sortBy, order } = query;
  const { cleanedItems } = removeDuplicates(movies.concat(list));

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
    <section>
      <SortBy />
      <MoviesTemplate movies={renderList} />
    </section>
  );
};

export default MoviesCompany;
