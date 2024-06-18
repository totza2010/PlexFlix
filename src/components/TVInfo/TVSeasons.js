import {
  CardImg,
  CardInfo,
  Cards,
  CardsContainerGrid,
  InfoTitle,
  ReleaseDate
} from "components/MediaTemplate/TemplateStyles";
import PlaceholderText from "components/PlaceholderText";
import RatingTag from "components/RatingTag/RatingTag";
import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
const TVSeasons = ({ seasons }) => {
  const router = useRouter();
  const today = new Date();

  return (
    <Fragment>
      {seasons?.length > 0 ? (
        <CardsContainerGrid>
          {seasons.map(
            ({ id, season_number, poster_path, name, episode_count, air_date, vote_average }) => (
              <Cards key={id}>
                <motion.div
                  key={id}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.1 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={"max-w-5xl m-auto [&:not(:last-child)]:mb-5"}>
                  <Link href={`${router.query.id}/season/${season_number}`} passHref scroll={false}>
                    <div className='relative'>
                      <CardImg>
                        <Image
                          src={
                            poster_path
                              ? `https://image.tmdb.org/t/p/w185${poster_path}`
                              : "/Images/DefaultImage.png"
                          }
                          alt='TV-season-poster'
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
                  <InfoTitle>
                    {name}
                    {today < new Date(air_date) && today !== new Date(air_date)
                      ? " (Upcoming)"
                      : ""}
                  </InfoTitle>
                  <ReleaseDate>{episode_count} Episodes</ReleaseDate>
                </CardInfo>
              </Cards>
            )
          )}
        </CardsContainerGrid>
      ) : (
        <PlaceholderText>TBA</PlaceholderText>
      )}
    </Fragment>
  );
};

export default TVSeasons;
