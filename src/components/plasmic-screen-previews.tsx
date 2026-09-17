import { Link } from "@tanstack/react-router";
import { Flame, Shield, Sword, Trophy } from "lucide-react";

import { DashboardPanel } from "@/components/dashboard-panel";
import { GlassDesktop } from "@/components/glass-desktop";
import { sampleProfile, sampleQuests } from "@/routes/design";

/**
 * Screen-sized previews for Plasmic Studio.
 *
 * These keep Ember's real visual language and interactions in the canvas while
 * using safe in-memory data. Production routes continue to own authentication,
 * Supabase queries, and server actions.
 */
export function EmberDashboardScreen({ preview = true }: { preview?: boolean }) {
  return (
    <GlassDesktop preview={preview}>
      <DashboardPanel
        preview
        profile={sampleProfile()}
        quests={sampleQuests()}
        onComplete={async () => ({ xp: 25, coins: 10, levels: 0 })}
        onCreate={async () => undefined}
      />
    </GlassDesktop>
  );
}

export function EmberLandingScreen({
  eyebrow = "Seu dia a dia virou jogo",
  title = "Evolua de nível na vida real",
  description = "Transforme tarefas, hábitos e desafios em missões de RPG.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Flame className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-foreground">Life RPG</span>
          </div>
          <Link to="/auth" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Entrar
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-flame/20 bg-flame/10 px-4 py-1.5 text-sm font-medium text-flame">
            <Flame className="h-4 w-4" />
            <span>{eyebrow}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{description}</p>
          <div className="mt-8">
            <Link to="/auth" className="rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground">
              Começar aventura
            </Link>
          </div>
        </div>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={Sword} title="Missões do dia" text="Transforme tarefas em conquistas." />
          <Feature icon={Trophy} title="Suba de nível" text="Ganhe XP e moedas todos os dias." />
          <Feature icon={Shield} title="Personagem único" text="Evolua no seu próprio ritmo." />
        </div>
      </main>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Sword; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <Icon className="mb-4 h-6 w-6 text-primary" />
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
