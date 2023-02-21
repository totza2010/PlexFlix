import MetaWrapper from 'components/MetaWrapper';
import {
  SeasonInfoMain,
  SeasonInfoWrapper,
  SeasonsRelease,
  SeasonTitle
} from 'components/TVInfo/TVStyles';
import { apiEndpoints } from 'globals/constants';
import Image from 'next/image';
import { Fragment, useCallback } from 'react';
import {
  EpisodeImg,
  Error404,
  SeasonCommonOverview,
  SeasonEpisodesWrapper,
  SeasonExpandedContainer,
  SeasonShowcaseImg,
  SeasonShowcaseTitle,
  SeasonShowcaseWrapper,
  TrWrapper,
  Rating
} from 'styles/GlobalComponents';

const Seasons = ({ error, data, tvId, seasonNumber }) => {
  const getYear = useCallback((date) => {
    const year = !date ? 'TBA' : new Date(date).getFullYear();
    return year;
  }, []);

  const getReleaseDate = useCallback((date) => {
    const releaseDate = !date
      ? 'TBA'
      : new Date(date.toString()).toDateString().slice(4, -5) +
        ', ' +
        new Date(date.toString()).getFullYear();

    return releaseDate;
  }, []);

  const getRating = useCallback((rating) => {
    const vote = !rating ? 'NR' : Number.parseFloat(rating).toFixed(1);

    return vote;
  }, []);

  return (
    <Fragment>
      <MetaWrapper
        title={!error ? data.name : 'Not Found - Cinephiled'}
        description={data?.overview}
        image={`https://image.tmdb.org/t/p/w780${data?.poster_path}`}
        url={`https://cinephiled.vercel.app/tv/${tvId}/season/${seasonNumber}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <SeasonExpandedContainer>
          <SeasonShowcaseWrapper>
            <SeasonShowcaseImg className='position-relative text-center'>
              <Image
                src={
                  data.poster_path
                    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                    : '/Images/DefaultImage.png'
                }
                alt='TV-season-poster'
                layout='fill'
                objectFit='cover'
                placeholder='blur'
                blurDataURL='data:image/webp;base64,UklGRgwCAABXRUJQVlA4WAoAAAAgAAAAAQAAAgAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggHgAAAJABAJ0BKgIAAwAHQJYlpAAC51m2AAD+5R4qGAAAAA=='
              />
            </SeasonShowcaseImg>

            <div>
              <SeasonShowcaseTitle>
                {data.name} ({getYear(data.air_date)})
              </SeasonShowcaseTitle>
              {data.overview && (
                <SeasonCommonOverview>{data.overview}</SeasonCommonOverview>
              )}
            </div>
          </SeasonShowcaseWrapper>
          {data.episodes.length > 0 && (
            <SeasonEpisodesWrapper>
              <span className='episodesTitle'>
                Episodes ({data.episodes.length})
              </span>
              {data.episodes.map((item, i) => (
                <SeasonShowcaseWrapper
                  className='my-5 episodesBox'
                  key={item.id}
                >
                  <EpisodeImg className='position-relative text-center'>
                    <Image
                      src={
                        item.still_path
                          ? `https://image.tmdb.org/t/p/w500${item.still_path}`
                          : '/Images/DefaultImage.png'
                      }
                      alt='TV-season-episode-poster'
                      layout='fill'
                      objectFit='cover'
                      placeholder='blur'
                      blurDataURL='data:image/webp;base64,UklGRgwCAABXRUJQVlA4WAoAAAAgAAAAAQAAAgAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggHgAAAJABAJ0BKgIAAwAHQJYlpAAC51m2AAD+5R4qGAAAAA=='
                    />
                  </EpisodeImg>
                  <SeasonInfoWrapper className='ipRes'>
                    <SeasonInfoMain>
                      <SeasonTitle className='text'>
                        {!item.episode_number ? i : item.episode_number}.{' '}
                        {item.name}
                      </SeasonTitle>
                      <TrWrapper>
                        <SeasonsRelease className='text airDate'>
                          {getReleaseDate(item.air_date)}
                        </SeasonsRelease>
                        <Rating>
                          <p>{getRating(item.vote_average)}</p>
                        </Rating>
                      </TrWrapper>
                      {item.overview && (
                        <SeasonCommonOverview>
                          {item.overview}
                        </SeasonCommonOverview>
                      )}
                    </SeasonInfoMain>
                  </SeasonInfoWrapper>
                </SeasonShowcaseWrapper>
              ))}
            </SeasonEpisodesWrapper>
          )}
        </SeasonExpandedContainer>
      )}
    </Fragment>
  );
};

Seasons.getInitialProps = async (ctx) => {
  try {
    const response = await fetch(
      apiEndpoints.tv.tvSeasonDetails({
        id: ctx.query.id,
        seasonNumber: ctx.query.sn
      })
    );

    const error = response.ok ? false : true;

    if (error) {
      throw Error('cannot fetch data');
    } else {
      const res = await response.json();

      return {
        error,
        data: res,
        tvId: ctx.query.id,
        seasonNumber: ctx.query.sn
      };
    }
  } catch {
    return { error: true };
  }
};

export default Seasons;
