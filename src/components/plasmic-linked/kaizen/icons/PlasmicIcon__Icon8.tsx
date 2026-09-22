/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon8IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon8Icon(props: Icon8IconProps) {
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
        d={"M1 1h6l1 2 1-2h6v13H9v1H7v-1H1zm2 2v9h3V3zm7 0v9h3V3z"}
      ></path>
    </svg>
  );
}

export default Icon8Icon;
/* prettier-ignore-end */
