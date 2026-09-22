import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Plus, CheckCircle2, Trash2 } from "@/components/ember-icons";
import { getMyTasks, createTask, completeTask, deleteTask } from "@/lib/tasks.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { PlasmicAppPage } from "@/components/plasmic-app-page";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200),
  description: z.string().max(1000).optional(),
  difficulty: z.enum(["easy", "medium", "hard", "epic"]),
  dueDate: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

const tasksQueryOptions = queryOptions({
  queryKey: ["my-tasks"],
  queryFn: () => getMyTasks(),
});

export const Route = createFileRoute("/_authenticated/tasks")({
  loader: ({ context }) => context.queryClient.ensureQueryData(tasksQueryOptions),
  head: () => ({
    meta: [
      { title: "Missões — Kaizen" },
      { name: "description", content: "Gerencie suas tarefas e missões do Kaizen." },
      { property: "og:title", content: "Missões — Kaizen" },
      { property: "og:description", content: "Gerencie suas tarefas e missões do Kaizen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TasksPage,
});

const difficultyLabels: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
  epic: "Épico",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  hard: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  epic: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

function TasksPage() {
  const { data: tasks } = useSuspenseQuery(tasksQueryOptions);
  const queryClient = useQueryClient();
  const createTaskFn = useServerFn(createTask);
  const completeTaskFn = useServerFn(completeTask);
  const deleteTaskFn = useServerFn(deleteTask);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "", difficulty: "medium", dueDate: "" },
  });

  async function onSubmit(values: TaskForm) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await createTaskFn({
        data: {
          title: values.title,
          description: values.description,
          difficulty: values.difficulty,
          dueDate: values.dueDate || null,
        },
      });

      if (result) {
        toast.success("Missão criada!");
        form.reset();
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
        queryClient.invalidateQueries({ queryKey: ["today-tasks"] });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleComplete(taskId: string) {
    const result = await completeTaskFn({ data: { taskId } });
    if (result.success) {
      toast.success(`+${result.xp_gained} XP e +${result.coins_gained} moedas!`);
      if (result.levels_gained && result.levels_gained > 0) {
        toast.success("Level up!");
      }
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["today-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    } else {
      toast.error(result.error ?? "Erro ao completar missão");
    }
  }

  async function handleDelete(taskId: string) {
    if (!window.confirm("Excluir esta missão? Esta ação não pode ser desfeita.")) return;
    await deleteTaskFn({ data: { taskId } });
    toast.success("Missão excluída");
    queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    queryClient.invalidateQueries({ queryKey: ["today-tasks"] });
  }

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <PlasmicAppPage screen="tasks">
      <div className="space-y-6 feature-page">
      <div className="feature-heading flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Missões</h1>
          <p className="text-muted-foreground">Crie e complete missões para evoluir.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Nova missão
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Criar nova missão</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" {...form.register("title")} placeholder="Ex: Ler 20 páginas" />
                {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" {...form.register("description")} placeholder="Detalhes da missão (opcional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select value={form.watch("difficulty")} onValueChange={(value) => form.setValue("difficulty", value as TaskForm["difficulty"])}>
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil (+10 XP)</SelectItem>
                    <SelectItem value="medium">Médio (+25 XP)</SelectItem>
                    <SelectItem value="hard">Difícil (+50 XP)</SelectItem>
                    <SelectItem value="epic">Épico (+100 XP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de vencimento</Label>
                <Input id="dueDate" type="date" {...form.register("dueDate")} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar missão
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <TaskList title="Pendentes" tasks={pendingTasks} onComplete={handleComplete} onDelete={handleDelete} showActions />
      <TaskList title="Concluídas" tasks={completedTasks} onComplete={() => {}} onDelete={handleDelete} />
      </div>
    </PlasmicAppPage>
  );
}

function TaskList({
  title,
  tasks,
  onComplete,
  onDelete,
  showActions,
}: {
  title: string;
  tasks: Awaited<ReturnType<typeof getMyTasks>>;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  showActions?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Nenhuma missão aqui.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-entry rounded-lg border border-border p-4 ${task.completed ? "bg-muted/50 opacity-70" : "bg-card"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</p>
                      <Badge className={difficultyColors[task.difficulty]} variant="secondary">
                        {difficultyLabels[task.difficulty]}
                      </Badge>
                    </div>
                    {task.description && <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>}
                    <p className="mt-2 text-xs text-muted-foreground">
                      +{task.xp_reward} XP · +{task.coin_reward} moedas
                      {task.due_date ? ` · Vence em ${new Date(task.due_date + "T12:00:00").toLocaleDateString("pt-BR")}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {showActions && !task.completed && (
                      <Button size="icon" variant="outline" aria-label="Completar" onClick={() => onComplete(task.id)}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" aria-label="Excluir" onClick={() => onDelete(task.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
