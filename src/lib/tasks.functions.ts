import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DIFFICULTY_REWARDS = {
  easy: { xp: 10, coins: 5 },
  medium: { xp: 25, coins: 15 },
  hard: { xp: 50, coins: 30 },
  epic: { xp: 100, coins: 75 },
};

export const getMyTasks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("tasks")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

export const getTodayTasks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await context.supabase
      .from("tasks")
      .select("*")
      .eq("user_id", context.userId)
      .or(`due_date.is.null,due_date.eq.${today}`)
      .eq("completed", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

export const createTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        title: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        difficulty: z.enum(["easy", "medium", "hard", "epic"]),
        dueDate: z.string().optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const rewards = DIFFICULTY_REWARDS[data.difficulty];

    const { data: task, error } = await context.supabase
      .from("tasks")
      .insert({
        user_id: context.userId,
        title: data.title,
        description: data.description ?? null,
        difficulty: data.difficulty,
        due_date: data.dueDate ?? null,
        xp_reward: rewards.xp,
        coin_reward: rewards.coins,
      })
      .select()
      .single();

    if (error) throw error;
    return task;
  });

export const completeTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ taskId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("complete_task", {
      _task_id: data.taskId,
    });

    if (error) throw error;
    return result as {
      success: boolean;
      error?: string;
      xp_gained?: number;
      coins_gained?: number;
      levels_gained?: number;
      profile?: {
        id: string;
        character_name: string;
        level: number;
        xp: number;
        coins: number;
        attribute_points: number;
        strength: number;
        intelligence: number;
        discipline: number;
        creativity: number;
        resilience: number;
      };
    };
  });

export const deleteTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ taskId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("tasks")
      .delete()
      .eq("id", data.taskId)
      .eq("user_id", context.userId);

    if (error) throw error;
    return { success: true };
  });
