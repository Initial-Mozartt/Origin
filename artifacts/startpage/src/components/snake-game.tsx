import { useState, useEffect, useCallback, useRef } from "react";

const COLS = 24;
const ROWS = 18;
const CELL = 22;
const TICK_MS = 130;

type Dir = "U" | "D" | "L" | "R";
type Pt = { x: number; y: number };

const eq = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;

function randomFood(snake: Pt[]): Pt {
  let p: Pt;
  do {
    p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => eq(s, p)));
  return p;
}

interface GameState {
  snake: Pt[];
  food: Pt;
  dir: Dir;
  nextDir: Dir;
  score: number;
  highScore: number;
  gameOver: boolean;
  started: boolean;
  paused: boolean;
}

function freshState(highScore: number): GameState {
  const snake: Pt[] = [{ x: 12, y: 9 }];
  return {
    snake,
    food: randomFood(snake),
    dir: "R",
    nextDir: "R",
    score: 0,
    highScore,
    gameOver: false,
    started: false,
    paused: false,
  };
}

interface Props {
  isVisible: boolean;
  onClose: () => void;
  accentColor: string;
  foregroundColor: string;
}

export function SnakeGame({ isVisible, onClose, accentColor, foregroundColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(
    freshState(parseInt(localStorage.getItem("origin_snake_hs") || "0"))
  );
  const [renderTick, setRenderTick] = useState(0);
  const forceRender = useCallback(() => setRenderTick((n) => n + 1), []);

  const reset = useCallback(() => {
    stateRef.current = freshState(stateRef.current.highScore);
    forceRender();
  }, [forceRender]);

  useEffect(() => {
    if (isVisible) reset();
  }, [isVisible, reset]);

  const step = useCallback(() => {
    const s = stateRef.current;
    if (!s.started || s.gameOver || s.paused) return;

    s.dir = s.nextDir;
    const head = s.snake[0];
    const next: Pt = {
      x: (head.x + (s.dir === "R" ? 1 : s.dir === "L" ? -1 : 0) + COLS) % COLS,
      y: (head.y + (s.dir === "D" ? 1 : s.dir === "U" ? -1 : 0) + ROWS) % ROWS,
    };

    if (s.snake.some((p) => eq(p, next))) {
      s.gameOver = true;
      if (s.score > s.highScore) {
        s.highScore = s.score;
        localStorage.setItem("origin_snake_hs", String(s.score));
      }
      forceRender();
      return;
    }

    const ate = eq(next, s.food);
    s.snake = [next, ...(ate ? s.snake : s.snake.slice(0, -1))];
    if (ate) {
      s.score += 10;
      s.food = randomFood(s.snake);
    }
    forceRender();
  }, [forceRender]);

  useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(step, TICK_MS);
    return () => clearInterval(id);
  }, [isVisible, step]);

  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        if (s.gameOver) {
          reset();
          return;
        }
        if (!s.started) {
          s.started = true;
          forceRender();
          return;
        }
        s.paused = !s.paused;
        forceRender();
        return;
      }

      const dirMap: Partial<Record<string, Dir>> = {
        ArrowUp: "U", w: "U", W: "U",
        ArrowDown: "D", s: "D", S: "D",
        ArrowLeft: "L", a: "L", A: "L",
        ArrowRight: "R", d: "R", D: "R",
      };
      const nd = dirMap[e.key];
      if (!nd) return;

      e.preventDefault();
      const opp: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };
      if (!s.started) {
        s.started = true;
        s.nextDir = nd;
        forceRender();
      } else if (nd !== opp[s.dir]) {
        s.nextDir = nd;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible, onClose, reset, forceRender]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    const W = COLS * CELL;
    const H = ROWS * CELL;

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#1a1b26";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(68,71,90,0.25)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }

    const foodPulse = 0.85 + 0.15 * Math.sin(Date.now() / 300);
    ctx.fillStyle = `rgba(80,250,123,${foodPulse})`;
    ctx.beginPath();
    ctx.arc(
      s.food.x * CELL + CELL / 2,
      s.food.y * CELL + CELL / 2,
      CELL / 2 - 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    s.snake.forEach((p, i) => {
      const pad = 2;
      const alpha = Math.max(0.35, 1 - i * 0.025);
      if (i === 0) {
        ctx.fillStyle = accentColor || "#ff79c6";
      } else {
        ctx.fillStyle = `rgba(189,147,249,${alpha})`;
      }
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(
          p.x * CELL + pad,
          p.y * CELL + pad,
          CELL - pad * 2,
          CELL - pad * 2,
          4
        );
      } else {
        ctx.rect(p.x * CELL + pad, p.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
      }
      ctx.fill();
    });
  });

  if (!isVisible) return null;

  const s = stateRef.current;
  const W = COLS * CELL;
  const H = ROWS * CELL;
  const isNewBest = s.score > 0 && s.score >= s.highScore;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9000,
        backgroundColor: "rgba(0,0,0,0.88)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "#282a36",
          border: "1px solid #44475a",
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
          userSelect: "none",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #44475a",
          }}
        >
          <span style={{ color: "#6272a4", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
            SNAKE
          </span>
          <span style={{ color: "#f8f8f2", fontSize: "0.8rem" }}>
            <span style={{ color: "#6272a4" }}>score </span>
            {s.score}
            <span style={{ color: "#44475a" }}> &nbsp;/&nbsp; </span>
            <span style={{ color: "#6272a4" }}>best </span>
            {s.highScore}
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef} width={W} height={H} />

          {(!s.started || s.paused || s.gameOver) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(26,27,38,0.82)",
                gap: "6px",
              }}
            >
              {s.gameOver ? (
                <>
                  <div style={{ color: "#ff5555", fontSize: "1.6rem", letterSpacing: "0.1em" }}>
                    GAME OVER
                  </div>
                  <div style={{ color: "#f8f8f2", fontSize: "0.9rem" }}>
                    score &nbsp;<span style={{ color: accentColor || "#ff79c6" }}>{s.score}</span>
                  </div>
                  {isNewBest && (
                    <div style={{ color: "#f1fa8c", fontSize: "0.75rem" }}>
                      new best
                    </div>
                  )}
                  <div style={{ color: "#44475a", fontSize: "0.72rem", marginTop: "10px" }}>
                    space to restart &nbsp;&middot;&nbsp; esc to exit
                  </div>
                </>
              ) : s.paused ? (
                <>
                  <div style={{ color: "#f1fa8c", fontSize: "1.2rem", letterSpacing: "0.1em" }}>
                    PAUSED
                  </div>
                  <div style={{ color: "#44475a", fontSize: "0.72rem", marginTop: "6px" }}>
                    space to resume
                  </div>
                </>
              ) : (
                <>
                  <div style={{ color: foregroundColor || "#f8f8f2", fontSize: "0.9rem" }}>
                    press space or any arrow to start
                  </div>
                  <div style={{ color: "#6272a4", fontSize: "0.72rem", marginTop: "4px" }}>
                    wasd or arrow keys &nbsp;&middot;&nbsp; space to pause &nbsp;&middot;&nbsp; esc to exit
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
