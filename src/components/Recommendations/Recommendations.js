import {
  CardImg,
  CardInfo,
  Cards,
  CardsContainerGrid,
  ReleaseDate
} from "components/MediaTemplate/TemplateStyles";
import RatingTag from "components/RatingTag/RatingTag";
import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { getCleanTitle, getReleaseDate } from "src/utils/helper";
import {
  InfoTitle
} from "./RecommendationsStyles";

const Recommendations = ({ data, type }) => {
  data.splice(20);

  return (
    <CardsContainerGrid>
      {data.map((item) => (
        <Cards key={item.id}>
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.1 }
            }}
            whileTap={{ scale: 0.95 }}>
            <Link
              href={`/${type}/${item.id}-${getCleanTitle(item?.title || item?.name)}`}
              passHref
              scroll={false}>
              <div className='relative'>
                <CardImg>
                  <Image
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
                        : "/Images/DefaultBackdrop.png"
                    }
                    alt={`${type}-poster`}
                    fill
                    style={{ objectFit: "cover" }}
                    className='poster'
                    placeholder='blur'
                    blurDataURL={blurPlaceholder}
                  />
                </CardImg>
                <RatingTag rating={item.vote_average} />
              </div>
            </Link>
          </motion.div>
          <CardInfo>
            <InfoTitle>{item?.title || item?.name}</InfoTitle>
            <ReleaseDate>{getReleaseDate(item?.release_date || item?.first_air_date)}</ReleaseDate>
          </CardInfo>
        </Cards>
      ))}
    </CardsContainerGrid>
  );
};

export default Recommendations;
