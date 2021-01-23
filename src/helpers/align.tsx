import styled from "styled-components";

export const Flex = styled.div<{
  direction?: "row" | "column" | "column-reverse" | "row-reverse";
}>`
  display: flex;
  flex-direction: ${(p) => p.direction};
`;

export const FlexRow = styled(Flex)<{ reverse?: boolean }>`
  flex-direction: ${(p) => (p.reverse ? "row-reverse" : "row")};
`;

export const FlexColumn = styled(Flex)<{ reverse?: boolean }>`
  flex-direction: ${(p) => (p.reverse ? "column-reverse" : "column")};
`;

export const CenterAlignedRow = styled(FlexRow)`
  align-items: center;
`;

export const FlexSpaceAround = styled(Flex)`
  justify-content: space-around;
`;

export const FlexSpaceBetween = styled(Flex)`
  justify-content: space-between;
`;

export const FlexEnd = styled(Flex)`
  justify-content: flex-end;
`;
