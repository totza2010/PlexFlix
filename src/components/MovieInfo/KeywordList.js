import Modal, { useModal } from "components/Modal/Modal";
import { Span } from "components/MovieInfo/MovieDetailsStyles";
import Link from "next/link";
import { Fragment } from "react";
import { FaTags } from "react-icons/fa";
import { getCleanTitle } from "src/utils/helper";

const KeywordList = ({ keywords }) => {
  const { closeModal, isModalVisible, openModal } = useModal();

  const openModalHandler = () => {
    openModal();
  };

  const closeModalHandler = () => {
    closeModal();
  };
  return (
    <Fragment>
      <Modal
        isOpen={isModalVisible}
        closeModal={closeModalHandler}
        width="max-w-md"
        align="items-center"
      >
        <div>
          <h4 className="text-2xl mb-4 font-semibold">All Keywords</h4>

          <div className="border border-neutral-700 max-h-72 overflow-y-auto rounded-lg">
            {keywords[0]?.id ? (keywords?.map((list) => (
                <Link
                    className={`flex items-center justify-center flex-wrap gap-2 ps-4 pe-6 py-3 border-b border-neutral-600 last:border-b-0 cursor-pointer hover:bg-neutral-700 transition-colors`}
                    href={`/keywords/${getCleanTitle(list?.id, list?.name)}`}
                    key={list.id}
                    passHref
                    scroll={false}
                >
                <div className="relative">
                <Span className="text-base font-medium">{list.name}</Span>
                </div>
                </Link>
            ))) : (
              null
            )}
          </div>
        </div>
      </Modal>
      
      {keywords?.[0]?.id ? (
        <FaTags className="cursor-pointer" onClick={openModalHandler} />
      ) : (
        null
      )}
    </Fragment>
  );
};

export default KeywordList;
