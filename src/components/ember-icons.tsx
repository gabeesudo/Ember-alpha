import type { SVGProps } from "react";
type Props = Omit<SVGProps<SVGSVGElement>, "name">;
const shapes = {
 flame: "M7 1h2v3h2v2h2v3h1v4h-2v2H4v-1H2V9h2V6h2v4h1V1z",
 folder: "M1 3h5v2h9v9H1V3zm2 4v5h10V7H3z",
 grid: "M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z",
 user: "M5 1h6v2h1v5h-2v2h3v2h2v3H1v-3h2v-2h3V8H4V3h1V1z",
 star: "M7 0h2v4h2v2h5v2h-3v2h-2v2h2v3h-3v-2H6v2H3v-3h2v-2H3V8H0V6h5V4h2V0z",
 coin: "M4 1h8v2h2v2h1v6h-1v2h-2v2H4v-2H2v-2H1V5h1V3h2V1zm2 3v8h4v-2H8V6h2V4H6z",
 bolt: "M8 0h5l-2 5h3L5 16l2-7H3L8 0z",
 check: "M13 3h3v3h-2v2h-2v2h-2v2H8v2H5v-2H3v-2H1V7h3v2h2v2h1V9h2V7h2V5h2V3z",
 plus: "M6 1h4v5h5v4h-5v5H6v-5H1V6h5V1z",
 trash: "M5 1h6v2h4v2H1V3h4V1zM3 6h10v9H3V6zm2 1v6h1V7H5zm5 0v6h1V7h-1z",
 exit: "M1 1h8v4H7V3H3v10h4v-2h2v4H1V1zm10 3h2v2h2v1h1v2h-1v1h-2v2h-2V9H5V7h6V4z",
 sword: "M11 1h4v4h-2v2h-2v2H9v2h2v2H8v-1H6v2H4v2H1v-3h2v-2h2V9H4V6h2v2h2V6h2V4h1V1z",
 trophy: "M4 1h8v2h4v6h-3v2h-3v2h3v2H3v-2h3v-2H3V9H0V3h4V1zm-2 4v2h2V5H2zm10 0v2h2V5h-2z",
 shield: "M1 1h14v9h-2v2h-2v2H9v2H7v-2H5v-2H3v-2H1V1zm3 3v5h2v2h4V9h2V4H4z",
 heart: "M2 2h4v2h4V2h4v2h2v6h-2v2h-2v2h-2v2H6v-2H4v-2H2v-2H0V4h2V2z",
 target: "M4 0h8v2h2v2h2v8h-2v2h-2v2H4v-2H2v-2H0V4h2V2h2V0zm0 4v8h8V4H4zm2 2h4v4H6V6z",
 book: "M1 1h6l1 2 1-2h6v13H9v1H7v-1H1V1zm2 2v9h3V3H3zm7 0v9h3V3h-3z",
 bulb: "M5 0h6v2h2v2h1v5h-2v2h-1v2H5v-2H4V9H2V4h1V2h2V0zm1 14h4v2H6v-2z",
 strength: "M0 5h2V3h3v4h6V3h3v2h2v6h-2v2h-3V9H5v4H2v-2H0V5z",
 clock: "M4 0h8v2h2v2h2v8h-2v2h-2v2H4v-2H2v-2H0V4h2V2h2V0zm0 3v1H3v8h1v1h8v-1h1V4h-1V3H4zm3 1h2v4h3v2H7V4z",
};
export function PixelIcon({name, ...props}: Props & {name: keyof typeof shapes}) {
 return <svg viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" focusable="false" {...props}><path fillRule="evenodd" d={shapes[name]}/>{name==="flame" && <path fill="var(--ember)" d="M7 8h2v3h2v3H6v-3h1z"/>}</svg>;
}
export const Flame=({className, ...p}:Props)=>(
 <svg viewBox="0 0 24 24" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" focusable="false" className={["living-flame", className].filter(Boolean).join(" ")} {...p}>
  <path d="M3 20H2v-6h2v-4H3V6h2v2h2v4h2V7h2V4h2V1h3v4h-2v3h2v4h2v-2h2V7h2v6h1v6h-2v3h-4v1H7v-1H3z"/>
  <path fill="var(--ember)" d="M6 20v-5h2v2h2v-5h2V8h2v6h2v3h2v-4h2v7h-3v2H9v-2z"/>
  <path className="flame-core" fill="#fff1b8" d="M10 21v-4h2v-3h2v4h2v3h-2v1h-2v-1z"/>
  <g className="flame-sparks" fill="var(--ember)">
   <rect className="flame-spark" x="5" y="5" width="1.5" height="2"/>
   <rect className="flame-spark" x="18" y="6" width="1.5" height="1.5"/>
  </g>
 </svg>
);
export const Folder=(p:Props)=><PixelIcon name="folder" {...p}/>;
export const LayoutDashboard=(p:Props)=><PixelIcon name="grid" {...p}/>;
export const ListTodo=Folder;
export const User=(p:Props)=><PixelIcon name="user" {...p}/>;
export const Star=(p:Props)=><PixelIcon name="star" {...p}/>;
export const Coins=(p:Props)=><PixelIcon name="coin" {...p}/>;
export const Zap=(p:Props)=><PixelIcon name="bolt" {...p}/>;
export const CheckCircle2=(p:Props)=><PixelIcon name="check" {...p}/>;
export const Plus=(p:Props)=><PixelIcon name="plus" {...p}/>;
export const Trash2=(p:Props)=><PixelIcon name="trash" {...p}/>;
export const LogOut=(p:Props)=><PixelIcon name="exit" {...p}/>;
export const Sword=(p:Props)=><PixelIcon name="sword" {...p}/>;
export const Trophy=(p:Props)=><PixelIcon name="trophy" {...p}/>;
export const Shield=(p:Props)=><PixelIcon name="shield" {...p}/>;
export const Heart=(p:Props)=><PixelIcon name="heart" {...p}/>;
export const Target=(p:Props)=><PixelIcon name="target" {...p}/>;
export const Brain=(p:Props)=><PixelIcon name="book" {...p}/>;
export const Lightbulb=(p:Props)=><PixelIcon name="bulb" {...p}/>;
export const Dumbbell=(p:Props)=><PixelIcon name="strength" {...p}/>;
