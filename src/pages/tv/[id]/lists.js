import DominantColor from "components/DominantColor/DominantColor";
import MetaWrapper from "components/MetaWrapper";
import { HeroInfoTitle } from "components/MovieInfo/MovieDetailsStyles";
import PlaceholderText from "components/PlaceholderText";
import Recommendations from "components/Recommendations/Recommendations";
import { AnimatePresence, motion } from "framer-motion";
import { apiEndpoints } from "globals/constants";
import useInfiniteQuery from "hooks/useInfiniteQuery";
import { Fragment } from "react";
import {
    fetchOptions,
    framerTabVariants,
    getCleanTitle,
    removeDuplicates,
    getReleaseYear,
} from "src/utils/helper";
import { Error404, LayoutContainer } from "styles/GlobalComponents";

const Lists = ({ error, lists, tv }) => {
    const { list } = useInfiniteQuery({
        type: "tvLists",
        initialPage: 2,
        tvId: tv?.id,
    });

    const { cleanedItems } = removeDuplicates(
        (lists?.results ?? [])?.concat(list)
    );
    //   const renderList = lists.concat(infiniteQueryLists);

    return (
        <Fragment>
            <MetaWrapper
                title={
                    error
                        ? "Not Found - PlexFlix"
                        : `${tv?.name} (${getReleaseYear(
                            tv?.release_date
                        )}) - Lists - plexflix`
                }
                description={error ? "Not Found" : `${tv?.name} lists`}
                image={`https://image.tmdb.org/t/p/w780${tv?.backdrop}`}
                url={`${process.env.BUILD_URL}/tv/${getCleanTitle(
                    tv?.id,
                    tv?.name
                )}/lists`}
            />

            {error ? (
                <Error404>404</Error404>
            ) : (
                <LayoutContainer className="relative list-wrapper grow">
                    <DominantColor image={tv?.poster} flip tint />

                    <div className="relative z-20">
                        <AnimatePresence mode="wait">
                            {
                                <motion.div
                                    key={`isCreateMode-false`}
                                    variants={framerTabVariants}
                                    initial={false}
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <div className="text-center py-6">
                                        <HeroInfoTitle className="mb-4">
                                            {tv?.name} ({getReleaseYear(tv?.first_air_date)})
                                        </HeroInfoTitle>

                                        <div className="flex justify-between items-center py-2 max-sm:flex-col gap-5">
                                            <h3 className="mb-0 text-2xl md:text-3xl font-semibold">{`Lists (${lists.total_results})`}</h3>
                                        </div>
                                    </div>

                                    {cleanedItems?.length > 0 ? (
                                        <Recommendations data={cleanedItems} type="lists" />
                                    ) : (
                                        <PlaceholderText height="large">
                                            You don&apos;t have any lists yet. <br /> Click on the
                                            button above to create one.
                                        </PlaceholderText>
                                    )}
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                </LayoutContainer>
            )}
        </Fragment>
    );
};

export const getServerSideProps = async (ctx) => {
    try {
        const { id } = ctx.query;
        const tvId = id.split("-")[0];

        const [tvRes, listsRes] = await Promise.all([
            fetch(apiEndpoints.tv.tvDetails(tvId), fetchOptions()),
            fetch(apiEndpoints.lists.getTVLists({ tvId }), fetchOptions()),
        ]);

        if (!tvRes.ok) {
            const errorDetails = await tvRes.text();
            throw new Error(
                `Failed to fetch movie details: ${tvRes.status} - ${errorDetails}`
            );
        }

        if (!listsRes.ok) {
            const errorDetails = await listsRes.text();
            throw new Error(
                `Failed to fetch list details: ${listsRes.status} - ${errorDetails}`
            );
        }

        const [tv, lists] = await Promise.all([
            tvRes.json(),
            listsRes.json(),
        ]);

        if (!tv) throw new Error("Movie not found");

        const expectedUrl = getCleanTitle(tv?.id, tv?.name);

        if (id !== `${expectedUrl}`) {
            return {
                redirect: {
                    destination: `/tv/${expectedUrl}/lists`,
                    permanent: false,
                },
            };
        }

        return {
            props: {
                error: false,
                lists: lists || [],
                tv,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                error: true,
                lists: [],
            },
        };
    }
};

export default Lists;
