import { createFileRoute } from "@tanstack/react-router";
import { PageParamsProvider } from "@plasmicapp/react-web/lib/host";
import {
  PlasmicHomepage,
  PlasmicHomepage__HeadOptions,
} from "@/components/plasmic-linked/kaizen/PlasmicHomepage";

/** Legacy code-component preview; the editable native landing page lives at `/`. */
export const Route = createFileRoute("/plasmic-home")({
  head: () => ({
    meta: [...PlasmicHomepage__HeadOptions.meta],
    links: [...PlasmicHomepage__HeadOptions.links],
  }),
  component: PlasmicHomePage,
});

function PlasmicHomePage() {
  return (
    <PageParamsProvider route={Route.fullPath} params={Route.useParams()} query={Route.useSearch()}>
      <PlasmicHomepage />
    </PageParamsProvider>
  );
}
