import PlaceholderText from "components/PlaceholderText";
import { SortBy } from "components/SortBy/SortBy";
import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import useInfiniteQuery from "hooks/useInfiniteQuery";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { removeDuplicates, getReleaseDate, getCleanTitle } from "src/utils/helper";
import {
  SearchResultsContainer,
  QueryContainer,
  QueryImg,
  QueryTitle,
  QueryInfoWrapper,
  QueryReleaseDate,
  QueryDescription
} from "./SearchTabStyles";

const TVSearch = ({ searchQuery, tvRes }) => {
  const { list } = useInfiniteQuery({
    initialPage: 2,
    type: "tvSearch",
    searchQuery
  });

  const { query } = useRouter();
  const { sortBy, order } = query;
  const { cleanedItems } = removeDuplicates(tvRes.results.concat(list));

  const getRenderList = (list) => {
    if (sortBy === "name") {
      if (order === "asc") {
        return [...list].sort((a, b) => (a.name > b.name ? 1 : -1));
      } else {
        return [...list].sort((a, b) => (a.name > b.name ? 1 : -1)).reverse();
      }
    } else if (sortBy === "releaseDate") {
      if (order === "asc") {
        return [...list].sort((a, b) => {
          return new Date(a.first_air_date) - new Date(b.first_air_date);
        });
      } else {
        return [...list].sort((a, b) => {
          return new Date(b.first_air_date) - new Date(a.first_air_date);
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

  return (
    <SearchResultsContainer>
      {cleanedItems?.length > 0 ? (
        <section>
          <SortBy />
          {(sortBy ? getRenderList(cleanedItems) : cleanedItems)?.map(
            ({ id, name, poster_path, first_air_date, overview }) => (
              <motion.div whileTap={{ scale: 0.98 }} key={id}>
                <Link href={`/tv/${id}-${getCleanTitle(name)}`} passHref scroll={false}>
                  <QueryContainer>
                    <QueryImg className='relative text-center'>
                      <Image
                        src={
                          poster_path
                            ? `https://image.tmdb.org/t/p/w185${poster_path}`
                            : "/Images/DefaultImage.png"
                        }
                        alt='TV-poster'
                        fill
                        style={{ objectFit: "cover" }}
                        placeholder='blur'
                        blurDataURL={blurPlaceholder}
                      />
                    </QueryImg>
                    <QueryInfoWrapper>
                      <div>
                        <QueryTitle>{name}</QueryTitle>
                        <QueryReleaseDate>{getReleaseDate(first_air_date)}</QueryReleaseDate>
                      </div>
                      <QueryDescription>{overview}</QueryDescription>
                    </QueryInfoWrapper>
                  </QueryContainer>
                </Link>
              </motion.div>
            )
          )}
        </section>
      ) : (
        <PlaceholderText height='large'>No TV show results for this query.</PlaceholderText>
      )}
    </SearchResultsContainer>
  );
};

export default TVSearch;
