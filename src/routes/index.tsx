import { createFileRoute } from "@tanstack/react-router";
import { PageParamsProvider } from "@plasmicapp/react-web/lib/host";
import { PlasmicHomeEditable } from "@/components/plasmic-linked/kaizen/PlasmicHomeEditable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaizen — Um passo de cada vez" },
      { name: "description", content: "Transforme pequenos passos em grandes conquistas." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <PageParamsProvider route={Route.fullPath} params={Route.useParams()} query={Route.useSearch()}>
      <PlasmicHomeEditable />
    </PageParamsProvider>
  );
}
