import CollectionMedia from "components/Collection/Collection";
import MetaWrapper from "components/MetaWrapper";
import { apiEndpoints } from "globals/constants";
import { Fragment } from "react";
import { fetchOptions, getCleanTitle } from "src/utils/helper";
import { Error404 } from "styles/GlobalComponents";

const Collection = ({ collectionDetails, genreDetails, error }) => {
  return (
    <Fragment>
      <MetaWrapper
        title={error ? "Not Found - PlexFlix" : `${collectionDetails?.name} - plexflix`}
        description={`TV shows produced by ${collectionDetails?.name}.`}
        url={`${process.env.BUILD_URL}/collection/${collectionDetails?.id}-${getCleanTitle(
          collectionDetails?.name
        )}`}
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

Collection.getInitialProps = async (context) => {
  try {
    const { id } = context.query;
    const collectionId = id.split("-")[0];

    const [res, genreRes] = await Promise.all([
      fetch(apiEndpoints.collection.collectionDetails(collectionId), fetchOptions()),
      fetch(apiEndpoints.movie.movieGenreList, fetchOptions())
    ]);

    if (!res.ok) throw new Error("cannot fetch details");

    const [data, genreData] = await Promise.all([res.json(), genreRes.json()]);
  
    // Create a map of genre_id to genre_name
    const genreMap = genreData.genres.reduce((map, genre) => {
      map[genre.id] = genre;
      return map;
    }, {});

    // Get unique genre_ids
    const uniqueGenreIds = [...new Set(data?.parts.flatMap(part => part?.genre_ids || []))];

    // Map genre_ids to genre objects
    const mappedGenres = uniqueGenreIds.map(id => genreMap[id]);
    return {
      collectionDetails: data,
      genreDetails: mappedGenres,
      error: false
    };
  } catch {
    return { error: true };
  }
};

export default Collection;
