import {
  Gradient,
  HeroInfoTitle,
  HeroInfoWrapper
} from "components/MovieInfo/MovieDetailsStyles";
import NextPrev from "components/NextPrev/NextPrev";
import SocialMediaLinks from "components/SocialMediaLinks/SocialMediaLinks";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import {
  getRating,
  getReleaseYear,
  getReleaseDate,
  getRuntime,
  getCleanTitle
} from "src/utils/helper";
import {
  SeasonCommonOverview,
  TrWrapper,
  Pill,
  DetailsHeroWrap,
  HeroDetailsContainer,
  HeroImg,
  HeroImgWrapper
} from "styles/GlobalComponents";

const SeasonDetails = ({ seasonNumber, seasonPoster, seasonName, releaseDate, rating, totalRuntime, overview, tvData }) => {
  const expectedUrl = getCleanTitle(tvData?.id, tvData?.name);
  return (
    <Fragment>
      <HeroDetailsContainer className='relative mb-auto'>
        <NextPrev tvData={tvData} now={seasonNumber} />
        <DetailsHeroWrap className="!min-h-7">
          <HeroImgWrapper>
            <HeroImg className='relative text-center'>
              <Image
                src={
                  seasonPoster
                    ? `https://image.tmdb.org/t/p/w500${seasonPoster}`
                    : "/Images/DefaultImage.png"
                }
                alt='TV-season-poster'
                fill
                style={{ objectFit: "cover" }}
                placeholder='blur'
                blurDataURL={blurPlaceholder}
              />
            </HeroImg>
          </HeroImgWrapper>

          <Gradient />

          <HeroInfoWrapper className='max-w-5xl'>
            <HeroInfoTitle className='mb-2'>
              <Link passHref href={`/tv/${expectedUrl}`}>
                {tvData?.name} ({getReleaseYear(tvData?.first_air_date)})
              </Link>
            </HeroInfoTitle>
            <div>

              <TrWrapper className='flex-wrap !gap-0'>
                <h4 className='font-semibold text-[1.25rem]'>{seasonName}</h4>

                <SocialMediaLinks
                  links={{}}
                  homepage={null}
                  mediaDetails={{
                    title: seasonName,
                    description: overview
                  }}
                  className='!justify-start'
                />
              </TrWrapper>

              <TrWrapper className='flex-wrap mt-2'>
                <h3 className='text-[1.25rem] m-0 font-semibold'>
                  {getReleaseDate(releaseDate)}
                </h3>

                <Pill>
                  <p>{getRating(rating)}</p>
                </Pill>

                <h3 className='font-semibold text-[1.25rem]'>{getRuntime(totalRuntime)}</h3>
              </TrWrapper>

              {overview && <SeasonCommonOverview>{overview}</SeasonCommonOverview>}
            </div>
          </HeroInfoWrapper>
        </DetailsHeroWrap>
      </HeroDetailsContainer>
    </Fragment>
  );
};

export default SeasonDetails;
