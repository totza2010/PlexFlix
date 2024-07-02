import Backdrops from "components/Backdrops/Backdrops";
import Posters from "components/Posters/Posters";
import Select from "components/Select/Select";
import Tabs from "components/Tabs/Tabs";
import Videos from "components/Videos/Videos";
import { AnimatePresence, motion } from "framer-motion";
import useSelects from "hooks/useSelects";
import useTabs from "hooks/useTabs";
import { Fragment } from "react";
import { framerTabVariants } from "src/utils/helper";
import { TabSelectionTitle, tabStylingSM, SelectionContainer } from "./MovieTabStyles";

const getTabList = (images, postersSelected, backdropsSelected, logosSelected) => {
  const tabList = [];
  if (images?.posters?.length) tabList.push({ key: "posters", name: `Posters (${postersSelected?.length})` });
  if (images?.backdrops?.length) tabList.push({ key: "backdrops", name: `Backdrops (${backdropsSelected?.length})` });
  if (images?.logos?.length) tabList.push({ key: "logos", name: `Logos (${logosSelected?.length})` });
  return tabList;
};

const MediaTab = ({ images, videos = false }) => {
  
  const { activeTab, setTab } = useTabs({ tabLocation: "mediaTabState", defaultState: "posters" });
  const { activeSelect, setSelect } = useSelects({ selectLocation: "mediaSelectState", defaultState: "en" });
  const { activeSelect: activeSelect2, setSelect: setSelect2 } = useSelects({ selectLocation: "media2SelectState", defaultState: "all" });

  const filterByLocale = (items) => items.filter(item =>
    activeSelect && activeSelect !== "all"
      ? item.iso_639_1.iso_639_1.toLowerCase() === activeSelect
      : item.iso_639_1.iso_639_1
  );

  const filterByType = (items) => items.filter(item =>
    activeSelect2 && activeSelect2 !== "all"
      ? item.type.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) // Match words
        .map(x => x.toLowerCase()) // Convert to lowercase
        .join('_') === activeSelect2
      : item.type
  );

  const postersSelected = images?.posters ? filterByLocale(images?.posters) : [];
  const backdropsSelected = images?.backdrops ? filterByLocale(images?.backdrops) : [];
  const logosSelected = images?.logos ? filterByLocale(images?.logos) : [];
  const videosSelected = videos ? filterByLocale(filterByType(images)) : [];

  const localList = new Set(
    (videos ? images : (activeTab === "posters" ? images?.posters || [] :
      activeTab === "backdrops" ? images?.backdrops || [] :
        activeTab === "logos" ? images?.logos || [] : []))
      .map(item => item.iso_639_1)
  );

  const Options2 = [
    { key: "all", value: "All" },
    ...Array.from(images).map(item => ({
      key: item?.type.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) // Match words
        .map(x => x.toLowerCase()) // Convert to lowercase
        .join('_'),
      value: `${item?.type}`
    }))
  ].filter((option, index, self) =>
    index === self.findIndex(t => t.key === option.key)
  ).sort((a, b) => a.value.localeCompare(b.value));

  const Options = [
    { key: "all", value: "All" },
    ...Array.from(localList).map(item => ({
      key: item?.iso_639_1.toLowerCase(),
      value: `${item?.english_name} (${item?.iso_639_1.toUpperCase()})`
    }))
  ].filter((option, index, self) =>
    index === self.findIndex(t => t.key === option.key)
  ).sort((a, b) => a.value.localeCompare(b.value));

  const handleSelect = (key) => {
    setSelect(key);
  };

  const handleSelect2 = (key) => {
    setSelect2(key);
  };

  const tabList2 = getTabList(images, postersSelected, backdropsSelected, logosSelected);

  return (
    <Fragment>
      <SelectionContainer className="mb-6 ml-auto">
        <div className='item grid justify-items-start'>
          {videos ? (<div className='min-w-[250px] max-sm:min-w-full max-md:grow'>
            <Select
              options={Options2}
              activeKey={activeSelect2 || "all"}
              triggerText={Options2.find(item => item.key === activeSelect2)?.value || "All"}
              baseSizeOptions
              handleChange={handleSelect2}
            />
          </div>) : (<Tabs tabList={tabList2} currentTab={activeTab} styling={{ tabStyling: tabStylingSM }}>
            {tabList2.map(({ key, name }) => (
              <TabSelectionTitle key={key} onClick={() => setTab(key)} $active={activeTab === key}>
                {name}
              </TabSelectionTitle>
            ))}
          </Tabs>)}
        </div>
        <div className='item grid justify-items-end'>
          <div className='min-w-[250px] max-sm:min-w-full max-md:grow'>
            <Select
              options={Options}
              activeKey={activeSelect || "all"}
              triggerText={Options.find(item => item.key === activeSelect)?.value || "All"}
              baseSizeOptions
              handleChange={handleSelect}
            />
          </div>
        </div>
      </SelectionContainer>

      <AnimatePresence mode='wait' initial={false}>
        {videos ? <Videos posters={videosSelected} /> : 
        <Fragment>
        {activeTab === "posters" && (
          <motion.div
            key='posters'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <Posters posters={postersSelected} />
          </motion.div>
        )}

        {activeTab === "backdrops" && (
          <motion.div
            key='backdrops'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <Backdrops backdrops={backdropsSelected} />
          </motion.div>
        )}

        {activeTab === "logos" && (
          <motion.div
            key='logos'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <Posters posters={logosSelected} />
          </motion.div>
        )}</Fragment>}
      </AnimatePresence>
    </Fragment>
  );
};

export default MediaTab;
