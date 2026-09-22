import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { PageParamsProvider } from "@plasmicapp/react-web/lib/host";
import { useState, type FormEvent, type MouseEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PlasmicLoginEditable } from "@/components/plasmic-linked/kaizen/PlasmicLoginEditable";
import { PlasmicSignUpEditable } from "@/components/plasmic-linked/kaizen/PlasmicSignUpEditable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Entrar — Kaizen" },
      { name: "description", content: "Entre ou cadastre-se no Kaizen para começar sua aventura." },
    ],
  }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
const signupSchema = loginSchema.extend({
  characterName: z.string().min(1, "Nome do personagem é obrigatório").max(50),
});

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);

  function switchTab(event: MouseEvent<HTMLDivElement>) {
    const button = (event.target as HTMLElement).closest("button");
    if (!button || button.type === "submit") return;
    const label = button.textContent?.trim();
    if (label === "Entrar") setMode("login");
    if (label === "Criar conta") setMode("signup");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = (mode === "login" ? loginSchema : signupSchema).safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Confira os campos do formulário.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: String(data["email"]),
          password: String(data["password"]),
        });
        if (error) throw error;
        await router.invalidate();
        await router.navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signUp({
          email: String(data["email"]),
          password: String(data["password"]),
          options: {
            emailRedirectTo: window.location.origin,
            data: { character_name: String(data["characterName"]) },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu email para confirmar.");
        setMode("login");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível continuar.");
    } finally {
      setBusy(false);
    }
  }

  const form = { onSubmit: submit, "aria-busy": busy };
  return (
    <PageParamsProvider route={Route.fullPath} params={Route.useParams()} query={Route.useSearch()}>
      <div onClickCapture={switchTab}>
        {mode === "login" ? (
          <PlasmicLoginEditable form={form} />
        ) : (
          <PlasmicSignUpEditable form={form} />
        )}
      </div>
    </PageParamsProvider>
  );
}
