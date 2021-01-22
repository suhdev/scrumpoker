import styled from "styled-components";

export const Layout = styled.div<{ collapsed?: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export const HeaderNav = styled.div`
  display: flex;
  height: 54px;
  width: 100%;
  position: relative;
  flex-direction: row;
`;
export const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - 54px);
`;

export const LeftNav = styled.div`
  width: 90%;
  height: 100%;
  overflow: auto;
  @media (min-width: 620px) {
    max-width: 280px;
  }
`;

export const WorkingArea = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow: auto;
`;
