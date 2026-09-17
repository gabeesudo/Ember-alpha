import { createFileRoute } from "@tanstack/react-router";
import { PlasmicCanvasHost, registerComponent } from "@plasmicapp/react-web/lib/host";

import {
  EmberDesktop,
  EmberIcon,
  EmberWarrior,
  EmberWindow,
} from "@/components/plasmic-ember-components";
import { EmberDashboardScreen, EmberLandingScreen } from "@/components/plasmic-screen-previews";

registerComponent(EmberDesktop, {
  name: "EmberDesktop",
  displayName: "Ember desktop",
  importName: "EmberDesktop",
  importPath: "src/components/plasmic-ember-components",
  props: {
    preview: {
      type: "boolean",
      defaultValue: true,
    },
    children: "slot",
  },
});

registerComponent(EmberWindow, {
  name: "EmberWindow",
  displayName: "Ember glass window",
  importName: "EmberWindow",
  importPath: "src/components/plasmic-ember-components",
  props: {
    title: {
      type: "string",
      defaultValue: "Nova janela",
    },
    code: {
      type: "string",
      defaultValue: "01",
    },
    id: {
      type: "string",
      defaultValue: "plasmic-window",
    },
    className: "string",
    children: "slot",
  },
});

registerComponent(EmberIcon, {
  name: "EmberIcon",
  displayName: "Ember pixel icon",
  importName: "EmberIcon",
  importPath: "src/components/plasmic-ember-components",
  props: {
    name: {
      type: "choice",
      options: [
        "flame",
        "folder",
        "grid",
        "user",
        "star",
        "coin",
        "bolt",
        "check",
        "plus",
        "trash",
        "exit",
        "sword",
        "trophy",
        "shield",
        "heart",
        "target",
        "book",
        "bulb",
        "strength",
        "clock",
      ],
      defaultValue: "flame",
    },
    size: {
      type: "number",
      defaultValue: 18,
      min: 10,
      max: 64,
    },
  },
});

registerComponent(EmberWarrior, {
  name: "EmberWarrior",
  displayName: "Ember adventurer",
  importName: "EmberWarrior",
  importPath: "src/components/plasmic-ember-components",
  props: {
    celebrating: {
      type: "boolean",
      defaultValue: false,
    },
    className: "string",
  },
});

registerComponent(EmberDashboardScreen, {
  name: "EmberDashboardScreen",
  displayName: "Ember dashboard screen",
  importName: "EmberDashboardScreen",
  importPath: "src/components/plasmic-screen-previews",
  props: { preview: { type: "boolean", defaultValue: true } },
});

registerComponent(EmberLandingScreen, {
  name: "EmberLandingScreen",
  displayName: "Ember landing screen",
  importName: "EmberLandingScreen",
  importPath: "src/components/plasmic-screen-previews",
  props: {
    eyebrow: { type: "string", defaultValue: "Seu dia a dia virou jogo" },
    title: { type: "string", defaultValue: "Evolua de nível na vida real" },
    description: { type: "string", defaultValue: "Transforme tarefas, hábitos e desafios em missões de RPG." },
  },
});

export const Route = createFileRoute("/plasmic-host")({
  component: PlasmicHostRoute,
});

function PlasmicHostRoute() {
  return <PlasmicCanvasHost />;
}
