import MetaWrapper from "components/MetaWrapper";
import PersonDetails from "components/PersonDetails/PersonDetails";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import { fetchOptions, getCleanTitle } from "src/utils/helper";
import { Error404 } from "styles/GlobalComponents";

const Person = ({ error, person }) => {
  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${person.name} - PlexFlix`}
        image={`https://image.tmdb.org/t/p/w780${person?.profile_path}`}
        description={person?.biography}
        url={`${process.env.BUILD_URL}/person/${getCleanTitle(person?.id, 
          person?.name
        )}`}
      />

      {error ? <Error404>404</Error404> : <PersonDetails details={person} />}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const personId = id.split("-")[0];

    const [personRes] = await Promise.all([
      fetch(apiEndpoints.person.personDetails(personId), fetchOptions())
    ]);

    if (!personRes.ok) {
      const errorDetails = await personRes.text();
      throw new Error(`Failed to fetch personRes details: ${personRes.status} - ${errorDetails}`);
    }

    const [person] = await Promise.all([
      personRes.json()
    ]);

    if (!person) throw new Error("person not found");

    const expectedUrl = getCleanTitle(person?.id, person?.name);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/person/${expectedUrl}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        person,
        error: false
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: true
      }
    };
  }
};

export default Person;
