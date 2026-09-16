import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", context.userId)
      .single();

    if (error) throw error;
    return data;
  });

export const updateCharacterName = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ characterName: z.string().min(1).max(50) }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: profile, error } = await context.supabase
      .from("profiles")
      .update({ character_name: data.characterName })
      .eq("user_id", context.userId)
      .select()
      .single();

    if (error) throw error;
    return profile;
  });

export const spendAttributePoint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        attribute: z.enum(["strength", "intelligence", "discipline", "creativity", "resilience"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("spend_attribute_point", {
      _attribute: data.attribute,
    });

    if (error) throw error;
    return result as {
      success: boolean;
      error?: string;
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
