import Posters from "components/Posters/Posters";
import Select from "components/Select/Select";
import Tabs from "components/Tabs/Tabs";
import { AnimatePresence, motion } from "framer-motion";
import useTabs from "hooks/useTabs";
import useSelects from "hooks/useSelects";
import { Fragment } from "react";
import { framerTabVariants } from "src/utils/helper";
import { ModulesWrapper } from "styles/GlobalComponents";
import { TabSelectionTitle, tabStylingSM, SelectionContainer } from "./MovieTabStyles";

const tabList2 = [
  {
    key: "posters",
    name: "Posters"
  },
  {
    key: "backdrops",
    name: "Backdrops"
  },
  {
    key: "logos",
    name: "Logos"
  }
];

const MediaTab = ({ images }) => {
  const { activeTab, setTab } = useTabs({ tabLocation: "mediaTabState", defaultState: "posters" });
  const { activeSelect, setSelect } = useSelects({ selectLocation: "mediaSelectState", defaultState: "en" });

  const filterByLocale = (items) => items.filter(item => 
    activeSelect && activeSelect !== "all"
      ? item.iso_639_1.iso_639_1.toLowerCase() === activeSelect 
      : item.iso_639_1.iso_639_1
  );

  const postersSelected = filterByLocale(images.posters);
  const backdropsSelected = filterByLocale(images.backdrops);
  const logosSelected = filterByLocale(images.logos);

  const localList = new Set(
    (activeTab === "posters" ? images.posters : 
     activeTab === "backdrops" ? images.backdrops : 
     activeTab === "logos" ? images.logos : [])
      .map(item => item.iso_639_1)
  );
  
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

  return (
    <Fragment>
      <SelectionContainer className="mb-6 ml-auto">
        <div className='item grid justify-items-start'>
          <Tabs tabList={tabList2} currentTab={activeTab} styling={{ tabStyling: tabStylingSM }}>
            {tabList2.map(({ key, name }) => (
              <TabSelectionTitle key={key} onClick={() => setTab(key)} $active={activeTab === key}>
                {name}
              </TabSelectionTitle>
            ))}
          </Tabs>
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

        {activeTab === "backdrops" && (
          <motion.div
            key='backdrops'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <ModulesWrapper>
              <Posters posters={backdropsSelected} />
            </ModulesWrapper>
          </motion.div>
        )}

        {activeTab === "posters" && (
          <motion.div
            key='posters'
            variants={framerTabVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.5 }}>
            <ModulesWrapper>
              <Posters posters={postersSelected} />
            </ModulesWrapper>
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
            <ModulesWrapper>
              <Posters posters={logosSelected} />
            </ModulesWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default MediaTab;
