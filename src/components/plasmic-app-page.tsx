import { Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { PageParamsProvider } from "@plasmicapp/react-web/lib/host";
import type { ReactNode } from "react";
import { PlasmicDashboardNative } from "./plasmic-linked/kaizen/PlasmicDashboardNative";
import { PlasmicMissionsEditable } from "./plasmic-linked/kaizen/PlasmicMissionsEditable";
import { PlasmicCharacterEditable } from "./plasmic-linked/kaizen/PlasmicCharacterEditable";
import { supabase } from "@/integrations/supabase/client";

type Screen = "dashboard" | "tasks" | "character";

/** Keep the Plasmic page shell editable while React owns authenticated data and actions. */
export function PlasmicAppPage({ screen, children }: { screen: Screen; children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await router.navigate({ to: "/auth", replace: true });
  }

  const nav = (
    <>
      <Link to="/dashboard">Visão geral</Link>
      <Link to="/tasks">Missões</Link>
      <Link to="/character">Personagem</Link>
      <button type="button" onClick={signOut}>
        Sair
      </button>
    </>
  );
  const main = { children: <div className="plasmic-app-content">{children}</div> };

  return (
    <PageParamsProvider route={`/${screen}`} params={{}} query={{}}>
      {screen === "dashboard" ? (
        <PlasmicDashboardNative nav={{ children: nav, className: "plasmic-app-nav" }} main={main} />
      ) : screen === "tasks" ? (
        <PlasmicMissionsEditable
          nav={{ children: nav, className: "plasmic-app-nav" }}
          main={main}
        />
      ) : (
        <PlasmicCharacterEditable
          nav={{ children: nav, className: "plasmic-app-nav" }}
          main={main}
        />
      )}
    </PageParamsProvider>
  );
}
