import { useEffect, useRef, useState } from "react";
import { drawWarrior } from "./voxel-warrior-renderer";
import "./pixel-warrior.css";

type PixelWarriorProps = {
  className?: string;
  celebrating?: boolean;
};

/** A small voxel warrior that can be explored with a drag, click, or arrow keys. */
export function PixelWarrior({ className, celebrating = false }: PixelWarriorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const yawRef = useRef(-0.42);
  const pointerRef = useRef({ id: -1, x: 0, dragging: false });
  const startTimeRef = useRef<number | null>(null);
  const celebrationRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [angleText, setAngleText] = useState("frente");

  useEffect(() => {
    if (celebrating && celebrationRef.current === null) celebrationRef.current = performance.now();
    if (!celebrating) celebrationRef.current = null;
  }, [celebrating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = 260 * dpr;
    canvas.height = 260 * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    startTimeRef.current = performance.now();
    let animationFrame = 0;
    const paint = (now: number) => {
      drawWarrior(context, {
        yaw: yawRef.current,
        time: (now - (startTimeRef.current ?? now)) / 1000,
        reducedMotion,
        celebrationTime:
          celebrationRef.current === null ? null : (now - celebrationRef.current) / 1000,
      });
      animationFrame = window.requestAnimationFrame(paint);
    };
    animationFrame = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  function updateYaw(nextYaw: number) {
    const normalized = nextYaw % (Math.PI * 2);
    yawRef.current = normalized;
    const degrees = Math.round(((normalized * 180) / Math.PI + 360) % 360);
    setAngleText(
      degrees < 45 || degrees > 315
        ? "frente"
        : degrees < 135
          ? "lado direito"
          : degrees < 225
            ? "costas"
            : "lado esquerdo",
    );
  }

  function resetRotation() {
    updateYaw(-0.42);
    canvasRef.current?.focus();
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = { id: event.pointerId, x: event.clientX, dragging: false };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (pointerRef.current.id !== event.pointerId) return;
    const delta = event.clientX - pointerRef.current.x;
    if (Math.abs(delta) < 1) return;
    pointerRef.current.dragging = true;
    pointerRef.current.x = event.clientX;
    updateYaw(yawRef.current + delta * 0.014);
    if (!dragging) setDragging(true);
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLCanvasElement>) {
    if (pointerRef.current.id !== event.pointerId) return;
    pointerRef.current.id = -1;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDragging(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLCanvasElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      updateYaw(yawRef.current + (event.key === "ArrowLeft" ? -0.18 : 0.18));
    }
    if (event.key === "Home" || event.key === "0") {
      event.preventDefault();
      resetRotation();
    }
  }

  return (
    <div
      className={["pw-scene", dragging && "pw-dragging", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Aventureiro pixelado interativo"
    >
      <canvas
        ref={canvasRef}
        className="pw-canvas"
        width={260}
        height={260}
        role="img"
        aria-label="Aventureiro pixelado com camisa de campo, boné, mochila e lenço laranja, em uma ilha flutuante"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onKeyDown={handleKeyDown}
      />
      <span className="pw-rotate-hint" aria-live="polite">
        arraste para girar · {angleText}
      </span>
      <button
        className="pw-reset"
        type="button"
        onClick={resetRotation}
        aria-label="Voltar o guerreiro para a frente"
        title="Voltar para a frente"
      >
        ↺
      </button>
    </div>
  );
}
