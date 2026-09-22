/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon5IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon5Icon(props: Icon5IconProps) {
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
        d={
          "M4 1h8v2h4v6h-3v2h-3v2h3v2H3v-2h3v-2H3V9H0V3h4zM2 5v2h2V5zm10 0v2h2V5z"
        }
      ></path>
    </svg>
  );
}

export default Icon5Icon;
/* prettier-ignore-end */
