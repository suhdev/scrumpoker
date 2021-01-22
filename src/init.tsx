import { Toaster } from "@blueprintjs/core";
import { createBrowserHistory } from "history";

export const appHistory = createBrowserHistory();
export const toaster = Toaster.create({
  position: "top-right",
  canEscapeKeyClear: true,
});
