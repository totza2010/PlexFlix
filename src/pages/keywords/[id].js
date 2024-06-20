import MetaWrapper from "components/MetaWrapper";
import PlaceholderText from "components/PlaceholderText";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import KeywordsTab from "components/keywordsTab/keywordsTab";
import { fetchOptions, getCleanTitle } from "src/utils/helper";
import { Error404, ModulesWrapper } from "styles/GlobalComponents";
import { Span } from "components/MovieInfo/MovieDetailsStyles";

const Keywords = ({ error, resultMovies, resultTvs, keyword }) => {
  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${keyword.name} - Movies or TVs`}
        description={error ? "Not Found" : `Movies or TVs matching the keyword: ${keyword.name}`}
        url={`${process.env.BUILD_URL}/keywords/${keyword?.id}-${getCleanTitle(keyword?.name)}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <ModulesWrapper className='mt-6'>
            {resultMovies?.results?.length > 0 || resultTvs?.results?.length > 0 ? (
              <Fragment>
                <Span className='block text-[calc(1.325rem_+_.9vw)] lg:text-[2rem] font-medium text-center'>
                  Keywords: {keyword.name}
                </Span>
                <KeywordsTab
                  moviesData={resultMovies}
                  TVData={resultTvs}
                  keyword={keyword}
                />
              </Fragment>
            ) : (
              <PlaceholderText height='large'>No Movie results for this keyword.</PlaceholderText>
            )}
        </ModulesWrapper>
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const keywordId = id.split("-")[0];

    const keywordRes = await fetch(apiEndpoints.keywords.keywordDetails(keywordId), fetchOptions());

    if (!keywordRes.ok) throw new Error("Failed to fetch data");

    const keyword = await keywordRes.json();

    if (id !== `${keyword.id}-${getCleanTitle(keyword.name)}`) {
      return {
        redirect: {
          destination: `/keywords/${keyword.id}-${getCleanTitle(keyword.name)}`,
          permanent: false,
        },
      };
    }

    const [MovieRes, TvRes] = await Promise.all([
      fetch(apiEndpoints.keywords.keywordMovieDetails({ keywordId }), fetchOptions()),
      fetch(apiEndpoints.keywords.keywordTvDetails({ keywordId }), fetchOptions())
    ]);

    if (!MovieRes.ok || !TvRes.ok) throw new Error("Failed to fetch data");

    const [resultMovies, resultTvs] = await Promise.all([
      MovieRes.json(),
      TvRes.json()
    ]);

    return {
      props: {
        error: false,
        resultMovies,
        resultTvs,
        keyword
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: { error: true }
    };
  }
};

export default Keywords;
