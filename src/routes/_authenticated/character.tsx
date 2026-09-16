import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Flame, Dumbbell, Brain, Target, Lightbulb, Heart } from "@/components/ember-icons";
import { getMyProfile, spendAttributePoint } from "@/lib/profiles.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

const profileQueryOptions = queryOptions({
  queryKey: ["my-profile"],
  queryFn: () => getMyProfile(),
});

export const Route = createFileRoute("/_authenticated/character")({
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQueryOptions),
  head: () => ({
    meta: [
      { title: "Personagem — Kaizen" },
      { name: "description", content: "Veja e evolua os atributos do seu personagem no Kaizen." },
      { property: "og:title", content: "Personagem — Kaizen" },
      { property: "og:description", content: "Veja e evolua os atributos do seu personagem no Kaizen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CharacterPage,
});

const attributes = [
  { key: "strength", label: "Força", icon: Dumbbell, description: "Resistência física e determinação" },
  { key: "intelligence", label: "Inteligência", icon: Brain, description: "Aprendizado e raciocínio" },
  { key: "discipline", label: "Disciplina", icon: Target, description: "Foco e consistência" },
  { key: "creativity", label: "Criatividade", icon: Lightbulb, description: "Inovação e resolução de problemas" },
  { key: "resilience", label: "Resiliência", icon: Heart, description: "Capacidade de superar obstáculos" },
] as const;

function CharacterPage() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions);
  const queryClient = useQueryClient();
  const spendPointFn = useServerFn(spendAttributePoint);
  const [pending, setPending] = useState<string | null>(null);

  const nextLevelXp = profile.level * 100;
  const xpProgress = Math.min(100, Math.round((profile.xp / nextLevelXp) * 100));

  async function handleSpend(attribute: string) {
    setPending(attribute);
    const result = await spendPointFn({ data: { attribute } });
    setPending(null);

    if (result.success) {
      toast.success(`${attributeLabels[attribute]} aumentado!`);
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    } else {
      toast.error(result.error ?? "Erro ao distribuir ponto");
    }
  }

  return (
    <div className="space-y-6 feature-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{profile.character_name}</h1>
        <p className="text-muted-foreground">Nível {profile.level} · {profile.xp}/{nextLevelXp} XP</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="character-summary">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Flame className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <div className="feature-heading flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">Progresso para o nível {profile.level + 1}</p>
                <span className="text-sm font-bold text-primary">{xpProgress}%</span>
              </div>
              <Progress aria-label="Progresso de experiência" value={xpProgress} className="mt-2 h-3" />
              <p className="mt-2 text-sm text-muted-foreground">Faltam {nextLevelXp - profile.xp} XP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Atributos</CardTitle>
          <div className="text-sm text-muted-foreground">
            Pontos disponíveis: <span className="font-bold text-primary">{profile.attribute_points}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attributes.map((attr) => {
              const Icon = attr.icon;
              const value = profile[attr.key] as number;
              return (
                <div key={attr.key} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{attr.label}</p>
                        <p className="text-xs text-muted-foreground">{attr.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-foreground">{value}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSpend(attr.key)}
                        aria-label={`Aumentar ${attr.label}`}
                        disabled={profile.attribute_points <= 0 || pending !== null}
                      >
                        {pending === attr.key && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                        +1
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const attributeLabels: Record<string, string> = {
  strength: "Força",
  intelligence: "Inteligência",
  discipline: "Disciplina",
  creativity: "Criatividade",
  resilience: "Resiliência",
};
