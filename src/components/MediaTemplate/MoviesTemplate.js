import RatingTag from "components/RatingTag/RatingTag";
import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { getCleanTitle, getReleaseDate, getReleaseYear } from "src/utils/helper";
import {
  CardsContainerGrid,
  Cards,
  CardImg,
  CardInfo,
  InfoTitle,
  ReleaseDate
} from "./TemplateStyles";

const MoviesTemplate = ({ movies, creditsPage = false }) => {
  return (
    <CardsContainerGrid>
      {movies.length > 0
        ? movies.map(({ id, title, original_title, poster_path, vote_average, release_date, job }) => (
            <Cards key={id}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.95 }}>
                <Link href={`/movies/${getCleanTitle(id, original_title)}`} passHref scroll={false}>
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
                {creditsPage ? <InfoTitle>{`${title} (${getReleaseYear(release_date)})`}</InfoTitle> : <InfoTitle>{title}</InfoTitle>}
                {creditsPage ? null : <ReleaseDate>{getReleaseDate(release_date)}</ReleaseDate>}
                {creditsPage && job?.length > 0 ? (
                  <p className='text-neutral-400 text-base font-medium'>{job.join(", ")}</p>
                ) : null}
              </CardInfo>
            </Cards>
          ))
        : null}
    </CardsContainerGrid>
  );
};

export default MoviesTemplate;
