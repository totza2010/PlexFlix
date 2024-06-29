import MetaWrapper from "components/MetaWrapper";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import { fetchOptions, getCleanTitle } from "src/utils/helper";
import { Error404 } from "styles/GlobalComponents";
import CompanyMedia from "components/Explore/CompanyMedia";

const Keywords = ({ Movies, TV, company, error }) => {
  const tvPosters = Movies?.results?.map(({ poster_path }) =>
    poster_path
      ? `https://image.tmdb.org/t/p/w185${poster_path}`
      : "/Images/DefaultImage.png"
  );
  const moviePosters = Movies?.results?.map(({ poster_path }) =>
    poster_path
      ? `https://image.tmdb.org/t/p/w185${poster_path}`
      : "/Images/DefaultImage.png"
  );

  if (moviePosters.length % 2 !== 0 && moviePosters.length > 10) {
    moviePosters.pop();
  }

  let colCount;
  const postersLength = moviePosters?.length;

  if (postersLength > 10) {
    colCount =
      Math.ceil(postersLength / 2) % 2 === 0
        ? Math.ceil(postersLength / 2)
        : Math.ceil(postersLength / 2) + 1;
  } else {
    colCount = postersLength;
  }

  const expectedUrl = getCleanTitle(company.id, company.name);

  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${company.name} - Movies or TVs`}
        description={error ? "Not Found" : `Movies or TVs matching the keyword: ${company.name}`}
        url={`${process.env.BUILD_URL}/company/${expectedUrl}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <CompanyMedia Movies={Movies} TV={TV} company={company} />
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const companyId = id.split("-")[0];

    const [companyRes] = await Promise.all([
      fetch(apiEndpoints.company.companyDetails(companyId), fetchOptions())
    ]);

    if (
      !companyRes.ok
    ) throw new Error("Failed to fetch data");

    const [company] = await Promise.all([
        companyRes.json()
    ]);

    if (!company) throw new Error("Company not found");
    const expectedUrl = getCleanTitle(company?.id, company?.name);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/company/${expectedUrl}`,
          permanent: false,
        },
      };
    }

    const [MovieRes, TvRes] = await Promise.all([
      fetch(apiEndpoints.company.companyMoviesMedia({ id: companyId }), fetchOptions()),
      fetch(apiEndpoints.company.companyTvMedia({ id: companyId }), fetchOptions())
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
        company: company || [],
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
