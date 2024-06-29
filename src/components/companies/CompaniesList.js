import { getCompanies } from "api/data";
import Modal, { useModal } from "components/Modal/Modal";
import { Span } from "components/MovieInfo/MovieDetailsStyles";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { getCleanTitle } from "src/utils/helper";
import { CompaniesListWrapper } from "./CompaniesListStyle";

const ListSlice = ({ list, type }) => {
  const [loading, setLoading] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState(list);

  useEffect(() => {
    setLoading(true);
    getCompanies({ companiesId: list.id, type })
      .then((data) => {
        if (data.success) {
          setNewCompanyData(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [list.id, type]);

  return (
    <Fragment>
      <Link
        className={`flex items-center justify-center flex-wrap gap-2 ps-4 pe-6 py-3 border-b border-neutral-600 last:border-b-0 cursor-pointer hover:bg-neutral-700 transition-colors`}
        href={`/${type === "production" ? "company" : "network"}/${getCleanTitle(
          newCompanyData?.id,
          newCompanyData?.name
        )}`}
        passHref
        scroll={false}
      >
        {loading ? (
          <p className="font-semibold opacity-50">Loading....</p>
        ) : newCompanyData?.images?.logos?.[0] ? (
          <CompaniesListWrapper
            style={{
              "--aspectRatio": newCompanyData?.images?.logos?.[0]?.aspect_ratio,
            }}
          >
            <Image
              src={`https://image.tmdb.org/t/p/w300_filter(negate,000,111)${newCompanyData?.images?.logos?.[0]?.file_path}`}
              alt={`${newCompanyData?.name}-poster`}
              fill
              style={{ objectFit: "cover" }}
              loading="eager"
            />
          </CompaniesListWrapper>
        ) : (
          <p className="font-medium">{newCompanyData?.name}</p>
        )}
      </Link>
    </Fragment>
  );
};

const CompaniesListModal = ({ companies, type }) => {
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
          <h4 className="text-2xl mb-4 font-semibold">All Companies</h4>

          <div className="border border-neutral-700 max-h-72 overflow-y-auto rounded-lg">
            {companies[0]?.id ? (companies?.map((list) => (
              <ListSlice key={list?.id} list={list} type={type} />
            ))) : (
              null
            )}
          </div>
        </div>
      </Modal>
      
      {companies?.[0]?.id ? (
        <Span
          className="network font-semibold cursor-pointer"
          onClick={openModalHandler}
        >
          {companies[0]?.name}
        </Span>
      ) : (
        <Span>{companies}</Span>
      )}
    </Fragment>
  );
};

export default CompaniesListModal;
