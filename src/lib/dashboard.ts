import { format, isSameDay, parseISO } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

export type PlayerProfile = Tables<"profiles">;
export type Quest = Tables<"tasks">;
export type NewQuest = {
  title: string;
  description?: string;
  difficulty: Quest["difficulty"];
  dueDate: string;
};
export type QuestReward = { xp: number; coins: number; levels: number };

export const QUEST_DIFFICULTIES = {
  easy: { label: "Fácil", xp: 10, coins: 5 },
  medium: { label: "Média", xp: 25, coins: 15 },
  hard: { label: "Difícil", xp: 50, coins: 30 },
  epic: { label: "Épica", xp: 100, coins: 75 },
} as const;

// Date-only due dates stay in the user's calendar, without a UTC conversion.
export function questsForDay(quests: Quest[], day: Date, today: Date) {
  const dateKey = format(day, "yyyy-MM-dd");
  return quests.filter((quest) => {
    if (quest.due_date) return quest.due_date === dateKey;
    if (quest.completed) {
      return Boolean(quest.completed_at && isSameDay(parseISO(quest.completed_at), day));
    }
    return isSameDay(day, today);
  });
}
