import Link from "next/link";
import {
  getReleaseYear,
  getCleanTitle
} from "src/utils/helper";
import { Section, Next, Prev } from "./NextPrevStyles";

const NextPrev = ({ tvData, seasonData = null, now }) => {
  // Trouver l'index de la saison actuelle
  const { seasons } = tvData;
  const episodes = seasonData ? seasonData.episodes : null;

  const expectedUrl = getCleanTitle(tvData?.id, tvData?.name);

  // Si des épisodes sont fournis, ajouter la logique pour les épisodes
  let currentEpisodeIndex, prevEpisode, nextEpisode, currentSeasonIndex, prevSeason, nextSeason;
  if (episodes) {
    currentEpisodeIndex = episodes.findIndex(episode => episode.episode_number === now);
    prevEpisode = currentEpisodeIndex > 0 ? episodes[currentEpisodeIndex - 1] : null;
    nextEpisode = currentEpisodeIndex < episodes.length - 1 ? episodes[currentEpisodeIndex + 1] : null;

    currentSeasonIndex = seasons.findIndex(season => season.season_number === seasonData.season_number);
    if (!prevEpisode) {
      prevSeason = currentSeasonIndex > 0 ? seasons[currentSeasonIndex - 1] : null;
    }

    if (!nextEpisode) {
      nextSeason = currentSeasonIndex < seasons.length - 1 ? seasons[currentSeasonIndex + 1] : null;
    }
  } else {
    currentSeasonIndex = seasons.findIndex(season => season.season_number === now);
    prevSeason = currentSeasonIndex > 0 ? seasons[currentSeasonIndex - 1] : null;
    nextSeason = currentSeasonIndex < seasons.length - 1 ? seasons[currentSeasonIndex + 1] : null;
  }

  return (
    <Section className='flex mb-4' aria-label='Next Previous'>
      <Prev>
        {prevSeason && (
          <Link className="inline-flex gap-2 flex-wrap" passHref href={`/tv/${expectedUrl}/season/${prevSeason.season_number}`}>
            <svg
              className='w-[0.65rem] md:w-3 aspect-square text-gray-400'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 6 10'
              transform='scale(-1, 1)'>
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m1 9 4-4-4-4'
              />
            </svg>
            <p className="inline-flex items-center text-sm sm:text-base font-semibold hover:text-white transition-colors text-neutral-200">{`${prevSeason.name} (${getReleaseYear(prevSeason.air_date)})`}</p>
          </Link>
        )}
        {prevEpisode && (
          <Link className="inline-flex gap-2 flex-wrap" passHref href={`/tv/${expectedUrl}/season/${prevEpisode.season_number}/episode/${prevEpisode.episode_number}`}>
            <svg
              className='w-[0.65rem] md:w-3 aspect-square text-gray-400'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 6 10'
              transform='scale(-1, 1)'>
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m1 9 4-4-4-4'
              />
            </svg>
            <p className="inline-flex items-center text-sm sm:text-base font-semibold hover:text-white transition-colors text-neutral-200">{`${prevEpisode.name} (${getReleaseYear(prevEpisode.air_date)})`}</p>
          </Link>
        )}
      </Prev>

      <Next>
        {nextSeason && (
          <Link className="inline-flex gap-2 flex-wrap" passHref href={`/tv/${expectedUrl}/season/${nextSeason.season_number}`}>
            <p className="inline-flex items-center text-sm sm:text-base font-semibold hover:text-white transition-colors text-neutral-200">{`${nextSeason.name} (${getReleaseYear(nextSeason.air_date)})`}</p>
            <svg
              className='w-[0.65rem] md:w-3 aspect-square text-gray-400'
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
          </Link>
        )}
        {nextEpisode && (
          <Link className="inline-flex gap-2 flex-wrap" passHref href={`/tv/${expectedUrl}/season/${nextEpisode.season_number}/episode/${nextEpisode.episode_number}`}>
            <p className="inline-flex items-center text-sm sm:text-base font-semibold hover:text-white transition-colors text-neutral-200">{`${nextEpisode.name} (${getReleaseYear(nextEpisode.air_date)}) `}</p>
            <svg
              className='w-[0.65rem] md:w-3 aspect-square text-gray-400'
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
          </Link>
        )}
      </Next>
    </Section>
  );
};

export default NextPrev;
