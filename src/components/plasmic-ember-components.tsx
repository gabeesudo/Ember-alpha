import type { ReactNode } from "react";

import { Flame, PixelIcon } from "@/components/ember-icons";
import { GlassDesktop } from "@/components/glass-desktop";
import { GlassWindow } from "@/components/glass-window";
import { PixelWarrior } from "@/components/pixel-warrior";

/**
 * Small, presentational wrappers for Plasmic.
 *
 * The application components keep their real behavior and data contracts. These
 * wrappers expose the visual controls that are safe to change from Plasmic.
 */
export function EmberDesktop({ children, preview = true }: { children?: ReactNode; preview?: boolean }) {
  return <GlassDesktop preview={preview}>{children}</GlassDesktop>;
}

export function EmberWindow({
  title = "Nova janela",
  code = "01",
  id = "plasmic-window",
  className = "",
  children,
}: {
  title?: string;
  code?: string;
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <GlassWindow
      title={title}
      code={code}
      id={id}
      className={className}
      icon={<Flame aria-hidden="true" />}
    >
      {children}
    </GlassWindow>
  );
}

export function EmberIcon({ name = "flame", size = 18 }: { name?: Parameters<typeof PixelIcon>[0]["name"]; size?: number }) {
  return <PixelIcon name={name} width={size} height={size} />;
}

export function EmberWarrior({ className = "", celebrating = false }: { className?: string; celebrating?: boolean }) {
  return <PixelWarrior className={className} celebrating={celebrating} />;
}
