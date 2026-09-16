import { WARRIOR_PARTS, type Voxel, type VoxelPart } from "./voxel-warrior-model";

type Point = [number, number, number];
type Face = {
  center: Point;
  corners: Point[];
  normal: Point;
  color: [number, number, number];
  part: VoxelPart["name"];
};

const directions: Point[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

function voxelKey(x: number, y: number, z: number) {
  return `${x},${y},${z}`;
}

// Keep only exposed cube faces. The complete model has genuine front, side and
// back geometry; rotation changes which faces are visible, rather than an image's skew.
function surfaceFaces(part: VoxelPart): Face[] {
  const occupied = new Set(part.voxels.map(({ x, y, z }) => voxelKey(x, y, z)));
  return part.voxels.flatMap((voxel: Voxel) => {
    const origin: Point = [voxel.x, voxel.y, voxel.z];
    const color: [number, number, number] = [
      parseInt(voxel.color.slice(1, 3), 16),
      parseInt(voxel.color.slice(3, 5), 16),
      parseInt(voxel.color.slice(5, 7), 16),
    ];
    return directions.flatMap((normal): Face[] => {
      if (occupied.has(voxelKey(voxel.x + normal[0], voxel.y + normal[1], voxel.z + normal[2])))
        return [];
      const center: Point = [
        origin[0] + normal[0] / 2,
        origin[1] + normal[1] / 2,
        origin[2] + normal[2] / 2,
      ];
      const axisA: Point = normal[0] !== 0 ? [0, 0.5, 0] : [0.5, 0, 0];
      const axisB: Point = normal[2] !== 0 ? [0, 0.5, 0] : [0, 0, 0.5];
      const corners = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ].map(([a = 0, b = 0]): Point => [
        center[0] + a * axisA[0] + b * axisB[0],
        center[1] + a * axisA[1] + b * axisB[1],
        center[2] + a * axisA[2] + b * axisB[2],
      ]);
      return [{ center, corners, normal, color, part: part.name }];
    });
  });
}

const faces = WARRIOR_PARTS.flatMap(surfaceFaces);
const PITCH = Math.PI / 8;
const SCALE = 4.75;

export type WarriorFrame = {
  yaw: number;
  time: number;
  reducedMotion: boolean;
  celebrationTime: number | null;
};

/** Orthographic rendering keeps the illustrated 2.5D look, with depth-sorted voxel faces. */
export function drawWarrior(context: CanvasRenderingContext2D, frame: WarriorFrame) {
  const { yaw, time, reducedMotion, celebrationTime } = frame;
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosPitch = Math.cos(PITCH);
  const sinPitch = Math.sin(PITCH);
  const float = reducedMotion ? 0 : Math.sin(time * 1.3) * 0.38;
  const breathing = reducedMotion ? 0 : Math.sin(time * 2) * 0.18;
  const victory =
    !reducedMotion && celebrationTime !== null && celebrationTime < 2.2
      ? Math.max(0, Math.sin(celebrationTime * Math.PI * 2)) * 1.7 * (1 - celebrationTime / 2.2)
      : 0;
  const scarfAngle = reducedMotion ? 0 : Math.sin(time * 2.1) * 0.045;
  const walkPhase = time * 2.05;
  const salute =
    !reducedMotion && celebrationTime !== null && celebrationTime < 2.2
      ? -Math.sin(Math.min(1, celebrationTime / 2.2) * Math.PI) * 0.24
      : 0;

  function local(point: Point, part: VoxelPart["name"], normal = false): Point {
    let [x, y] = point;
    let z = point[2];
    const rotation = part === "scarf" ? scarfAngle : part === "sword" ? salute : 0;
    if (rotation) {
      const pivotX = normal ? 0 : part === "sword" ? 11 : 0;
      const pivotY = normal ? 0 : part === "sword" ? 17 : 24;
      const dx = x - pivotX;
      const dy = y - pivotY;
      x = pivotX + dx * Math.cos(rotation) - dy * Math.sin(rotation);
      y = pivotY + dx * Math.sin(rotation) + dy * Math.cos(rotation);
    }
    if (!normal && part === "body" && !reducedMotion) {
      // Alternate the two legs in depth and let the arms counter-swing. The
      // small movement reads as walking in place from every rotation angle.
      if (y <= 10) {
        const side = x < 0 ? -1 : 1;
        const step = Math.sin(walkPhase + (side < 0 ? Math.PI : 0));
        z += step * 0.72;
        y += Math.max(0, step) * 0.18;
      } else if (y >= 12 && y <= 19 && Math.abs(x) > 5) {
        const side = x < 0 ? -1 : 1;
        z += side * Math.sin(walkPhase) * 0.28;
      }
    }
    if (!normal) y += float + (part !== "island" ? breathing + victory : 0);
    return [x, y, z];
  }

  function camera([x, y, z]: Point): Point {
    const rx = x * cosYaw + z * sinYaw;
    const rz = -x * sinYaw + z * cosYaw;
    return [rx, -y * cosPitch + rz * sinPitch, y * sinPitch + rz * cosPitch];
  }

  function screen(point: Point): [number, number] {
    return [130 + point[0] * SCALE, 133 + (point[1] + 15 * cosPitch) * SCALE];
  }

  context.clearRect(0, 0, 260, 260);
  // A soft ground shadow stays beneath the floating island at every angle.
  const shadowY = screen(camera([0, -6.5, 0]))[1];
  const shadow = context.createRadialGradient(130, shadowY, 3, 130, shadowY, 65);
  shadow.addColorStop(0, "rgba(44, 77, 65, .19)");
  shadow.addColorStop(1, "rgba(44, 77, 65, 0)");
  context.save();
  context.translate(130, shadowY);
  context.scale(1, 0.22);
  context.fillStyle = shadow;
  context.fillRect(-72, -55, 144, 110);
  context.restore();

  const visible = faces
    .flatMap((face) => {
      const normal = camera(local(face.normal, face.part, true));
      if (normal[2] < 0.001) return [];
      const center = camera(local(face.center, face.part));
      // Fixed overhead light shades new sides naturally as the figure turns.
      const light =
        0.69 + 0.31 * Math.max(0, -0.35 * normal[0] - 0.75 * normal[1] + 0.56 * normal[2]);
      const [r, g, b] = face.color.map((channel) => Math.min(255, Math.round(channel * light)));
      return [
        {
          depth: center[2],
          points: face.corners.map((corner) => screen(camera(local(corner, face.part)))),
          color: `rgb(${r},${g},${b})`,
        },
      ];
    })
    .sort((a, b) => a.depth - b.depth);

  for (const face of visible) {
    const first = face.points[0];
    if (!first) continue;
    context.beginPath();
    context.moveTo(first[0], first[1]);
    for (let index = 1; index < face.points.length; index++) {
      const point = face.points[index];
      if (point) context.lineTo(point[0], point[1]);
    }
    context.closePath();
    context.fillStyle = face.color;
    context.fill();
    // A tiny same-color seam closes antialias gaps between adjacent cube faces.
    context.strokeStyle = face.color;
    context.lineWidth = 0.35;
    context.stroke();
  }
}
