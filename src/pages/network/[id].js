import NetworkMedia from "components/Explore/NetworkMedia";
import MetaWrapper from "components/MetaWrapper";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import { fetchOptions, getCleanTitle } from "src/utils/helper";
import { Error404 } from "styles/GlobalComponents";

const Network = ({ networkDetails, networkMedia, error }) => {
  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${networkDetails?.name} - plexflix`}
        description={`TV shows produced by ${networkDetails?.name}.`}
        url={`${process.env.BUILD_URL}/network/${getCleanTitle(networkDetails?.id, 
          networkDetails?.name
        )}`}
        image={`https://image.tmdb.org/t/p/original${networkDetails?.logo_path}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <NetworkMedia media={networkMedia} details={networkDetails} />
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const networkId = id.split("-")[0];

    const [networkRes, networkMedia] = await Promise.all([
      fetch(apiEndpoints.network.networkDetails(networkId), fetchOptions()),
      fetch(apiEndpoints.network.networkMedia({ id: networkId }), fetchOptions())
    ]);

    if (!networkRes.ok) {
      const errorDetails = await networkRes.text();
      throw new Error(`Failed to fetch networkRes details: ${networkRes.status} - ${errorDetails}`);
    }

    const [network, networkMediaData] = await Promise.all([
      networkRes.json(), 
      networkMedia.json()
    ]);

    if (!network) throw new Error("List not found");

    const expectedUrl = getCleanTitle(network?.id, network?.name);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/network/${expectedUrl}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
      networkDetails: network,
      networkMedia: networkMediaData || [],
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

export default Network;
