/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon10IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon10Icon(props: Icon10IconProps) {
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
        d={"M0 5h2V3h3v4h6V3h3v2h2v6h-2v2h-3V9H5v4H2v-2H0z"}
      ></path>
    </svg>
  );
}

export default Icon10Icon;
/* prettier-ignore-end */
