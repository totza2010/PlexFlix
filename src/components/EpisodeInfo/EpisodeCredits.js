import { CastGrid, CastImg, CastWrapper } from "components/Cast/CastStyles";
import { Span } from "components/MovieInfo/MovieDetailsStyles";
import { TabSelectionTitle, tabStylingSM } from "components/MovieInfo/MovieTabStyles";
import CastSvg from "components/Svg/cast";
import ReviewsSvg from "components/Svg/reviews";
import Tabs from "components/Tabs/Tabs";
import { AnimatePresence, motion } from "framer-motion";
import { blurPlaceholder } from "globals/constants";
import useTabs from "hooks/useTabs";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import {
  getCleanTitle
} from "src/utils/helper";

import {
  ModulesWrapper
} from "styles/GlobalComponents";

const EpisodeCredits = ({ credits }) => {
  const { cast, guest_stars, crew } = credits;
  const tabList2 = [
    {
      key: "cast",
      name: `Cast (${cast?.length})`,
      svg: (active) => <CastSvg color={active ? "white" : "black"} />
    },
    {
      key: "guest_stars",
      name: `Guest Stars (${guest_stars?.length})`,
      svg: (active) => <ReviewsSvg color={active ? "white" : "black"} />
    },
    {
      key: "crew",
      name: `Crew (${crew?.length})`,
      svg: (active) => <ReviewsSvg color={active ? "white" : "black"} />
    }
  ];
  const { activeTab, setTab } = useTabs({ tabLocation: "tvSeasonCreditsTabState", defaultState: "cast" });

  return (
    <Fragment>
      {cast?.length > 0 || guest_stars?.length > 0 || crew?.length > 0 ? (
        <ModulesWrapper className='relative z-10'>
          <Tabs tabList={tabList2} currentTab={activeTab} styling={{ tabStyling: tabStylingSM }}>
            {tabList2.map(({ key, name }) => (
              <TabSelectionTitle key={key} onClick={() => setTab(key)} $active={activeTab === key}>
                {name}
              </TabSelectionTitle>
            ))}
          </Tabs>

          <AnimatePresence mode='wait' initial={false}>
            {activeTab === "cast" && (

              <CastGrid className='justify-start mt-6'>
                {cast?.map((item) => (
                  <CastWrapper key={item.credit_id}>
                    <Link href={`/person/${getCleanTitle(item.id, item.name)}`} passHref>
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          transition: { duration: 0.1 }
                        }}
                        whileTap={{ scale: 0.95 }}>
                        <CastImg className='relative text-center'>
                          <Image
                            src={
                              item.profile_path
                                ? `https://image.tmdb.org/t/p/w276_and_h350_face${item.profile_path}`
                                : "/Images/DefaultAvatar.png"
                            }
                            alt='cast-image'
                            fill
                            style={{ objectFit: "cover", objectPosition: "top" }}
                            placeholder='blur'
                            blurDataURL={blurPlaceholder}
                          />
                        </CastImg>
                      </motion.div>
                    </Link>

                    <div className='mt-3'>
                      <Span className='font-bold movieCastHead line-clamp-2'>
                        {item?.character}
                      </Span>
                      <Span className='movieCastName block'>{item.name}</Span>
                    </div>
                  </CastWrapper>
                ))}
              </CastGrid>
            )}

            {activeTab === "guest_stars" && (

              <CastGrid className='justify-start mt-6'>
                {guest_stars?.map((item) => (
                  <CastWrapper key={item.credit_id}>
                    <Link href={`/person/${getCleanTitle(item.id, item.name)}`} passHref>
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          transition: { duration: 0.1 }
                        }}
                        whileTap={{ scale: 0.95 }}>
                        <CastImg className='relative text-center'>
                          <Image
                            src={
                              item.profile_path
                                ? `https://image.tmdb.org/t/p/w276_and_h350_face${item.profile_path}`
                                : "/Images/DefaultAvatar.png"
                            }
                            alt='cast-image'
                            fill
                            style={{ objectFit: "cover", objectPosition: "top" }}
                            placeholder='blur'
                            blurDataURL={blurPlaceholder}
                          />
                        </CastImg>
                      </motion.div>
                    </Link>

                    <div className='mt-3'>
                      <Span className='font-bold movieCastHead line-clamp-2'>
                        {item?.character}
                      </Span>
                      <Span className='movieCastName block'>{item.name}</Span>
                    </div>
                  </CastWrapper>
                ))}
              </CastGrid>
            )}

            {activeTab === "crew" && (

              <CastGrid className='justify-start mt-6'>
                {crew?.map((item) => (
                  <CastWrapper key={item.credit_id}>
                    <Link href={`/person/${getCleanTitle(item.id, item.name)}`} passHref>
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          transition: { duration: 0.1 }
                        }}
                        whileTap={{ scale: 0.95 }}>
                        <CastImg className='relative text-center'>
                          <Image
                            src={
                              item.profile_path
                                ? `https://image.tmdb.org/t/p/w276_and_h350_face${item.profile_path}`
                                : "/Images/DefaultAvatar.png"
                            }
                            alt='crew-image'
                            fill
                            style={{ objectFit: "cover", objectPosition: "top" }}
                            placeholder='blur'
                            blurDataURL={blurPlaceholder}
                          />
                        </CastImg>
                      </motion.div>
                    </Link>

                    <div className='mt-3'>
                      <Span className='font-bold movieCastHead line-clamp-2'>
                        {item?.name}
                      </Span>
                      <Span className='movieCastName block'>{item.job}</Span>
                      <Span className='movieCastName block episode-count'>
                        {item?.department}
                      </Span>
                    </div>
                  </CastWrapper>
                ))}
              </CastGrid>
            )}
          </AnimatePresence>
        </ModulesWrapper>
      ) : null}
    </Fragment>
  );
};

export default EpisodeCredits;
