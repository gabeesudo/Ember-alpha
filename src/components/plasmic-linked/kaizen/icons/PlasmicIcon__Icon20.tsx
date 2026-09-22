/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon20IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon20Icon(props: Icon20IconProps) {
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
        "lucide lucide-arrow-up-right"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M7 7h10v10M7 17 17 7"}></path>
    </svg>
  );
}

export default Icon20Icon;
/* prettier-ignore-end */
