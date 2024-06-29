import KeywordMedia from "components/Explore/KeywordMedia";
import MetaWrapper from "components/MetaWrapper";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import { fetchOptions, getCleanTitle } from "src/utils/helper";
import { Error404 } from "styles/GlobalComponents";

const Keywords = ({ Movies, TV, keyword, error }) => {

  const expectedUrl = getCleanTitle(keyword.id, keyword.name);

  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${keyword.name} - Movies or TVs`}
        description={error ? "Not Found" : `Movies or TVs matching the keyword: ${keyword.name}`}
        url={`${process.env.BUILD_URL}/keywords/${expectedUrl}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <KeywordMedia Movies={Movies} TV={TV} keyword={keyword} />
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const keywordId = id.split("-")[0];

    const [keywordRes] = await Promise.all([
      fetch(apiEndpoints.keywords.keyword(keywordId), fetchOptions())
    ]);

    if (
      !keywordRes.ok
    ) throw new Error("Failed to fetch data");

    const [keyword] = await Promise.all([
      keywordRes.json()
    ]);

    if (!keyword) throw new Error("Keyword not found");
    const expectedUrl = getCleanTitle(keyword?.id, keyword?.name);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/keywords/${expectedUrl}`,
          permanent: false,
        },
      };
    }

    const [MovieRes, TvRes] = await Promise.all([
      fetch(apiEndpoints.keywords.keywordMovie({ keywordId }), fetchOptions()),
      fetch(apiEndpoints.keywords.keywordTv({ keywordId }), fetchOptions())
    ]);

    if (
      !MovieRes.ok ||
      !TvRes.ok
    ) throw new Error("Failed to fetch data");

    const [Movies, TV] = await Promise.all([
      MovieRes.json(),
      TvRes.json()
    ]);

    return {
      props: {
        Movies,
        TV,
        keyword: keyword || [],
        error: false
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
