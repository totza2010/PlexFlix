import MediaTab from "components/MovieInfo/MediaTab";
import { TabSelectionTitle, tabStyling, TabIcon } from "components/MovieInfo/MovieTabStyles";
import SeasonCredits from "components/SeasonsInfo/SeasonCredits";
import SeasonEpisodes from "components/SeasonsInfo/SeasonEpisodes";
import BackdropsSvg from "components/Svg/backdrops";
import CastSvg from "components/Svg/cast";
import ReviewsSvg from "components/Svg/reviews";
import Tabs from "components/Tabs/Tabs";
import { AnimatePresence, motion } from "framer-motion";
import useTabs from "hooks/useTabs";
import { Fragment } from "react";
import { framerTabVariants } from "src/utils/helper";
import { ModulesWrapper } from "styles/GlobalComponents";

const SeasonTab = ({ credits, images, videos, episodes, ShowId, ShowName, seasonNumber }) => {
  const { cast, crew } = credits;

  const tabList = [
    {
      key: "episodes",
      name: `Episodes (${episodes?.length})`,
      svg: (active) => <CastSvg color={active ? "white" : "black"} />
    },
    {
      key: "credits",
      name: `Credits (${cast?.length + crew?.length})`,
      svg: (active) => <ReviewsSvg color={active ? "white" : "black"} />
    },
    {
      key: "images",
      name: `Images (${images?.posters?.length ?? 0 + images?.backdrops?.length ?? 0 + images?.logos?.length ?? 0})`,
      svg: (active) => <BackdropsSvg color={active ? "white" : "black"} />
    },
    {
      key: "videos",
      name: `Videos (${videos?.length ?? 0})`,
      svg: (active) => <BackdropsSvg color={active ? "white" : "black"} />
    }
  ];
  const { activeTab, setTab } = useTabs({ tabLocation: "tvSeasonTabState", defaultState: "episodes" });

  return (
    <Fragment>
      <Tabs tabList={tabList} currentTab={activeTab} styling={{ tabStyling }}>
        {tabList.map(({ key, name, svg }) => (
          <TabSelectionTitle
            key={key}
            onClick={() => setTab(key)}
            $active={activeTab === key}
            $tv={true}>
            <TabIcon>{svg(key === activeTab)}</TabIcon>
            {name}
          </TabSelectionTitle>
        ))}
      </Tabs>

      <AnimatePresence mode='wait' initial={false}>
        {activeTab === "episodes" && (
          <motion.div
            key='episodes'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <ModulesWrapper>
              <SeasonEpisodes episodes={episodes} ShowId={ShowId} ShowName={ShowName} seasonNumber={seasonNumber} />
            </ModulesWrapper>
          </motion.div>
        )}

        {activeTab === "credits" && (
          <motion.div
            key='credits'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <SeasonCredits credits={credits} />
          </motion.div>
        )}

        {activeTab === "images" && (
          <motion.div
            key='images'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <ModulesWrapper>
              <MediaTab images={images} />
            </ModulesWrapper>
          </motion.div>
        )}

        {activeTab === "videos" && (
          <motion.div
            key='videos'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <ModulesWrapper>
              <MediaTab images={videos} videos={true} />
            </ModulesWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default SeasonTab;
