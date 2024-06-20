import PlaceholderText from "components/PlaceholderText";
import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import useInfiniteQuery from "hooks/useInfiniteQuery";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"
import { getCleanTitle, removeDuplicates } from "src/utils/helper";
import { SortBy } from "components/SortBy/SortBy";
import {
  SearchResultsContainer,
  QueryContainer,
  QueryImg,
  QueryTitle,
  QueryInfoWrapper,
  QueryReleaseDate,
  QueryDescription
} from "./SearchTabStyles";

const PersonSearch = ({ searchQuery, persons }) => {
  const { list } = useInfiniteQuery({
    initialPage: 2,
    type: "personSearch",
    searchQuery
  });

  const { query } = useRouter();
  const { sortBy, order } = query;
  const { cleanedItems } = removeDuplicates(persons.results.concat(list));

  const getRenderList = (list) => {
    if (sortBy === "name") {
      if (order === "asc") {
        return [...list].sort((a, b) => (a.name > b.name ? 1 : -1));
      } else {
        return [...list].sort((a, b) => (a.name > b.name ? 1 : -1)).reverse();
      }
    }

    return list;
  };

  return (
    <SearchResultsContainer>
      {cleanedItems?.length > 0 ? (
        <section>
          <SortBy person={true} />
          {(sortBy ? getRenderList(cleanedItems) : cleanedItems)?.map(
            ({ id, name, profile_path, known_for_department, known_for }) => (
              <motion.div whileTap={{ scale: 0.98 }} key={id}>
                <Link href={`/person/${id}-${getCleanTitle(name)}`} passHref scroll={false}>
                  <QueryContainer>
                    <QueryImg className='relative text-center'>
                      <Image
                        src={
                          profile_path
                            ? `https://image.tmdb.org/t/p/w185${profile_path}`
                            : "/Images/DefaultImage.png"
                        }
                        alt='movie-poster'
                        fill
                        style={{ objectFit: "cover" }}
                        placeholder='blur'
                        blurDataURL={blurPlaceholder}
                      />
                    </QueryImg>
                    <QueryInfoWrapper>
                      <div>
                        <QueryTitle>{name}</QueryTitle>
                        <QueryReleaseDate>{known_for_department}</QueryReleaseDate>
                      </div>
                      <QueryDescription>{known_for.title}</QueryDescription>
                    </QueryInfoWrapper>
                  </QueryContainer>
                </Link>
              </motion.div>
            )
          )}
        </section>
      ) : (
        <PlaceholderText height='large'>No Movie results for this query.</PlaceholderText>
      )}
    </SearchResultsContainer>
  );
};

export default PersonSearch;
