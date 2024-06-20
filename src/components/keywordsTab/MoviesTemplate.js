import {
  CardsContainerGrid,
  Cards,
  CardImg,
  CardInfo,
  InfoTitle,
  ReleaseDate
} from "components/MediaTemplate/TemplateStyles";
import RatingTag from "components/RatingTag/RatingTag";
import { SortBy } from "components/SortBy/SortBy";
import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import useInfiniteQuery from "hooks/useInfiniteQuery";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCleanTitle, getReleaseDate, removeDuplicates } from "src/utils/helper";

const MoviesTemplate = ({ movies, keywordId }) => {
  const { list } = useInfiniteQuery({
    initialPage: 2,
    type: "keywordMovieDetails",
    keywordId
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
      <CardsContainerGrid>
        {cleanedItems.length > 0 ? (
          renderList.map(({ id, title, poster_path, vote_average, release_date }) => (
            <Cards key={id}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.95 }}>
                <Link href={`/movies/${id}-${getCleanTitle(title)}`} passHref scroll={false}>
                  <div className='relative'>
                    <CardImg>
                      <Image
                        src={
                          poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : "/Images/DefaultImage.png"
                        }
                        alt='movie-poster'
                        fill
                        style={{ objectFit: "cover" }}
                        className='poster'
                        placeholder='blur'
                        blurDataURL={blurPlaceholder}
                      />
                    </CardImg>
                    <RatingTag rating={vote_average} />
                  </div>
                </Link>
              </motion.div>
              <CardInfo>
                <InfoTitle>{title}</InfoTitle>
                <ReleaseDate>{getReleaseDate(release_date)}</ReleaseDate>
              </CardInfo>
            </Cards>
          ))
        ) : null}
      </CardsContainerGrid>
    </section>
  );
};

export default MoviesTemplate;
