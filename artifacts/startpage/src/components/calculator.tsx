import { useState, useEffect, useRef } from "react";

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  foregroundColor: string;
}

export function Calculator({ isOpen, onClose, foregroundColor }: CalculatorProps) {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setExpr("");
      setResult(null);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!expr.trim()) {
      setResult(null);
      return;
    }
    try {
      // Safe-ish eval using Function
      const cleanExpr = expr.replace(/[^-0-9+*/().]/g, "");
      const res = new Function(`return ${cleanExpr}`)();
      setResult(String(res));
    } catch (e) {
      setResult("error");
    }
  }, [expr]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && result && result !== "error") {
      navigator.clipboard.writeText(result);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="overlay-calculator"
    >
      <div
        style={{
          width: "300px",
          backgroundColor: "#1e1f29",
          border: "1px solid #333",
          borderRadius: "4px",
          padding: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Calculate..."
          style={{
            width: "100%",
            backgroundColor: "#111111",
            border: "1px solid #333",
            borderRadius: "2px",
            color: foregroundColor,
            padding: "8px 12px",
            fontSize: "1rem",
            outline: "none",
            marginBottom: "10px",
          }}
          data-testid="input-calculator"
        />
        <div
          style={{
            textAlign: "right",
            fontSize: "1.2rem",
            minHeight: "1.5em",
            color: result === "error" ? "#ff5555" : foregroundColor,
            opacity: result ? 1 : 0.4,
          }}
          data-testid="result-calculator"
        >
          {result || "0"}
        </div>
        <div style={{ marginTop: "10px", fontSize: "0.7rem", opacity: 0.4, textAlign: "center" }}>
          enter to copy result • esc to close
        </div>
      </div>
    </div>
  );
}
