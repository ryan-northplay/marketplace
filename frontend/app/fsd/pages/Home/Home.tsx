import { FC } from "react";
import { LinkButton } from "app/fsd/uikit";
import classes from "./Home.module.scss";

export const Home: FC = () => {
  return (
    <div className={classes.Home}>
      <LinkButton href="/mirrors">Каталог зеркал</LinkButton>
    </div>
  );
};
