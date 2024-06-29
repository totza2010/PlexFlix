import CompaniesListModal from "components/companies/CompaniesList";
import {
  FactsFieldSet,
  FactsLegend,
  FactsWrapper,
  Span
} from "components/MovieInfo/MovieDetailsStyles";
import { FactsFlexWrapper } from "styles/GlobalComponents";

const TVFacts = ({ facts, networks, companies }) => {
  const { status, language, type } = facts;
  return (
    <FactsFieldSet>
      <FactsLegend className='font-bold text-2xl'>Facts</FactsLegend>
      <FactsWrapper>
        <FactsFlexWrapper>
          <Span>Status</Span>
          <Span>{status}</Span>
        </FactsFlexWrapper>

        <FactsFlexWrapper>
          <Span>Language</Span>
          <Span>{language}</Span>
        </FactsFlexWrapper>

<FactsFlexWrapper>
  <Span>Networks</Span>
  <CompaniesListModal companies={networks} type={"network"} />
</FactsFlexWrapper>

        <FactsFlexWrapper>
          <Span>Type</Span>
          <Span>{type}</Span>
        </FactsFlexWrapper>

<FactsFlexWrapper>
  <Span>Companies</Span>
  <CompaniesListModal companies={companies} type={"production"} />
</FactsFlexWrapper>
      </FactsWrapper>
    </FactsFieldSet>
  );
};

export default TVFacts;
