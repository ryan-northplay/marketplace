import type { FC } from "react";
import { memo } from "react";
import clsx from "clsx";
import { DATE_FORMAT, TIME_FORMAT, useDayjs } from "~/uikit";
import styles from "./DateTime.module.css";

type TProps = {
  className?: string;
  classes?: { date?: string; time?: string };
  isUtc?: boolean;
  isTime?: boolean;
  value?: Date | string | number | null;
};

const Component: FC<TProps> = ({ className, classes, isUtc = true, isTime = true, value }) => {
  const { dayjs } = useDayjs();

  return (
    <div className={clsx("DateTime", className)}>
      <div className={clsx("DateTime-Date", classes?.date)}>
        {isUtc ? dayjs(value).utc().format(DATE_FORMAT) : dayjs(value).format(DATE_FORMAT)}
      </div>
      {isTime && (
        <div className={clsx("DateTime-Time", classes?.time)}>
          {isUtc ? dayjs(value).utc().format(TIME_FORMAT) : dayjs(value).format(TIME_FORMAT)}
        </div>
      )}
    </div>
  );
};

export const DateTime = memo(Component);

export function dateTimeLinks() {
  return [{ rel: "stylesheet", href: styles }];
}
