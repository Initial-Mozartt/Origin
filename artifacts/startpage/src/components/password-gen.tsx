import { useState, useEffect } from "react";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  foregroundColor: string;
  bgColor: string;
  accentColor: string;
}

const S = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  panel: {
    width: "320px",
    backgroundColor: "#1e1f29",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    padding: "24px",
    gap: "20px",
  },
  display: {
    backgroundColor: "#111",
    padding: "12px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "1.2rem",
    textAlign: "center" as const,
    wordBreak: "break-all" as const,
    minHeight: "1.5em",
  },
  options: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
  checkbox: {
    cursor: "pointer",
  },
  btn: {
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "0.9rem",
  },
  btnGen: {
    backgroundColor: "#ff79c6",
    color: "#282a36",
  },
  btnCopy: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "inherit",
  }
};

export function PasswordGen({ isVisible, onClose, foregroundColor, bgColor, accentColor }: Props) {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isVisible) {
      generate();
    }
  }, [isVisible]);

  const generate = () => {
    const chars = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let pool = "";
    if (options.upper) pool += chars.upper;
    if (options.lower) pool += chars.lower;
    if (options.numbers) pool += chars.numbers;
    if (options.symbols) pool += chars.symbols;

    if (!pool) {
      setPassword("");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setPassword(result);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div 
      style={S.overlay} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={0}
      data-testid="password-gen-overlay"
    >
      <div style={{ ...S.panel, backgroundColor: bgColor || "#1e1f29", color: foregroundColor }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Password Gen</h3>
          <button 
            onClick={onClose} 
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "1.2rem" }}
            data-testid="password-gen-close"
          >
            ✕
          </button>
        </div>

        <div style={S.display} data-testid="password-display">{password}</div>

        <div style={S.options}>
          <div style={S.row}>
            <span style={S.label}>Length: {length}</span>
            <input 
              type="range" 
              min="8" 
              max="64" 
              value={length} 
              onChange={e => setLength(parseInt(e.target.value))} 
              style={{ accentColor: accentColor || "#ff79c6" }}
              data-testid="password-length-slider"
            />
          </div>
          {Object.entries(options).map(([key, val]) => (
            <label key={key} style={S.row}>
              <span style={S.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <input 
                type="checkbox" 
                checked={val} 
                onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))} 
                style={S.checkbox}
                data-testid={`password-option-${key}`}
              />
            </label>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            style={{ ...S.btn, ...S.btnGen, flex: 1, backgroundColor: accentColor || "#ff79c6" }} 
            onClick={generate}
            data-testid="password-gen-btn"
          >
            Generate
          </button>
          <button 
            style={{ ...S.btn, ...S.btnCopy, flex: 1 }} 
            onClick={copy}
            data-testid="password-copy-btn"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
