import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { getCleanTitle, getReleaseDate } from "src/utils/helper";

const SearchSuggestion = ({ data, type }) => (
  <div className={`p-3 cursor-pointer bg-neutral-700 hover:bg-neutral-600 rounded-lg overflow-hidden transition-colors`}>
    {type === "movie" && (
      <Link href={`/movies/${getCleanTitle(data.id, data.title)}`} passHref>
        <div className='flex items-start gap-3'>
          <div className='relative flex-shrink-0 aspect-[1/1.54] w-16 rounded-md overflow-hidden'>
            <Image
              src={
                data?.poster_path
                  ? `https://image.tmdb.org/t/p/w185${data?.poster_path}`
                  : "/Images/DefaultImage.png"
              }
              alt='poster'
              fill
              style={{ objectFit: "cover" }}
              placeholder='blur'
              blurDataURL={blurPlaceholder}
            />
          </div>
          <div className='flex-grow'>
            <p
              className={`text-sm font-medium mb-1 text-sky-500`}>
              Movie
            </p>

            <p className='text-[15px] font-medium text-neutral-200 line-clamp-2'>
              {data?.title}
            </p>
            <p className='text-sm font-normal text-neutral-200'>
              {getReleaseDate(data?.release_date)}
            </p>
          </div>
        </div>
      </Link>
    )}

    {type === "tv" && (
      <Link href={`/tv/${getCleanTitle(data.id, data.name)}`} passHref>
        <div className='flex items-start gap-3'>
          <div className='relative flex-shrink-0 aspect-[1/1.54] w-16 rounded-md overflow-hidden'>
            <Image
              src={
                data?.poster_path
                  ? `https://image.tmdb.org/t/p/w185${data?.poster_path}`
                  : "/Images/DefaultImage.png"
              }
              alt='poster'
              fill
              style={{ objectFit: "cover" }}
              placeholder='blur'
              blurDataURL={blurPlaceholder}
            />
          </div>
          <div className='flex-grow'>
            <p
              className={`text-sm font-medium mb-1 text-green-500`}>
              TV Show
            </p>

            <p className='text-[15px] font-medium text-neutral-200 line-clamp-2'>
              {data?.name}
            </p>
            <p className='text-sm font-normal text-neutral-200'>
              {getReleaseDate(data?.first_air_date)}
            </p>
          </div>
        </div>
      </Link>
    )}

    {type === "person" && (
      <Link href={`/person/${getCleanTitle(data.id, data.name)}`} passHref>
        <div className='flex items-start gap-3'>
          <div className='relative flex-shrink-0 aspect-[1/1.54] w-16 rounded-md overflow-hidden'>
            <Image
              src={
                data?.profile_path
                  ? `https://image.tmdb.org/t/p/w185${data?.profile_path}`
                  : "/Images/DefaultImage.png"
              }
              alt='poster'
              fill
              style={{ objectFit: "cover" }}
              placeholder='blur'
              blurDataURL={blurPlaceholder}
            />
          </div>
          <div className='flex-grow'>
            <p
              className={`text-sm font-medium mb-1 text-violet-500`}>
              Person
            </p>

            <p className='text-[15px] font-medium text-neutral-200 line-clamp-2'>
              {data?.name}
            </p>
          </div>
        </div>
      </Link>
    )}
  </div>
);

export default SearchSuggestion;
