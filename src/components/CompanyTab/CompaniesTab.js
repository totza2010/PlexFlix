import Tabs from "components/Tabs/Tabs";
import { AnimatePresence, motion } from "framer-motion";
import useTabs from "hooks/useTabs";
import { Fragment } from "react";
import { framerTabVariants } from "src/utils/helper";
import MoviesCompany from "./MoviesCompany";
import TvCompany from "./TvCompany";

const CompaniesTab = ({ moviesData, TVData, company }) => {

  const tabList = [
    { key: "movies", name: `Movies (${moviesData.total_results || 0})` },
    { key: "tv", name: `TV Shows (${TVData.total_results || 0})` }
  ];

  const { activeTab, setTab } = useTabs({ tabLocation: "indexTab", defaultState: "movies" });

  return (
    <Fragment>
      <Tabs tabList={tabList} currentTab={activeTab} setTab={setTab} />

      <AnimatePresence initial={false} mode='wait'>
        {activeTab === "movies" && (
          <motion.div
            key='movies'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            {/* popular movies */}
            <section>
              <MoviesCompany movies={moviesData.results} companyId={company.id} />
            </section>
            
          </motion.div>
        )}

        {activeTab === "tv" && (
          <motion.div
            key='tv'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            {/* popular TV */}
            <section>
              <TvCompany TV={TVData.results} companyId={company.id} />
            </section>
            
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default CompaniesTab;
