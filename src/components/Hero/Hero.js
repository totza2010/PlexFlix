import { AnimatePresence, motion } from "framer-motion";
import Loading from "components/Loading";
import useGetSearchSuggestions from "hooks/useGetSearchSuggestions";
import { useRouter } from "next/router";
import { Fragment, useState, useRef } from "react";
import { framerTabVariants } from "src/utils/helper";
import { Container } from "styles/GlobalComponents";
import { SearchCTA, Form, HeroDiv, UserInput } from "./HeroStyles";
import SearchSuggestion from "./searchSuggestion";
import { Button } from "styles/GlobalComponents";

const Hero = ({ banner = null }) => {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const { searchSuggestions, loading: searchSuggestionsLoading } = useGetSearchSuggestions(userInput);
  const searchInputUpdate = useRef(null);
  const userInputRef = useRef(null);

  const inputChangeHandler = (e) => {
    clearTimeout(searchInputUpdate.current);

    searchInputUpdate.current = setTimeout(() => {
      setUserInput(e.target.value);
    }, 1000);
  };

  const searchHandler = async (event) => {
    event.preventDefault();

    if (userInput.length === 0 || userInput.trim().length === 0) {
      return;
    } else {
      router.push(`/search/${userInput.replaceAll(" ", "+")}`);
      userInputRef.current = "";
    }
  };

  const keyHandler = (e, currentIndex, onSearchInput = false) => {
    const isArrowUp = e.code === "ArrowUp";
    const isArrowDown = e.code === "ArrowDown";

    if (isArrowUp || (isArrowDown && !onSearchInput)) {
      e.preventDefault();

      const suggestionItems = document.querySelectorAll(".suggestions .search-suggestion");
      const totalItems = suggestionItems.length;

      if (totalItems === 0) return;

      let nextIndex = currentIndex;

      if (isArrowUp) {
        nextIndex = (currentIndex - 1 + totalItems) % totalItems;
      } else if (isArrowDown) {
        nextIndex = (currentIndex + 1) % totalItems;
      }

      suggestionItems[nextIndex].focus();
    } else if (onSearchInput && isArrowDown) {
      const firstSuggestionEl = document.querySelector(".first-suggestion-item");
      e.preventDefault();
      firstSuggestionEl?.focus();
    }

    e.stopPropagation();
  };

  const closeInputHandler = () => {
    userInputRef.current.value = "";
    userInputRef.current.blur();
    setUserInput("");
  };

  return (
    <Container className='relative mb-auto'>
      {banner ? <div className='overflow-wrapper'>{banner}</div> : null}
      <HeroDiv $searchModal={!banner}>
        <Form onSubmit={searchHandler}>
          <div className='mb-16 w-full relative'>
            {userInput?.trim()?.length > 0 && (
              <button
                className='bg-neutral-200 rounded-xl text-sm font-semibold text-center text-neutral-800 px-3 min-h-full'
                onClick={closeInputHandler}>
                Close
              </button>
            )}
            <div className='pb-1.5 flex justify-between items-end border-animated'>
              <UserInput
                type='text'
                className='border text-base rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-500
                    placeholder-neutral-400 text-white focus:border heroSearchInput'
                placeholder='Search for a movie or tv show'
                id='inputData'
                ref={userInputRef}
                autoComplete='off'
                onChange={inputChangeHandler}
                onKeyDown={(e) => keyHandler(e, null, true)}
              />

              {userInput?.trim()?.length > 0 ? (
                <SearchCTA
                  as={motion.button}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{
                    scale: 1.1
                  }}
                  whileTap={{ scale: 0.9 }}
                  className='rounded-md text-base inline-block'
                  type='submit'>
                  Search
                </SearchCTA>
              ) : null}

              <AnimatePresence mode='wait'>
                {(searchSuggestionsLoading || searchSuggestions?.length > 0) && (
                  <motion.div
                    className='absolute top-full mt-2 left-0 right-0 z-10 bg-neutral-800 rounded-lg overflow-hidden shadow-lg'
                    key='suggestions'
                    variants={framerTabVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    transition={{ duration: 0.5 }}>
                    {searchSuggestionsLoading ? (
                      <Loading />
                    ) : (
                      <Fragment>
                        {searchSuggestions.length > 0 ? (
                          <div className='grid grid-cols-[repeat(auto-fill,minmax(295px,1fr))] p-4 gap-4 max-h-[50vh] overflow-y-auto'>
                            {searchSuggestions.map((item, index) => (
                              <SearchSuggestion
                                key={item.id}
                                type={item.type}
                                data={item}

                                onKeyDown={(e) => keyHandler(e, index, false)}
                              />
                            ))}
                          </div>
                        ) : null}
                      </Fragment>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Form>
      </HeroDiv>
    </Container>
  );
};

export default Hero;
