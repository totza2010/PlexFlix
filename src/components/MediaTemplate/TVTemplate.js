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

const TVTemplate = ({ TV, creditsPage = false }) => {
  return (
    <CardsContainerGrid>
      {TV?.length > 0
        ? TV.map(({ id, name, original_name, poster_path, vote_average, first_air_date, job }) => (
            <Cards key={id}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.95 }}>
                <Link href={`/tv/${getCleanTitle(id, original_name)}`} passHref scroll={false}>
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
                {creditsPage ? <InfoTitle>{`${name} (${getReleaseYear(first_air_date)})`}</InfoTitle> : <InfoTitle>{name}</InfoTitle>}
                {creditsPage ? null : <ReleaseDate>{getReleaseDate(first_air_date)}</ReleaseDate>}
                {creditsPage && job?.length > 0 ? (
                  <p className='text-white text-base mt-1 font-medium'>{job.join(", ")}</p>
                ) : null}
              </CardInfo>
            </Cards>
          ))
        : null}
    </CardsContainerGrid>
  );
};

export default TVTemplate;
