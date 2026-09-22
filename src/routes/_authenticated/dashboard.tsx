import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DashboardPanel } from "@/components/dashboard-panel";
import { PlasmicAppPage } from "@/components/plasmic-app-page";
import { getMyProfile } from "@/lib/profiles.functions";
import { completeTask, createTask, getMyTasks } from "@/lib/tasks.functions";
import type { NewQuest } from "@/lib/dashboard";

const profileQueryOptions = queryOptions({
  queryKey: ["my-profile"],
  queryFn: () => getMyProfile(),
});
const tasksQueryOptions = queryOptions({ queryKey: ["my-tasks"], queryFn: () => getMyTasks() });

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(profileQueryOptions),
      context.queryClient.ensureQueryData(tasksQueryOptions),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Seu próximo nível — Kaizen" },
      {
        name: "description",
        content: "Seu personagem, suas missões e uma nova conquista a cada dia.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions);
  const { data: quests } = useSuspenseQuery(tasksQueryOptions);
  const queryClient = useQueryClient();
  const completeTaskFn = useServerFn(completeTask);
  const createTaskFn = useServerFn(createTask);

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["my-profile"] }),
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] }),
      queryClient.invalidateQueries({ queryKey: ["today-tasks"] }),
    ]);
  }

  async function handleComplete(id: string) {
    const result = await completeTaskFn({ data: { taskId: id } });
    if (!result.success) throw new Error(result.error ?? "Não foi possível concluir a missão.");
    await refresh();
    return {
      xp: result.xp_gained ?? 0,
      coins: result.coins_gained ?? 0,
      levels: result.levels_gained ?? 0,
    };
  }

  async function handleCreate(quest: NewQuest) {
    await createTaskFn({ data: quest });
    await refresh();
  }

  return (
    <PlasmicAppPage screen="dashboard">
      <DashboardPanel
        profile={profile}
        quests={quests}
        onComplete={handleComplete}
        onCreate={handleCreate}
      />
    </PlasmicAppPage>
  );
}
