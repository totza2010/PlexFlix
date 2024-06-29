import styled, { css } from "styled-components";

export const tabStyling = css`
  width: clamp(360px, 92vw, 730px);
  margin: 1.5rem auto;

  @media only ${(props) => props.theme.breakpoints.sm} {
    font-size: 1.1rem;
  }

  @media only ${(props) => props.theme.breakpoints.xs} {
    font-size: 0.95rem;
  }
`;

export const SelectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;

  @media only ${(props) => props.theme.breakpoints.xs} {
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    padding: 0;
    .item {
      justify-content: center;
    }
  }
`;

export const tabStylingSM = css`
  width: clamp(360px, 92vw, 420px);
  min-height: 1rem;
  margin: 0;

  @media only ${(props) => props.theme.breakpoints.sm} {
    width: clamp(260px, 76vw, 255px);
    font-size: 1.1rem;
    min-height: 1rem;
  }

  @media only ${(props) => props.theme.breakpoints.ip} {
    min-height: 2.5rem;
  }

  @media only ${(props) => props.theme.breakpoints.xs} {
    width: clamp(260px, 76vw, 255px);
    font-size: 0.95rem;
    min-height: 2.5rem;
  }
`;

export const TabIcon = styled.div`
  display: none;
  width: 40px;
  height: 24px;
  margin-bottom: 5px;

  @media only ${(props) => props.theme.breakpoints.sm} {
    display: grid;
    place-items: center;
  }
`;

export const TabSelectionTitle = styled.div`
  // padding: 1rem;
  display: grid;
  place-items: center;
  color: ${({ $active }) => ($active ? "white" : "black")};
  font-weight: bold;
  cursor: pointer;
  z-index: 5;
  transition: color 0.325s cubic-bezier(0.77, 0, 0.18, 1);

  @media only ${(props) => props.theme.breakpoints.ip} {
    padding: 0.25rem;
  }

  @media only ${(props) => props.theme.breakpoints.sm} {
    font-size: ${({ $tv }) => ($tv ? "0.6rem" : "0.7rem")};
    font-weight: 500;
    // padding: ${($tv) => ($tv ? "0.5rem" : "0.5rem")};

    & > div svg path {
      transition: fill 0.325s cubic-bezier(0.77, 0, 0.18, 1);
    }
  }
`;
