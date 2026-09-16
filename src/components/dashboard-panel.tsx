import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { addDays, addWeeks, format, isSameDay, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  Brain,
  Coins,
  Dumbbell,
  Flame,
  Folder,
  Heart,
  Lightbulb,
  Shield,
  Star,
  Target,
} from "./ember-icons";
import { GlassWindow } from "./glass-window";
import { PixelWarrior } from "./pixel-warrior";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  QUEST_DIFFICULTIES,
  questsForDay,
  type NewQuest,
  type PlayerProfile,
  type Quest,
  type QuestReward,
} from "@/lib/dashboard";
import { toast } from "sonner";

const attributes = [
  { key: "strength", label: "Força", icon: Dumbbell, color: "var(--stat-strength)" },
  { key: "intelligence", label: "Inteligência", icon: Brain, color: "var(--stat-intelligence)" },
  { key: "discipline", label: "Disciplina", icon: Target, color: "var(--stat-discipline)" },
  { key: "creativity", label: "Criatividade", icon: Lightbulb, color: "var(--stat-creativity)" },
  { key: "resilience", label: "Resiliência", icon: Heart, color: "var(--stat-resilience)" },
] as const;

export function DashboardPanel({
  profile,
  quests,
  onComplete,
  onCreate,
  preview = false,
}: {
  profile: PlayerProfile;
  quests: Quest[];
  onComplete: (id: string) => Promise<QuestReward>;
  onCreate: (quest: NewQuest) => Promise<void>;
  preview?: boolean;
}) {
  const [today, setToday] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [week, setWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [filter, setFilter] = useState<"pending" | "completed">("pending");
  const [pending, setPending] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 60_000);
    return () => {
      window.clearInterval(timer);
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
    };
  }, []);

  const dayQuests = questsForDay(quests, selectedDay, today);
  const completed = dayQuests.filter((quest) => quest.completed);
  const remaining = dayQuests.filter((quest) => !quest.completed);
  const visibleQuests = filter === "pending" ? remaining : completed;
  const nextLevelXp = Math.max(1, profile.level * 100);
  const xpPercent = Math.min(100, Math.max(0, (profile.xp / nextLevelXp) * 100));
  const maximumAttribute = Math.max(10, ...attributes.map(({ key }) => profile[key]));
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(week, index));
  const isToday = isSameDay(selectedDay, today);

  async function complete(id: string) {
    if (pending) return;
    setPending(id);
    try {
      const reward = await onComplete(id);
      toast.success(`Missão concluída! +${reward.xp} XP · +${reward.coins} moedas`);
      if (reward.levels > 0) toast.success("Level up! Você alcançou um novo nível.");
      setCelebrating(true);
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
      celebrationTimer.current = setTimeout(() => setCelebrating(false), 2200);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a missão. Tente novamente.",
      );
    } finally {
      setPending(null);
    }
  }

  function changeWeek(direction: number) {
    setWeek(addWeeks(week, direction));
    setSelectedDay(addWeeks(selectedDay, direction));
  }

  return (
    <div className="quest-dashboard">
      <header className="dashboard-intro">
        <div>
          <p className="glass-eyebrow">
            <span /> UM NOVO DIA. UM POUCO MAIS LONGE.
          </p>
          <h1>Sua próxima versão começa aqui.</h1>
          <p>Olá, {profile.character_name}. Toda pequena conquista conta.</p>
        </div>
        <div className="dashboard-date">
          <span>{format(today, "EEEE", { locale: ptBR })}</span>
          <strong>{format(today, "dd 'de' MMMM", { locale: ptBR })}</strong>
          <small>
            {format(today, "yyyy")} <span aria-hidden="true">✦</span>
          </small>
        </div>
      </header>

      <GlassWindow
        title="personagem.exe"
        icon={<Shield />}
        code="01"
        id="player-panel"
        className="player-window"
      >
        <div className="player-layout">
          <div className="player-stage">
            <span className="player-stage-label">
              <span /> AVENTUREIRO EM EVOLUÇÃO
            </span>
            <div className="player-stage-grid" aria-hidden="true" />
            <PixelWarrior celebrating={celebrating} />
            <div className="player-stage-caption">
              <Shield />
              <span>Uma missão de cada vez.</span>
              <span aria-hidden="true">✧</span>
            </div>
          </div>
          <div className="player-info">
            <div className="player-identity">
              <div>
                <p className="glass-eyebrow">SEU PERSONAGEM</p>
                <h2>{profile.character_name}</h2>
                <span className="player-class">
                  <Shield /> Aventureiro · Jornada pessoal
                </span>
              </div>
              <div className="player-level">
                <span>NÍVEL</span>
                <strong>{String(profile.level).padStart(2, "0")}</strong>
                <small>LVL</small>
              </div>
            </div>
            <div className="player-attributes" aria-label="Atributos do personagem">
              {attributes.map(({ key, label, icon: Icon, color }) => (
                <div
                  className="player-attribute"
                  key={key}
                  style={{ "--attribute-color": color } as CSSProperties}
                >
                  <Icon />
                  <span>{label}</span>
                  <div className="attribute-track" aria-hidden="true">
                    <span
                      style={{ width: `${Math.max(3, (profile[key] / maximumAttribute) * 100)}%` }}
                    />
                  </div>
                  <strong>{String(profile[key]).padStart(2, "0")}</strong>
                </div>
              ))}
            </div>
            <div className="player-inventory">
              <span>
                <Coins /> <strong>{profile.coins}</strong> moedas
              </span>
              <span>
                <Sparkles size={13} /> <strong>{profile.attribute_points}</strong> pontos
                disponíveis
              </span>
            </div>
          </div>
        </div>
        <div className="player-xp">
          <div className="player-xp-heading">
            <span>
              <Star /> EXPERIÊNCIA
            </span>
            <strong>
              {profile.xp} <span>/ {nextLevelXp} XP</span>
            </strong>
            <span className="player-next-level">
              NÍVEL {profile.level + 1} <ArrowUpRight size={12} />
            </span>
          </div>
          <div
            className="glass-xp-track"
            role="progressbar"
            aria-label="Experiência para o próximo nível"
            aria-valuenow={profile.xp}
            aria-valuemin={0}
            aria-valuemax={nextLevelXp}
          >
            <span style={{ width: `${xpPercent}%` }} />
          </div>
          <div className="player-xp-caption">
            <span>Mais {Math.max(0, nextLevelXp - profile.xp)} XP para sua próxima conquista.</span>
            {preview ? (
              <span className="player-preview-hint">
                Conclua missões para evoluir <ArrowUpRight size={12} />
              </span>
            ) : (
              <Link to="/character">
                Ver personagem <ArrowUpRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </GlassWindow>

      <GlassWindow
        title="diário de missões"
        icon={<Folder />}
        code="02"
        id="quest-log"
        className="quest-window"
      >
        <div className="quest-heading">
          <div>
            <p className="glass-eyebrow">PEQUENOS PASSOS, PROGRESSO REAL</p>
            <h2>
              {isToday
                ? "O que vamos conquistar hoje?"
                : `Missões de ${format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}`}
            </h2>
          </div>
          <button className="glass-button glass-primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> Nova missão
          </button>
        </div>
        <div className="quest-calendar">
          <div className="quest-week-heading">
            <span>
              {format(week, "MMMM yyyy", { locale: ptBR })}
              {format(week, "MM") !== format(addDays(week, 6), "MM") &&
                ` — ${format(addDays(week, 6), "MMMM yyyy", { locale: ptBR })}`}
            </span>
            <div>
              <button
                className="calendar-today"
                onClick={() => {
                  setSelectedDay(today);
                  setWeek(startOfWeek(today, { weekStartsOn: 1 }));
                }}
              >
                Hoje
              </button>
              <button
                className="calendar-arrow"
                aria-label="Semana anterior"
                onClick={() => changeWeek(-1)}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="calendar-arrow"
                aria-label="Próxima semana"
                onClick={() => changeWeek(1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="quest-week" aria-label="Dias da semana">
            {weekDays.map((day) => {
              const count = questsForDay(quests, day, today).filter(
                (quest) => !quest.completed,
              ).length;
              return (
                <button
                  key={day.toISOString()}
                  className={`quest-day ${isSameDay(day, selectedDay) ? "is-selected" : ""} ${isSameDay(day, today) ? "is-today" : ""}`}
                  aria-pressed={isSameDay(day, selectedDay)}
                  aria-current={isSameDay(day, today) ? "date" : undefined}
                  aria-label={`${format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}, ${count} missões pendentes`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span>{["dom", "seg", "ter", "qua", "qui", "sex", "sáb"][day.getDay()]}</span>
                  <strong>{format(day, "dd")}</strong>
                  <i className={count ? "has-quests" : ""} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="quest-list-toolbar">
          <div className="quest-filters" role="group" aria-label="Filtrar missões">
            <button
              aria-pressed={filter === "pending"}
              className={filter === "pending" ? "is-active" : ""}
              onClick={() => setFilter("pending")}
            >
              Pendentes <span>{remaining.length}</span>
            </button>
            <button
              aria-pressed={filter === "completed"}
              className={filter === "completed" ? "is-active" : ""}
              onClick={() => setFilter("completed")}
            >
              Concluídas <span>{completed.length}</span>
            </button>
          </div>
          <span className="quest-daily-count">
            {completed.length} de {dayQuests.length} concluídas <span aria-hidden="true">✧</span>
          </span>
        </div>
        <div className="quest-list" aria-live="polite" aria-busy={pending !== null}>
          {visibleQuests.length === 0 ? (
            <div className="quest-empty">
              <Folder />
              <h3>
                {filter === "completed"
                  ? "As conquistas começam com um passo."
                  : dayQuests.length > 0
                    ? "Missões concluídas. Você evoluiu hoje."
                    : "Um dia cheio de possibilidades."}
              </h3>
              <p>
                {filter === "completed"
                  ? "Suas missões concluídas aparecerão aqui."
                  : "Escolha uma pequena ação e transforme em progresso."}
              </p>
              {filter === "pending" && (
                <button className="glass-button" onClick={() => setCreating(true)}>
                  <Plus size={14} /> Criar uma missão
                </button>
              )}
            </div>
          ) : (
            visibleQuests.map((quest) => (
              <div key={quest.id} className={`quest-row ${quest.completed ? "is-complete" : ""}`}>
                <button
                  className="quest-checkbox"
                  disabled={quest.completed || pending !== null}
                  aria-label={
                    quest.completed ? `${quest.title}, concluída` : `Concluir ${quest.title}`
                  }
                  onClick={() => complete(quest.id)}
                >
                  {pending === quest.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : quest.completed ? (
                    <Check size={16} />
                  ) : null}
                </button>
                <div className="quest-row-copy">
                  <h3>{quest.title}</h3>
                  <p>
                    {quest.description ||
                      (quest.due_date
                        ? "Um pequeno passo na sua jornada."
                        : "Sem data definida · faça no seu ritmo.")}
                  </p>
                </div>
                <span className={`quest-difficulty difficulty-${quest.difficulty}`}>
                  <i />
                  {QUEST_DIFFICULTIES[quest.difficulty].label}
                </span>
                <div className="quest-rewards">
                  <strong>
                    +{quest.xp_reward} <span>XP</span>
                  </strong>
                  <span>
                    <Coins /> +{quest.coin_reward}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="quest-window-footer">
          <span>
            <Flame /> Consistência é seu superpoder.
          </span>
          <span>
            {remaining.reduce((sum, quest) => sum + quest.xp_reward, 0)} XP disponíveis{" "}
            {isToday ? "hoje" : "neste dia"}
          </span>
        </div>
      </GlassWindow>
      <div className="dashboard-bottom">
        <span>VIDA REAL. ESPÍRITO DE AVENTURA.</span>
        <span>
          continue. mesmo que seja um pouquinho. <span aria-hidden="true">↗</span>
        </span>
      </div>
      <NewQuestDialog
        open={creating}
        onOpenChange={setCreating}
        date={format(selectedDay, "yyyy-MM-dd")}
        onCreate={onCreate}
      />
    </div>
  );
}

function NewQuestDialog({
  open,
  onOpenChange,
  date,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  onCreate: (quest: NewQuest) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [difficulty, setDifficulty] = useState<Quest["difficulty"]>("easy");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) {
      toast.error("Dê um nome à sua missão.");
      return;
    }
    setSaving(true);
    try {
      await onCreate({
        title,
        description: String(form.get("description") ?? "").trim(),
        difficulty,
        dueDate: String(form.get("date")),
      });
      toast.success("Nova missão adicionada à sua jornada.");
      onOpenChange(false);
    } catch {
      toast.error("Não foi possível criar a missão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!saving) {
          onOpenChange(next);
          if (!next) setDifficulty("easy");
        }
      }}
    >
      <DialogContent className="glass-theme glass-dialog">
        <DialogHeader>
          <DialogTitle>Uma nova missão</DialogTitle>
          <DialogDescription>
            Escolha algo que aproxime você da sua próxima versão.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="quest-form">
          <label>
            O que você quer conquistar?
            <input
              name="title"
              required
              maxLength={200}
              placeholder="Ex.: Ler 10 páginas"
              autoComplete="off"
            />
          </label>
          <label>
            Uma pequena descrição <span>(opcional)</span>
            <textarea
              name="description"
              maxLength={1000}
              placeholder="Cada detalhe ajuda a dar o primeiro passo."
              rows={2}
            />
          </label>
          <div className="quest-form-columns">
            <label>
              Data
              <input type="date" name="date" required defaultValue={date} />
            </label>
            <label>
              Dificuldade
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as Quest["difficulty"])}
              >
                {Object.entries(QUEST_DIFFICULTIES).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.label} · +{item.xp} XP
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="quest-form-reward">
            <Star /> +{QUEST_DIFFICULTIES[difficulty].xp} XP <Coins /> +
            {QUEST_DIFFICULTIES[difficulty].coins} moedas
          </div>
          <button className="glass-button glass-primary" type="submit" disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {saving ? "Criando missão…" : "Adicionar missão"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
