import styled from "styled-components";
import logo from "./logo.svg";

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const logoSizeMapping = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2.5rem",
  xl: "4rem",
};

export function logoSizeToRem(size: LogoSize) {}

export const Logo: React.FC<{ size: LogoSize }> = ({ size }) => (
  <LogoImg src={logo} size={size} />
);

const LogoImg = styled.img<{ size: LogoSize }>`
  height: ${(p) => logoSizeMapping[p.size]};
`;
