/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon7IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon7Icon(props: Icon7IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"round"}
      strokeLinejoin={"round"}
      strokeWidth={"2"}
      aria-hidden={"true"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "lucide lucide-minus"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M5 12h14"}></path>
    </svg>
  );
}

export default Icon7Icon;
/* prettier-ignore-end */
