import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpRight, LogOut, Monitor, VolumeX } from "lucide-react";
import { Flame, Folder, LayoutDashboard, User } from "./ember-icons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { RELEASE } from "./ember-chrome";

export function GlassDesktop({
  children,
  preview = false,
  onSignOut,
}: {
  children: ReactNode;
  preview?: boolean;
  onSignOut?: () => void;
}) {
  const [about, setAbout] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const navigation = [
    { to: "/dashboard", anchor: "#main-content", label: "Visão geral", icon: LayoutDashboard },
    { to: "/tasks", anchor: "#quest-log", label: "Missões", icon: Folder },
    { to: "/character", anchor: "#player-panel", label: "Personagem", icon: User },
  ] as const;

  return (
    <div className="glass-theme glass-desktop">
      <div className="glass-wallpaper" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo
      </a>
      <header className="glass-menubar">
        <Link
          to={preview ? "/design" : "/dashboard"}
          className="glass-brand"
          aria-label="Kaizen, início"
        >
          <span className="glass-brand-mark">
            <Flame />
          </span>
          <strong>kaizen</strong>
        </Link>
        <span className="glass-edition">seu sistema de evolução</span>
        <nav aria-label="Navegação principal" className="glass-navigation">
          {navigation.map(({ to, anchor, label, icon: Icon }) =>
            preview ? (
              <a
                key={to}
                href={anchor}
                className={`glass-nav ${to === "/dashboard" ? "is-active" : ""}`}
              >
                <Icon />
                <span>{label}</span>
              </a>
            ) : (
              <Link key={to} to={to} className="glass-nav" activeProps={{ className: "is-active" }}>
                <Icon />
                <span>{label}</span>
              </Link>
            ),
          )}
        </nav>
        <button className="glass-about" onClick={() => setAbout(true)}>
          Ember <span>α</span>
        </button>
        {onSignOut && (
          <button className="glass-signout" onClick={onSignOut} aria-label="Sair da conta">
            <LogOut size={17} />
          </button>
        )}
      </header>
      {preview && (
        <div className="glass-preview-note">
          <span>PRÉVIA LOCAL</span> Dados de exemplo · experimente criar e concluir uma missão.
        </div>
      )}
      <main id="main-content" className="glass-workspace">
        {children}
      </main>
      <footer className="glass-taskbar">
        <button className="glass-start" onClick={() => setAbout(true)}>
          <Flame />
          <strong style={{ fontFamily: "Borel, sans-serif" }}>kaizen</strong>
        </button>
        <span className="glass-taskbar-divider" />
        <span className="glass-running-app">
          <Monitor size={15} /> Seu mundo, em movimento
        </span>
        <span className="glass-system-status">
          <i /> Um passo de cada vez.
        </span>
        <span className="glass-clock">
          <VolumeX size={14} aria-label="Sem áudio" />
          <span>
            {now ? format(now, "HH:mm") : "--:--"}
            <small>{now ? format(now, "dd MMM", { locale: ptBR }) : "Kaizen"}</small>
          </span>
        </span>
      </footer>
      <Dialog open={about} onOpenChange={setAbout}>
        <DialogContent className="glass-theme glass-dialog">
          <DialogHeader>
            <DialogTitle>Pequenos passos. Grandes conquistas.</DialogTitle>
            <DialogDescription>{RELEASE}</DialogDescription>
          </DialogHeader>
          <p>
            Transforme tarefas em missões, ganhe experiência e desenvolva seu personagem. Seu
            próximo nível começa com uma pequena ação.
          </p>
          <button className="glass-button glass-primary" onClick={() => setAbout(false)}>
            Continuar a jornada <ArrowUpRight size={16} />
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
