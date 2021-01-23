import "styled-components";
import { IDefaultTheme } from "./theme";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme extends IDefaultTheme {}
}
