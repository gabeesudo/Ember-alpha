export type Voxel = { x: number; y: number; z: number; color: string };
export type VoxelPart = {
  name: "island" | "body" | "head" | "scarf" | "sword";
  voxels: Voxel[];
};

const palette = {
  shirt: "#c59b58",
  shirtLight: "#f1d28a",
  shirtShade: "#a97942",
  shorts: "#3d7069",
  shortsLight: "#629489",
  shortsShade: "#2e5555",
  skin: "#c9835d",
  skinLight: "#edaa78",
  skinShade: "#9a5b4d",
  boot: "#4d4038",
  bootLight: "#77604a",
  pack: "#bd603b",
  packLight: "#e48a4a",
  packShade: "#7e4637",
  green: "#5d9277",
  greenLight: "#91b89a",
  greenShade: "#365f55",
  mustard: "#dfad54",
  mustardLight: "#f5cf78",
  orange: "#e56f3c",
  orangeLight: "#ffad65",
  orangeShade: "#a94334",
  stick: "#745344",
  stickLight: "#b47d52",
  badge: "#f4d784",
  badgeInk: "#ad5e3b",
  eye: "#273c3c",
};

function createPart(name: VoxelPart["name"]) {
  const cubes = new Map<string, Voxel>();
  const set = (x: number, y: number, z: number, color: string) =>
    cubes.set(`${x},${y},${z}`, { x, y, z, color });
  const box = (
    x0: number,
    x1: number,
    y0: number,
    y1: number,
    z0: number,
    z1: number,
    color: string,
  ) => {
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) set(x, y, z, color);
  };
  return { set, box, build: (): VoxelPart => ({ name, voxels: [...cubes.values()] }) };
}

function makeIsland(): VoxelPart {
  const island = createPart("island");
  const stone = ["#55796a", "#628575", "#729682", "#496e61"];
  for (let y = -5; y <= 0; y++) {
    const inset = y < -1 ? Math.abs(y + 1) : 0;
    const radiusX = 14 - inset;
    const radiusZ = 10 - inset * 0.7;
    for (let x = -14; x <= 14; x++)
      for (let z = -10; z <= 10; z++) {
        if ((x / radiusX) ** 2 + (z / radiusZ) ** 2 > 1) continue;
        const patch = Math.abs(Math.floor(x / 3) * 13 + Math.floor(z / 3) * 7 + y * 5);
        const color =
          y === 0
            ? ["#93b99b", "#9fc5a7", "#91b99b", "#a8caaa"][patch % 4]
            : (stone[patch % stone.length] ?? stone[0] ?? "#55796a");
        if (color) island.set(x, y, z, color);
      }
  }
  island.box(-2, 0, 0, 0, 6, 7, "#bfd1b2");
  island.box(5, 7, 0, 0, 4, 5, "#bad1b2");
  for (const [x, z, height] of [
    [-10, 1, 3],
    [-9, 2, 2],
    [-11, 2, 1],
    [9, -3, 2],
    [10, -4, 3],
    [11, -3, 1],
    [-5, -7, 2],
  ] as Array<[number, number, number]>) {
    island.box(x, x, 1, height, z, z, "#689879");
    island.set(x, height, z, "#b9d49e");
  }
  island.box(6, 7, -6, -3, 6, 7, "#79cab0");
  island.box(7, 7, -7, -3, 6, 6, "#b8edcf");
  island.set(6, -7, 6, "#80d0b5");
  return island.build();
}

function makeBody(): VoxelPart {
  const body = createPart("body");
  const p = palette;
  body.box(-5, -1, 1, 4, -2, 3, p.boot);
  body.box(1, 5, 1, 4, -2, 3, p.boot);
  body.box(-4, -2, 4, 6, -1, 2, p.bootLight);
  body.box(2, 4, 4, 6, -1, 2, p.bootLight);
  body.box(-4, -2, 7, 10, -1, 2, p.skin);
  body.box(2, 4, 7, 10, -1, 2, p.skin);
  body.box(-4, -2, 7, 8, 2, 3, p.skinLight);
  body.box(2, 4, 7, 8, 2, 3, p.skinLight);
  body.box(-5, 5, 10, 14, -3, 3, p.shorts);
  body.box(-4, 4, 11, 13, 3, 4, p.shortsLight);
  body.box(-4, 4, 10, 11, -4, -4, p.shortsShade);
  body.box(-5, 5, 14, 22, -3, 3, p.shirt);
  body.box(-4, 4, 15, 21, 4, 4, p.shirtLight);
  body.box(-4, -1, 16, 18, 5, 5, p.shirtLight);
  body.box(0, 4, 14, 21, 5, 5, p.shirtShade);
  for (const y of [16, 18, 20]) body.set(0, y, 6, p.badge);
  body.box(-4, 1, 18, 19, 6, 6, p.green);
  body.box(-3, -1, 19, 19, 6, 6, p.greenLight);
  body.box(2, 3, 18, 18, 6, 6, p.badge);
  body.box(2, 2, 19, 19, 6, 6, p.badgeInk);
  body.box(-5, 5, 15, 22, -6, -4, p.pack);
  body.box(-4, 4, 17, 20, -7, -6, p.packShade);
  body.box(-4, 4, 18, 20, -5, -5, p.packLight);
  body.box(-6, -5, 16, 21, -4, -3, p.packShade);
  body.box(5, 6, 16, 21, -4, -3, p.packShade);
  body.box(-3, 3, 21, 22, -6, -4, p.packLight);
  body.box(-9, -6, 14, 19, -1, 2, p.shirtShade);
  body.box(-8, -6, 15, 18, 2, 3, p.shirtLight);
  body.box(-9, -7, 12, 14, 0, 2, p.skin);
  body.box(-8, -7, 12, 13, 2, 3, p.skinLight);
  body.box(6, 9, 14, 19, -1, 2, p.shirtShade);
  body.box(6, 8, 15, 18, 2, 3, p.shirtLight);
  body.box(8, 9, 12, 14, 0, 2, p.skin);
  body.box(8, 9, 12, 13, 2, 3, p.skinLight);
  return body.build();
}

function makeHead(): VoxelPart {
  const head = createPart("head");
  const p = palette;
  head.box(-4, 4, 24, 32, -3, 3, p.skin);
  head.box(-3, 3, 25, 31, 4, 4, p.skinLight);
  head.box(-4, -4, 26, 29, -1, 2, p.skinLight);
  head.box(4, 4, 26, 29, -1, 2, p.skinShade);
  head.box(-4, 4, 25, 26, 4, 5, p.skinShade);
  head.box(-3, -2, 28, 29, 5, 5, p.eye);
  head.box(2, 3, 28, 29, 5, 5, p.eye);
  head.box(-1, 1, 26, 27, 5, 5, p.skinLight);
  head.box(-2, 2, 24, 24, 4, 5, p.skinShade);
  head.box(-3, 3, 30, 31, -4, -4, p.skinShade);
  head.box(-5, 5, 32, 35, -3, 3, p.mustard);
  head.box(-4, 4, 35, 35, -3, 3, p.mustardLight);
  head.box(-6, 6, 32, 32, 3, 6, p.mustardLight);
  head.box(-3, 3, 33, 34, -4, -4, p.mustardLight);
  head.box(-3, 3, 35, 36, -2, 1, p.mustard);
  head.box(3, 5, 32, 33, 4, 6, p.mustard);
  head.set(0, 36, 0, p.green);
  return head.build();
}

function makeScarf(): VoxelPart {
  const scarf = createPart("scarf");
  const p = palette;
  scarf.box(-4, 4, 22, 24, -3, 3, p.orange);
  scarf.box(-4, 4, 23, 23, 3, 4, p.orangeLight);
  scarf.box(-3, 3, 22, 22, -4, -4, p.orangeShade);
  for (let step = 0; step < 8; step++) {
    const x = 3 + Math.floor(step / 3);
    const z = -5 - Math.floor(step / 4);
    scarf.box(x - 1, x + 1, 22 - step, 22 - step, z - 1, z, p.orange);
    scarf.set(x + 1, 22 - step, z - 1, p.orangeLight);
  }
  scarf.box(-1, 1, 19, 21, -6, -5, p.orangeShade);
  return scarf.build();
}

function makeSword(): VoxelPart {
  const stick = createPart("sword");
  const p = palette;
  stick.box(10, 11, 12, 14, 0, 1, p.stick);
  stick.box(10, 11, 13, 13, 2, 2, p.stickLight);
  for (let y = 15; y <= 30; y++) {
    const x = 11 + Math.floor((y - 15) / 7);
    stick.box(x, x, y, y, 0, 1, y % 3 === 0 ? p.stickLight : p.stick);
  }
  stick.box(13, 14, 29, 31, 0, 1, p.green);
  stick.set(13, 31, 1, p.greenLight);
  return stick.build();
}

export const WARRIOR_PARTS: VoxelPart[] = [
  makeIsland(),
  makeBody(),
  makeHead(),
  makeScarf(),
  makeSword(),
];
