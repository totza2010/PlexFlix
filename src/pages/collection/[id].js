import CollectionMedia from "components/Collection/Collection";
import MetaWrapper from "components/MetaWrapper";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import { fetchOptions, getCleanTitle } from "src/utils/helper";
import { Error404 } from "styles/GlobalComponents";

const Collection = ({ collectionDetails, genreDetails, error }) => {

  const expectedUrl = getCleanTitle(collectionDetails?.id, collectionDetails?.name);

  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${collectionDetails?.name} - plexflix`}
        description={`TV shows produced by ${collectionDetails?.name}.`}
        url={`${process.env.BUILD_URL}/collection/${expectedUrl}`}
        image={`https://image.tmdb.org/t/p/original${collectionDetails?.logo_path}`}
      />

      {error ? (
        <Error404>404</Error404>
      ) : (
        <CollectionMedia details={collectionDetails}  genres={genreDetails}/>
      )}
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const collectionId = id.split("-")[0];

    const [collectionRes, genreRes] = await Promise.all([
      fetch(apiEndpoints.collection.collectionDetails(collectionId), fetchOptions()),
      fetch(apiEndpoints.movie.movieGenreList, fetchOptions())
    ]);

    if (!collectionRes.ok || !genreRes.ok) throw new Error("cannot fetch details");

    const [collection, genre] = await Promise.all([
      collectionRes.json(), 
      genreRes.json()
    ]);

    if (!collection) throw new Error("Collection not found");
    const expectedUrl = getCleanTitle(collection?.id, collection?.name);

    if (id !== `${expectedUrl}`) {
      return {
        redirect: {
          destination: `/collection/${expectedUrl}`,
          permanent: false,
        },
      };
    }
  
    const genreMap = genre.genres.reduce((map, genre) => {
      map[genre.id] = genre;
      return map;
    }, {});

    const uniqueGenreIds = [...new Set(collection?.parts.flatMap(part => part?.genre_ids || []))];

    const mappedGenres = uniqueGenreIds.map(id => genreMap[id]);
    return {
      props: {
        collectionDetails: collection,
        genreDetails: mappedGenres,
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

export default Collection;
