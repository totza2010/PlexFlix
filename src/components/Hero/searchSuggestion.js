import Link from "next/link";
import { Fragment } from "react";
import { getCleanTitle, getReleaseYear, getReleaseDate } from "src/utils/helper";
import { Anchor, SearchSlice } from "./HeroStyles";
import Image from "next/image";
import { blurPlaceholder } from "globals/constants";

const SearchSuggestion = ({ data, type, ...props }) => (
  <div className={`p-3 cursor-pointer bg-neutral-700 hover:bg-neutral-600 rounded-lg overflow-hidden transition-colors`}>
    {type === "movie" && (
      <Link href={`/movies/${getCleanTitle(data.id, data.title)}`} passHref>
        {/* <Anchor {...props}>
          <SearchSlice>
            <h5 className='suggestion-title'>
              {data.title}{" "}
              {data.release_date && `(${getReleaseYear(data.release_date.toString())})`}
            </h5>

            <h6 className='tag text-base'>Movie</h6>
          </SearchSlice>
        </Anchor> */}
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
        {/* <Anchor {...props}>
          <SearchSlice>
            <h5 className='suggestion-title'>
              {data.name}{" "}
              {data.first_air_date && `(${getReleaseYear(data.first_air_date.toString())})`}
            </h5>

            <h6 className='tag text-base'>TV</h6>
          </SearchSlice>
        </Anchor> */}
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
        {/* <Anchor {...props}>
          <SearchSlice>
            <h5 className='suggestion-title'>
              {data.name}{" "}
              {data.first_air_date && `(${getReleaseYear(data.first_air_date.toString())})`}
            </h5>

            <h6 className='tag text-base'>Person</h6>
          </SearchSlice>
        </Anchor> */}
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
            {/* <p className='text-sm font-normal text-neutral-200'>
              {getReleaseDate(data?.first_air_date)}
            </p> */}
          </div>
        </div>
      </Link>
    )}
  </div>
);

export default SearchSuggestion;
