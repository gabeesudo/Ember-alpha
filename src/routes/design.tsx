import { createFileRoute, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { addDays, format } from "date-fns";
import { DashboardPanel } from "@/components/dashboard-panel";
import { GlassDesktop } from "@/components/glass-desktop";
import { QUEST_DIFFICULTIES, type NewQuest, type PlayerProfile, type Quest } from "@/lib/dashboard";

// A development-only sandbox: sample progress never writes to the user's account.
export const Route = createFileRoute("/design")({
  ssr: false,
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({
    meta: [{ title: "Kaizen — prévia do novo painel" }, { name: "robots", content: "noindex" }],
  }),
  component: DesignPreview,
});

export function sampleProfile(): PlayerProfile {
  const timestamp = new Date().toISOString();
  return {
    id: "preview-player",
    user_id: "preview",
    character_name: "Alex",
    level: 2,
    xp: 135,
    coins: 85,
    attribute_points: 3,
    strength: 5,
    intelligence: 7,
    discipline: 6,
    creativity: 4,
    resilience: 5,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

export function sampleQuests(): Quest[] {
  const today = new Date();
  const rows: Array<{
    title: string;
    description: string;
    difficulty: Quest["difficulty"];
    offset: number;
    completed?: boolean;
  }> = [
    {
      title: "Mover o corpo por 30 minutos",
      description: "Uma caminhada também é uma conquista.",
      difficulty: "medium",
      offset: 0,
    },
    {
      title: "Ler 10 páginas de um livro",
      description: "Novas ideias, um capítulo de cada vez.",
      difficulty: "easy",
      offset: 0,
    },
    {
      title: "Dar um passo no projeto pessoal",
      description: "Reserve um momento de foco, só seu.",
      difficulty: "hard",
      offset: 0,
    },
    {
      title: "Beber um copo de água ao acordar",
      description: "Pequenos cuidados fazem a diferença.",
      difficulty: "easy",
      offset: 0,
      completed: true,
    },
    {
      title: "Organizar a semana",
      description: "Abra espaço para o que importa.",
      difficulty: "easy",
      offset: 1,
    },
    {
      title: "Aprender algo novo",
      description: "Siga a sua curiosidade.",
      difficulty: "medium",
      offset: 2,
    },
    {
      title: "Reservar um momento de descanso",
      description: "Descansar também faz parte da jornada.",
      difficulty: "easy",
      offset: -1,
      completed: true,
    },
  ];
  return rows.map((row, index) => ({
    id: `preview-${index}`,
    user_id: "preview",
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    due_date: format(addDays(today, row.offset), "yyyy-MM-dd"),
    xp_reward: QUEST_DIFFICULTIES[row.difficulty].xp,
    coin_reward: QUEST_DIFFICULTIES[row.difficulty].coins,
    completed: Boolean(row.completed),
    completed_at: row.completed ? addDays(today, row.offset).toISOString() : null,
    created_at: today.toISOString(),
    updated_at: today.toISOString(),
  }));
}

function DesignPreview() {
  const [profile, setProfile] = useState(sampleProfile);
  const [quests, setQuests] = useState(sampleQuests);
  const completedIds = useRef(new Set<string>());

  async function complete(id: string) {
    const quest = quests.find((item) => item.id === id);
    if (!quest || quest.completed || completedIds.current.has(id))
      throw new Error("Essa missão já foi concluída.");
    completedIds.current.add(id);
    let xp = profile.xp + quest.xp_reward;
    let level = profile.level;
    while (xp >= level * 100) {
      xp -= level * 100;
      level += 1;
    }
    const levels = level - profile.level;
    setProfile({
      ...profile,
      xp,
      level,
      coins: profile.coins + quest.coin_reward,
      attribute_points: profile.attribute_points + levels * 3,
    });
    setQuests((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, completed: true, completed_at: new Date().toISOString() }
          : item,
      ),
    );
    return { xp: quest.xp_reward, coins: quest.coin_reward, levels };
  }

  async function create(quest: NewQuest) {
    const timestamp = new Date().toISOString();
    setQuests((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        user_id: "preview",
        title: quest.title,
        description: quest.description ?? null,
        difficulty: quest.difficulty,
        due_date: quest.dueDate,
        xp_reward: QUEST_DIFFICULTIES[quest.difficulty].xp,
        coin_reward: QUEST_DIFFICULTIES[quest.difficulty].coins,
        completed: false,
        completed_at: null,
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]);
  }

  return (
    <GlassDesktop preview>
      <DashboardPanel
        preview
        profile={profile}
        quests={quests}
        onComplete={complete}
        onCreate={create}
      />
    </GlassDesktop>
  );
}
