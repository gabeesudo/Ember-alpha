/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon4IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon4Icon(props: Icon4IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      aria-hidden={"true"}
      focusable={"false"}
      shapeRendering={"crispEdges"}
      viewBox={"0 0 16 16"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fillRule={"evenodd"}
        d={"M7 0h2v4h2v2h5v2h-3v2h-2v2h2v3h-3v-2H6v2H3v-3h2v-2H3V8H0V6h5V4h2z"}
      ></path>
    </svg>
  );
}

export default Icon4Icon;
/* prettier-ignore-end */
