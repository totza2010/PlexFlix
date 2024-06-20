import styled from "styled-components";

export const SortPill = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: #404040;
  color: white;
  font-size: clamp(12px, 2.2vw, 14px);
  cursor: pointer;
  transition: background-color 0.3s ease-in;

  &:hover {
    background: #303030;
  }
`;