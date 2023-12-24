import { AnimatePresence, motion } from "framer-motion";
import { apiEndpoints } from "globals/constants";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState, useRef } from "react";
import { framerTabVariants } from "src/utils/helper";
import { Container } from "styles/GlobalComponents";
import { Banner, Button, Form, HeroDiv, UserInput } from "./HeroStyles";
import SearchSuggestion from "./searchSuggestion";

const Hero = ({ searchModal }) => {
  const userInputRef = useRef("");
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const [tvSuggestions, setTvSuggestions] = useState([]);
  const searchInputUpdate = useRef(null);

  const inputChangeHandler = (e) => {
    clearTimeout(searchInputUpdate);

    searchInputUpdate.current = setTimeout(() => {
      setUserInput(e.target.value);
    }, 1000);
  };

  useEffect(() => {
    if (userInput.trim().length === 0) {
      setShowButton(false);
      setMovieSuggestions([]);
      setTvSuggestions([]);
    } else {
      setShowButton(true);

      // fetch for suggestions
      const fetchSuggestions = async () => {
        let searchQuery = userInput;
        let year = "";

        if (searchQuery.includes("y:")) {
          year = searchQuery.slice(-4);
          searchQuery = searchQuery.slice(0, searchQuery.length - 7);
        }

        if (year.trim().length > 0) {
          const searchQueryWithYear = await Promise.all([
            fetch(apiEndpoints.search.movieSearchWithYear({ query: searchQuery, year })),
            fetch(apiEndpoints.search.tvSearchWithYear({ query: searchQuery, year }))
          ]);

          const error = searchQueryWithYear.some((res) => !res.ok);
          if (error) throw new Error("error fetching data");

          const [movieResponse, tvResponse] = searchQueryWithYear;
          const [movieRes, tvRes] = await Promise.all([movieResponse.json(), tvResponse.json()]);

          return {
            movieRes: movieRes.results.splice(0, 10) || [],
            tvRes: tvRes.results.splice(0, 10) || []
          };
        } else {
          const searchQueryWithoutYear = await Promise.all([
            fetch(apiEndpoints.search.movieSearch({ query: searchQuery })),
            fetch(apiEndpoints.search.tvSearch({ query: searchQuery }))
          ]);

          const error = searchQueryWithoutYear.some((res) => !res.ok);
          if (error) throw new Error("error fetching data");

          const [movieResponse, tvResponse] = searchQueryWithoutYear;
          const [movieRes, tvRes] = await Promise.all([movieResponse.json(), tvResponse.json()]);

          return {
            movieRes: movieRes.results.splice(0, 10) || [],
            tvRes: tvRes.results.splice(0, 10) || []
          };
        }
      };

      fetchSuggestions()
        .then(({ movieRes, tvRes }) => {
          setMovieSuggestions(movieRes);
          setTvSuggestions(tvRes.map((item) => ({ ...item, type: "tv" })));
        })
        .catch(() => {
          setMovieSuggestions([]);
          setTvSuggestions([]);
        });
    }
  }, [userInput]);

  const searchHandler = async (event) => {
    event.preventDefault();

    if (userInput.length === 0 || userInput.trim().length === 0) {
      return;
    } else {
      router.push(`/search/${userInput.replaceAll(" ", "+")}`);
      userInputRef.current = "";
    }
  };

  const sortedSuggestion = useMemo(
    () =>
      movieSuggestions
        .concat(tvSuggestions)
        ?.sort((item, nextItem) => nextItem?.popularity - item?.popularity),
    [movieSuggestions, tvSuggestions]
  );

  const bannerRef = useRef(null);

  const scrollListener = () => {
    const scale = 1.7 + window.scrollY / 200;

    if (scale > 1.7 && scale <= 3.5 && bannerRef?.current) {
      bannerRef.current.style.animation = `none`;
      bannerRef.current.style.transform = `scale(${scale}) rotate(10deg) translateZ(0px)`;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);

    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const keyHandler = (e, index, onSearchInput = false) => {
    if (onSearchInput && e.code === "ArrowDown") {
      const firstSuggestionEl = document.querySelector(".first-suggestion-item");
      e.preventDefault();
      firstSuggestionEl?.focus();
    }

    if (e.code === "ArrowDown" && !onSearchInput) {
      const lastItem = (index + 1) % 5 === 0;
      const scrollContainer = document.querySelector(".suggestions");

      if (!lastItem) {
        e.preventDefault();
      } else {
        scrollContainer.scrollTop = (index - 1) * 46;
      }

      e.target?.nextElementSibling?.focus();
    }

    if (e.code === "ArrowUp" && !onSearchInput) {
      const lastItem = (index + 1) % 5 === 0;
      const scrollContainer = document.querySelector(".suggestions");

      if (!lastItem) {
        e.preventDefault();
      } else {
        scrollContainer.scrollTop = (index - 1) * 46;
      }

      e.target?.previousElementSibling?.focus();
    }

    e.stopPropagation();
  };

  return (
    <Container className='relative mb-auto'>
      <div className='overflow-wrapper'>{!searchModal && <Banner ref={bannerRef} />}</div>
      <HeroDiv searchModal={searchModal}>
        <Form onSubmit={searchHandler}>
          <div className='mb-16 w-full relative'>
            <div className='pb-1 md:pb-2 flex justify-between items-end border-animated'>
              <UserInput
                type='text'
                className='px-2 pt-[10px] heroSearchInput'
                placeholder='Search for a movie or tv show'
                id='inputData'
                ref={userInputRef}
                autoComplete='off'
                onChange={inputChangeHandler}
                onKeyDown={(e) => keyHandler(e, null, true)}
              />

              {showButton ? (
                <motion.div
                  whileHover={{
                    scale: 1.05
                  }}
                  whileTap={{ scale: 0.95 }}>
                  <Button
                    tabIndex={-1}
                    show={showButton}
                    className='rounded-md text-base inline-block'
                    type='submit'>
                    Search
                  </Button>
                </motion.div>
              ) : null}
            </div>

            <AnimatePresence exitBeforeEnter>
              {sortedSuggestion.length > 0 && (
                <motion.div
                  key='suggestions'
                  variants={framerTabVariants}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  transition={{ duration: 0.5 }}>
                  <div className='mt-2 suggestions'>
                    {sortedSuggestion.map((item, index) => (
                      <SearchSuggestion
                        key={item.id}
                        type={item.type === "tv" ? "tv" : "movie"}
                        data={item}
                        className={`${index === 0 ? "first-suggestion-item" : ""}`}
                        onKeyDown={(e) => keyHandler(e, index, false)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Form>
      </HeroDiv>
    </Container>
  );
};

export default Hero;
