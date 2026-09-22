/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon6IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon6Icon(props: Icon6IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      aria-hidden={"true"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "living-flame hero-flame"
      )}
      focusable={"false"}
      shapeRendering={"crispEdges"}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M3 20H2v-6h2v-4H3V6h2v2h2v4h2V7h2V4h2V1h3v4h-2v3h2v4h2v-2h2V7h2v6h1v6h-2v3h-4v1H7v-1H3z"
        }
      ></path>

      <path
        fill={"var(--ember)"}
        d={"M6 20v-5h2v2h2v-5h2V8h2v6h2v3h2v-4h2v7h-3v2H9v-2z"}
      ></path>

      <path
        fill={"#fff1b8"}
        d={"M10 21v-4h2v-3h2v4h2v3h-2v1h-2v-1z"}
        className={"flame-core"}
      ></path>

      <g fill={"var(--ember)"} className={"flame-sparks"}>
        <path
          d={"M5 5h1.5v2H5zm13 1h1.5v1.5H18z"}
          className={"flame-spark"}
        ></path>
      </g>
    </svg>
  );
}

export default Icon6Icon;
/* prettier-ignore-end */
