import DownloadMediaButton from "components/DownloadMediaButton/DownloadMediaButton";
import PlaceholderText from "components/PlaceholderText";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import { Fragment } from "react";
import { BackdropsImg, BackdropsImgContainer, BackdropsWrapper } from "./BackdropsStyles";

const Backdrops = ({ backdrops }) => {
  return (
    <Fragment>
      {backdrops?.length > 0 ? (
        <BackdropsWrapper>
          {backdrops.map((item, i) => (
              <BackdropsImg key={i} className='relative text-center'
              style={{ "--aspectRatio": item?.aspect_ratio }}>
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${item.file_path}`}
                  alt='backdrop'
                  fill
                  style={{ objectFit: "cover" }}
                  className='media'
                  placeholder='blur'
                  blurDataURL={blurPlaceholder}
                />

                <DownloadMediaButton item={item.file_path} />
              </BackdropsImg>
          ))}
        </BackdropsWrapper>
      ) : (
        <PlaceholderText>No Backdrops Yet</PlaceholderText>
      )}
    </Fragment>
  );
};

export default Backdrops;
