import { motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { getCleanTitle } from "src/utils/helper";
import {
  CollectionDetailsWrapper,
  CollectionsOverview,
  CollectionImg,
  CollectionInfoWrapper,
  CollectionsRelease,
  CollectionTitle,
  CollectionWrapper
} from "./MovieCollectionStyle";

const MovieCollection = ({ collection }) => {

  return (
    <Fragment>
      <motion.div
              whileTap={{ scale: 0.98 }}
              className={"max-w-5xl m-auto [&:not(:last-child)]:mb-5"}>
              <Link href={`/collection/${getCleanTitle(collection.id, collection?.title || collection?.name)}`} passHref scroll={false}>
                <CollectionWrapper>
                  <CollectionImg>
                    <Image
                      src={
                        collection.poster_path
                          ? `https://image.tmdb.org/t/p/w185${collection.poster_path}`
                          : "/Images/DefaultImage.png"
                      }
                      alt='TV-season-poster'
                      fill
                      style={{ objectFit: "cover" }}
                      placeholder='blur'
                      blurDataURL={blurPlaceholder}
                    />
                  </CollectionImg>

                  <CollectionInfoWrapper>
                    <div>
                      <CollectionTitle className='max-sm:mb-1'>
                        {collection.name}
                      </CollectionTitle>
                      <CollectionDetailsWrapper>
                        <CollectionsRelease>{collection?.parts?.length} Movies</CollectionsRelease>
                      </CollectionDetailsWrapper>
                      {<CollectionsOverview>{collection?.overview}</CollectionsOverview>}
                    </div>
                  </CollectionInfoWrapper>
                </CollectionWrapper>
              </Link>
            </motion.div>
    </Fragment>
  );
};

export default MovieCollection;
