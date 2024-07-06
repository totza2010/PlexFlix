import {
  CardImg,
  CardInfo,
  Cards,
  ReleaseDate
} from "components/MediaTemplate/TemplateStyles";
import { PostersWrapper } from "components/Posters/PostersStyles";
import RatingTag from "components/RatingTag/RatingTag";
import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { getCleanTitle, getReleaseDate } from "src/utils/helper";
import {
  RecommendationsGrid,
  RecommendedImg,
  RecommendedWrapper,
  InfoTitle
} from "./RecommendationsStyles";

const Recommendations = ({ data, type }) => {
  if (type !== "lists")
    data.splice(40);

  console.log(data)
  return (
    type !== "lists" ? (<PostersWrapper
      className='profile-media-grid'
      style={{ "--colCount": data?.length }}>
      {data.map((item) => (
        <Cards key={item.id}>
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.1 }
            }}
            whileTap={{ scale: 0.95 }}>
            <Link
              href={`/${type}/${getCleanTitle(item.id, (item?.title || item?.name))}`}
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
    </PostersWrapper>)
      : <RecommendationsGrid>
        {data.map((item) => (
          <RecommendedWrapper key={item.id}>
            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.1 }
              }}
              whileTap={{ scale: 0.95 }}>
              <Link
                href={`/${type}/${getCleanTitle(item.id, (item?.title || item?.name))}`}
                passHref
                scroll={false}>
                <RecommendedImg className='relative text-center'>
                  <Image
                    src={
                      item.backdrop_path
                        ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
                        : "/Images/DefaultBackdrop.png"
                    }
                    alt={`${type}-poster`}
                    fill
                    style={{ objectFit: "cover" }}
                    placeholder='blur'
                    blurDataURL={blurPlaceholder}
                  />
                </RecommendedImg>
              </Link>
            </motion.div>
            <InfoTitle className='mt-3 mb-0 text-center'>{item?.title || item?.name}</InfoTitle>
          </RecommendedWrapper>
        ))}
      </RecommendationsGrid>
  );
};

export default Recommendations;
