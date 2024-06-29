import { Span } from "components/MovieInfo/MovieDetailsStyles";
import PlaceholderText from "components/PlaceholderText";
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { getReleaseDate, getRating } from "src/utils/helper";
import { Review, ReviewAuthorImg, ReviewAuthorWrap, ReviewsWrap } from "./ReviewsStyles";
import { Pill } from "styles/GlobalComponents";

const Reviews = ({ reviews }) => {
  return (
    <Fragment>
      {reviews?.length > 0 ? (
        reviews.map((item) => (
          <ReviewsWrap key={item.id}>
            <ReviewAuthorWrap>
              <ReviewAuthorImg $props={{
                type: item?.author_details?.avatar_path ? "tmdb" : "hash",
                avatar: item?.author_details?.avatar_path ?? item.id
              }} />
              <div>
                <Span className='font-bold'>{item.author}</Span>
                <Span className='text-sm opacity-80 flex font-normal gap-2 items-center'>
                  <Pill>
                    <p>{getRating(item?.author_details?.rating)}</p>
                  </Pill>
                  {getReleaseDate(item.updated_at)}
                </Span>
              </div>
            </ReviewAuthorWrap>

            <Review>
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{item.content}</ReactMarkdown>
            </Review>
          </ReviewsWrap>
        ))
      ) : (
        <PlaceholderText>No Reviews Yet</PlaceholderText>
      )}
    </Fragment>
  );
};

export default Reviews;
