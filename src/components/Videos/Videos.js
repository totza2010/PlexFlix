import Modal, { useModal } from "components/Modal/Modal";
import { Span } from "components/MovieInfo/MovieDetailsStyles";
import PlaceholderText from "components/PlaceholderText";
import Play from "components/Svg/play";
import { blurPlaceholder } from "globals/constants";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Button } from "styles/GlobalComponents";
import { PostersImg, PostersWrapper } from "./VideosStyles";

const Videos = ({ posters }) => {
  const { closeModal, isModalVisible, openModal } = useModal();
  const [currentVideoKey, setCurrentVideoKey] = useState(null);

  const openModalHandler = (videoKey) => {
    setCurrentVideoKey(videoKey);
    openModal();
  };

  const closeModalHandler = () => {
    setCurrentVideoKey(null);
    closeModal();
  };
  return (
    <Fragment>
      <Modal
        isOpen={isModalVisible}
        closeModal={closeModalHandler}
        align="items-center"
        width="max-w-xl max-h-full"
      >
        <div>
          <div className="w-full overflow-y-auto rounded-lg">
            {currentVideoKey && (
              <iframe
                style={{ width: "100%", aspectRatio: "16 / 9" }}
                src={`https://www.youtube.com/embed/${currentVideoKey}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            )}
          </div>
        </div>
      </Modal>
      {posters?.length > 0 ? (
        <PostersWrapper>
          {posters.map((item, i) => (
            <div key={i} className="w-full">
              <PostersImg className='relative text-center'
                style={{ "--aspectRatio": 16/9 }}>
                {item.name}
                <Image
                  src={`https://i.ytimg.com/vi/${item.key}/0.jpg`}
                  alt='poster'
                  fill
                  style={{ objectFit: "cover" }}
                  className='media'
                  placeholder='blur'
                  blurDataURL={blurPlaceholder}
                />
                <Button
                  className="absolute inset-0 flex items-center justify-center !bg-transparent"
                  aria-label='Play'
                  onClick={() => openModalHandler(item.key)}>
                  <Play />
                </Button>
                {/* <DownloadMediaButton item={item.file_path} /> */}
              </PostersImg>

              <div className='mt-3'>
                <Span className='font-bold movieCastHead line-clamp-2'>
                  {item.name}
                </Span>
                <Span className='movieCastName block'>{item.type}</Span>
              </div>
            </div>
          ))}
        </PostersWrapper>
      ) : (
        <PlaceholderText>No Posters Yet</PlaceholderText>
      )}
    </Fragment>
  );
};

export default Videos;
