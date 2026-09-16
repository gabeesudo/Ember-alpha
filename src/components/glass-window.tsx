import { useState, type ReactNode } from "react";
import { ChevronDown, Minus } from "lucide-react";

export function GlassWindow({
  title,
  icon,
  code,
  children,
  className = "",
  id,
}: {
  title: string;
  icon: ReactNode;
  code: string;
  children: ReactNode;
  className?: string;
  id: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section className={`glass-window ${className}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="glass-titlebar">
        <span className="glass-title-icon">{icon}</span>
        <h2 id={`${id}-title`}>{title}</h2>
        <span className="glass-title-lines" aria-hidden="true" />
        <span className="glass-window-code">{code}</span>
        <button
          className="glass-window-control"
          aria-label={`${collapsed ? "Expandir" : "Recolher"} ${title}`}
          aria-expanded={!collapsed}
          aria-controls={`${id}-content`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronDown size={13} /> : <Minus size={13} />}
        </button>
      </div>
      <div id={`${id}-content`} hidden={collapsed}>
        {children}
      </div>
    </section>
  );
}
