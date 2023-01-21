export * from "./Error";
export * from "./ErrorBoundary";
export * from "./Layout";
export * from "./Logo";
export * from "./NavLink";
export * from "./Search";
export * from "./ThemeSwitcher";

import { errorLinks } from "~/components/Error";
import { layoutLinks } from "~/components/Layout";
import { footerLinks } from "~/components/Layout/Footer";
import { headerLinks } from "~/components/Layout/Header";
import { logoLinks } from "~/components/Logo";
import { searchLinks } from "~/components/Search";
import { themeSwitcherLinks } from "~/components/ThemeSwitcher";

export const links = () => {
  return [
    ...errorLinks(),
    ...layoutLinks(),
    ...logoLinks(),
    ...footerLinks(),
    ...headerLinks(),
    ...searchLinks(),
    ...themeSwitcherLinks(),
  ];
};
