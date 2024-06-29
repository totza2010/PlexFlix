import KeywordsTab from "components/keywordsTab/keywordsTab";
import { PostersImg } from "components/Posters/PostersStyles";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { ModulesWrapper } from "styles/GlobalComponents";
import { NetwrokDetailsWrapper, PostersGrid } from "./ExploreStyles";

const KeywordMedia = ({ Movies, TV, keyword }) => {
  const [shuffledPosters, setShuffledPosters] = useState([]);
  useEffect(() => {
    const tvPosters = TV?.results?.map(({ poster_path }) =>
      poster_path
        ? `https://image.tmdb.org/t/p/w185${poster_path}`
        : "/Images/DefaultImage.png"
    );
    const moviePosters = Movies?.results?.map(({ poster_path }) =>
      poster_path
        ? `https://image.tmdb.org/t/p/w185${poster_path}`
        : "/Images/DefaultImage.png"
    );

    if (tvPosters.length % 2 !== 0 && tvPosters.length > 10) {
      tvPosters.pop();
    }

    if (moviePosters.length % 2 !== 0 && moviePosters.length > 10) {
      moviePosters.pop();
    }
    let combinedPosters = [...tvPosters, ...moviePosters];

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    combinedPosters = shuffleArray(combinedPosters);
    setShuffledPosters(combinedPosters);
  }, [Movies, TV]);

  let colCount;
  const postersLength = shuffledPosters?.length;

  if (postersLength > 10) {
    colCount =
      Math.ceil(postersLength / 2) % 2 === 0
        ? Math.ceil(postersLength / 2)
        : Math.ceil(postersLength / 2) + 1;
  } else {
    colCount = postersLength;
  }

  return (
    <Fragment>
      <NetwrokDetailsWrapper>
        {postersLength > 0 ? (
          <PostersGrid
            className={postersLength <= 10 ? "alt-grid" : ""}
            style={{ "--colCount": colCount || 10 }}
          >
            {shuffledPosters.map((poster, i) => (
              <PostersImg key={`item -${i}`} className="relative poster-wrapper"
                style={{ "--aspectRatio": 2/3 }}>
                <Image
                  src={poster}
                  alt={`${keyword?.name}-poster`}
                  fill
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                  loading="eager"
                  blurDataURL={blurPlaceholder}
                />
              </PostersImg>
            ))}
          </PostersGrid>
        ) : null}

        <div className="text-center network-info p-8 mb-4">
          <div
            className="m-auto text-[calc(1.325rem_+_.9vw)] lg:text-[4rem] leading-8 mt-14 mb-6 font-semibold block"
          >
            <span className="font-bold">{keyword.name}</span>
          </div>

          <div className="details-row">
            <div className="flex items-center">
              <span className="font-bold">{`${Movies?.total_results + TV?.total_results} Items`}</span>
            </div>
          </div>
        </div>
      </NetwrokDetailsWrapper>

      <ModulesWrapper>
        <KeywordsTab moviesData={Movies} TVData={TV} keyword={keyword} />
      </ModulesWrapper>
    </Fragment>
  );
};

export default KeywordMedia;
