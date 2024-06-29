import DominantColor from "components/DominantColor/DominantColor";
import MoviesTemplate from "components/MediaTemplate/MoviesTemplate";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import {
  ModulesWrapper,
  DetailsCollectionHeroWrap,
  HeroBg,
  HeroBgContainer,
  HeroDetailsContainer,
  HeroImg,
  HeroImgWrapper
} from "styles/GlobalComponents";
import {
  Divider,
  Rounded,
  GenreWrap,
  HeroInfoWrapper,
  HeroInfoTitle,
  RtoR,
  Span,
  ReleaseDateWrapper,
  Overview,
  Gradient
} from "./CollectionStyles";

const Collection = ({ details, genres }) => {

  return (
    <Fragment>
      <HeroDetailsContainer className='relative mb-auto'>
        <HeroBgContainer className='absolute'>
          <HeroBg className='absolute text-center'>
            <Image
              src={
                details?.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${details?.backdrop_path}`
                  : "/Images/Hex.webp"
              }
              alt='movie-backdrop'
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </HeroBg>

          {/* color gradient overlay */}
          <DominantColor image={details?.poster_path} />
        </HeroBgContainer>
        <DetailsCollectionHeroWrap>
          <HeroImgWrapper>
            <HeroImg className='relative text-center'>
              <Image
                src={
                  details?.poster_path
                    ? `https://image.tmdb.org/t/p/w500${details?.poster_path}`
                    : "/Images/DefaultImage.png"
                }
                alt='movie-poster'
                fill
                style={{ objectFit: "cover" }}
                priority
                placeholder='blur'
                blurDataURL={blurPlaceholder}
              />
            </HeroImg>
          </HeroImgWrapper>
          <Gradient />
          <HeroInfoWrapper className='max-w-5xl'>
            <HeroInfoTitle className='mb-2'>
              {details?.name}
            </HeroInfoTitle>
            <RtoR className='my-4'>
              <ReleaseDateWrapper>
                <Span className='font-medium'>{details?.parts.length} Movies</Span>
              </ReleaseDateWrapper>
              {genres?.length > 0 ? (
                <GenreWrap className='font-bold'>
                  <Divider />
                  {genres?.map((item, i) => (
                    <Link
                      key={item.id}
                      href={`/genre/${
                        item.id.toString() + "-" + item.name.replaceAll(" ", "-")
                      }/movies`}
                      passHref
                      scroll={false}>
                      <Rounded className={genres?.length == i + 1 ? "sep" : ""}>{item.name}</Rounded>
                    </Link>
                  ))}
                  <Divider />
                </GenreWrap>
              ) : null}
            </RtoR>
            {details?.overview ? <Overview className='font-normal'>{details?.overview}</Overview> : null}
            {/* {rating ? (
              <RatingWrapper>
                <Fragment>
                  <Span className='text-[calc(1.525rem_+_3.3vw)] xl:text-6xl font-bold'>
                    {getRating(rating)}
                  </Span>
                  <span> / 10</span>
                </Fragment>
              </RatingWrapper>
            ) : null} */}

        </HeroInfoWrapper>
        </DetailsCollectionHeroWrap>
      <ModulesWrapper>
        <MoviesTemplate movies={details.parts} />
      </ModulesWrapper>
      </HeroDetailsContainer>
    </Fragment>
  );
};

export default Collection;
