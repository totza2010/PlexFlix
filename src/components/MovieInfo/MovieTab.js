import Credits from "components/Credit/Credit";
import Reviews from "components/Reviews/Reviews";
import BackdropsSvg from "components/Svg/backdrops";
import CastSvg from "components/Svg/cast";
import ReviewsSvg from "components/Svg/reviews";
import Tabs from "components/Tabs/Tabs";
import { AnimatePresence, motion } from "framer-motion";
import useTabs from "hooks/useTabs";
import { Fragment } from "react";
import { framerTabVariants } from "src/utils/helper";
import { ModulesWrapper } from "styles/GlobalComponents";
import MediaTab from "./MediaTab";
import { TabIcon, TabSelectionTitle, tabStyling } from "./MovieTabStyles";

const tabList = [
  {
    key: "credits",
    name: "Credits",
    svg: (active) => <CastSvg color={active ? "white" : "black"} />
  },
  {
    key: "reviews",
    name: "Reviews",
    svg: (active) => <ReviewsSvg color={active ? "white" : "black"} />
  },
  {
    key: "images",
    name: "Images",
    svg: (active) => <BackdropsSvg color={active ? "white" : "black"} />
  },
  {
    key: "videos",
    name: "Videos",
    svg: (active) => <BackdropsSvg color={active ? "white" : "black"} />
  }
];

const MovieTab = ({ credits, reviews, images, videos }) => {
  const { activeTab, setTab } = useTabs({ tabLocation: "movieTabState", defaultState: "credits" });

  return (
    <Fragment>
      <Tabs tabList={tabList} currentTab={activeTab} styling={{ tabStyling }}>
        {tabList.map(({ key, name, svg }) => (
          <TabSelectionTitle key={key} onClick={() => setTab(key)} $active={activeTab === key}>
            <TabIcon>{svg(key === activeTab)}</TabIcon>
            {name}
          </TabSelectionTitle>
        ))}
      </Tabs>

      <AnimatePresence mode='wait' initial={false}>
        {activeTab === "credits" && (
          <motion.div
            key='credits'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <ModulesWrapper>
              <Credits credits={credits} />
            </ModulesWrapper>
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.div
            key='reviews'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <ModulesWrapper>
              <Reviews reviews={reviews} />
            </ModulesWrapper>
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

export default MovieTab;
