import Modal, { useModal } from "components/Modal/Modal";
import { Span } from "components/MovieInfo/MovieDetailsStyles";
import Toast, { useToast } from "components/Toast/Toast";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { IoCopy } from "react-icons/io5";
import { MdShare } from "react-icons/md";
import { copyToClipboard } from "src/utils/helper";
import { Button } from "styles/GlobalComponents";

const ListShareButton = ({ list }) => {
  const { isToastVisible, showToast, toastMessage } = useToast();
  const { openModal, isModalVisible, closeModal } = useModal();

  const shareHandler = (e) => {
    e.preventDefault();

    if (navigator.share) {
      navigator
        .share({
          title: list?.name,
          text: list?.description,
          url: window.location.href
        })
        .catch(() => openModal());
    } else {
      openModal();
    }
  };

  const copyButtonHandler = () => {
    copyToClipboard({ nodeId: "list-URL" })
      .then(() => {
        closeModal();
        showToast({ message: "Copied to clipboard!" });
      })
      .catch(() => {
        closeModal();
        showToast({ message: "Copying to clipboard is not supported." });
      });
  };

  return (
    <Fragment>
      <Button as={motion.button} whileTap={{ scale: 0.95 }} onClick={shareHandler}>
        <MdShare size={20} />
      </Button>

      <Modal closeModal={closeModal} isOpen={isModalVisible} align='items-center' width='max-w-lg'>
        <div>
          <h4 className='text-xl mb-4 font-semibold'>Share {list?.name}</h4>

          <div className='mt-6'>
            <div>
              <label
                htmlFor='list-URL'
                className='block mb-2 text-base font-medium text-neutral-200'>
                URL
              </label>
              <div className='flex gap-3'>
                <input
                  type='text'
                  name='URL'
                  id='list-URL'
                  defaultValue={typeof window !== "undefined" ? window.location.href : ""}
                  className='border text-base rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-500 placeholder-neutral-400 text-white focus:border'
                />

                <Button className='mediaCTA w-[50px] shrink-0' onClick={copyButtonHandler}>
                  <IoCopy size={20} />
                </Button>
              </div>
            </div>
          </div>

          <Button className='secondary w-full mt-3' onClick={closeModal}>
            Close
          </Button>
        </div>
      </Modal>

      <Toast isToastVisible={isToastVisible}>
        <Span className='toast-message'>{toastMessage}</Span>
      </Toast>
    </Fragment>
  );
};

export default ListShareButton;
