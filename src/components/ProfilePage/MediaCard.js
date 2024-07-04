import {
  CardImg,
  CardInfo,
  Cards,
  InfoTitle,
  ReleaseDate
} from "components/MediaTemplate/TemplateStyles";
import RatingTag from "components/RatingTag/RatingTag";
import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { getCleanTitle, getReleaseDate } from "src/utils/helper";

const MediaCard = ({ data, tvData = null, link, children }) => {
  return (
    <Cards>
      <motion.div
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.1 }
        }}
        whileTap={{ scale: 0.95 }}>
        <div className='relative'>
          <CardImg className={`flex justify-end ${data?.poster_path ?? '!aspect-[16/9]'}`}>
            <Link
              href={`/${link}/${getCleanTitle((tvData ? tvData?.id : data?.id), (tvData ? tvData?.name : (data?.title || data?.name)))}${tvData ? `/season/${data?.season_number}/episode/${data?.episode_number}` : ""}`}
              passHref
              scroll={false}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${data?.poster_path || data?.still_path}`}
                alt='movie-poster'
                fill
                style={{ objectFit: "cover" }}
                className='poster'
                placeholder='blur'
                blurDataURL={blurPlaceholder}
              />
            </Link>

            <div className="z-[1] pt-1 pr-1">{children}</div>
          </CardImg>
          <RatingTag rating={data?.vote_average} />
        </div>
      </motion.div>
      <CardInfo>
        <InfoTitle>
          {tvData ? (
            <Link passHref href={`/tv/${getCleanTitle(tvData?.id, tvData?.name)}`}>
              {tvData.name}
            </Link>
          ) : (
            data?.title || data?.name
          )}
        </InfoTitle>
        {tvData ? <InfoTitle className='flex flex-wrap !gap-2'>
          <Link passHref href={`/tv/${getCleanTitle(tvData?.id, tvData?.name)}/season/${data?.season_number}`}>
            Season {data?.season_number}
          </Link>
          <svg
            className='w-2 aspect-square text-gray-400'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 6 10'>
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m1 9 4-4-4-4'
            />
          </svg>
          {data?.name}
        </InfoTitle> : null}
        <ReleaseDate>{getReleaseDate(tvData ? data?.air_date : (data?.release_date || data?.first_air_date))}</ReleaseDate>
      </CardInfo>
    </Cards>
  );
};

export default MediaCard;
