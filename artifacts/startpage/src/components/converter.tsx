import { useState, useEffect } from "react";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  foregroundColor: string;
  bgColor: string;
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
    width: "360px",
    backgroundColor: "#1e1f29",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    borderBottom: "1px solid #333",
  },
  tab: {
    flex: 1,
    padding: "12px",
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    opacity: 0.5,
  },
  activeTab: {
    opacity: 1,
    borderBottom: "2px solid #ff79c6",
  },
  content: {
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "0.8rem",
    opacity: 0.6,
  },
  input: {
    backgroundColor: "#111",
    border: "1px solid #333",
    borderRadius: "4px",
    color: "inherit",
    padding: "8px",
    fontSize: "1rem",
    outline: "none",
  },
  select: {
    backgroundColor: "#111",
    border: "1px solid #333",
    borderRadius: "4px",
    color: "inherit",
    padding: "8px",
    fontSize: "1rem",
    outline: "none",
  },
  result: {
    marginTop: "8px",
    padding: "12px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "4px",
    textAlign: "center" as const,
    fontSize: "1.2rem",
    fontWeight: 600,
  }
};

const UNITS = {
  Length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    inch: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34,
  },
  Weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
  },
  Temp: {
    c: "c",
    f: "f",
    k: "k",
  }
};

export function Converter({ isVisible, onClose, foregroundColor, bgColor }: Props) {
  const [tab, setTab] = useState<"Currency" | "Units">("Currency");
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [unitCategory, setUnitCategory] = useState<keyof typeof UNITS>("Length");
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isVisible && tab === "Currency") {
      fetch("https://open.er-api.com/v6/latest/USD")
        .then(res => res.json())
        .then(data => setRates(data.rates))
        .catch(err => console.error("Failed to fetch rates", err));
    }
  }, [isVisible, tab]);

  if (!isVisible) return null;

  const convertCurrency = () => {
    if (!rates[from] || !rates[to]) return "---";
    const val = parseFloat(amount);
    if (isNaN(val)) return "---";
    const result = (val / rates[from]) * rates[to];
    return result.toFixed(2);
  };

  const convertUnits = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return "---";
    
    if (unitCategory === "Temp") {
      let celsius = val;
      if (from === "f") celsius = (val - 32) * 5/9;
      if (from === "k") celsius = val - 273.15;
      
      if (to === "c") return celsius.toFixed(2);
      if (to === "f") return (celsius * 9/5 + 32).toFixed(2);
      if (to === "k") return (celsius + 273.15).toFixed(2);
      return "---";
    }

    const cat = UNITS[unitCategory] as Record<string, number>;
    const result = (val * cat[from]) / cat[to];
    return result.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div 
      style={S.overlay} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={0}
      data-testid="converter-overlay"
    >
      <div style={{ ...S.panel, backgroundColor: bgColor || "#1e1f29", color: foregroundColor }}>
        <div style={S.header}>
          <button 
            style={{ ...S.tab, ...(tab === "Currency" ? S.activeTab : {}) }} 
            onClick={() => { setTab("Currency"); setFrom("USD"); setTo("EUR"); }}
            data-testid="converter-tab-currency"
          >
            Currency
          </button>
          <button 
            style={{ ...S.tab, ...(tab === "Units" ? S.activeTab : {}) }} 
            onClick={() => { setTab("Units"); setUnitCategory("Length"); setFrom("m"); setTo("ft"); }}
            data-testid="converter-tab-units"
          >
            Units
          </button>
        </div>

        <div style={S.content}>
          <div style={S.field}>
            <span style={S.label}>Amount</span>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              style={S.input}
              data-testid="converter-input-amount"
            />
          </div>

          {tab === "Units" && (
            <div style={S.field}>
              <span style={S.label}>Category</span>
              <select 
                value={unitCategory} 
                onChange={e => {
                  const cat = e.target.value as keyof typeof UNITS;
                  setUnitCategory(cat);
                  const keys = Object.keys(UNITS[cat]);
                  setFrom(keys[0]);
                  setTo(keys[1] || keys[0]);
                }} 
                style={S.select}
              >
                {Object.keys(UNITS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ ...S.field, flex: 1 }}>
              <span style={S.label}>From</span>
              <select value={from} onChange={e => setFrom(e.target.value)} style={S.select} data-testid="converter-select-from">
                {tab === "Currency" 
                  ? ["USD", "EUR", "GBP", "JPY", "CNY", "BTC"].map(c => <option key={c} value={c}>{c}</option>)
                  : Object.keys(UNITS[unitCategory]).map(u => <option key={u} value={u}>{u}</option>)
                }
              </select>
            </div>
            <div style={{ ...S.field, flex: 1 }}>
              <span style={S.label}>To</span>
              <select value={to} onChange={e => setTo(e.target.value)} style={S.select} data-testid="converter-select-to">
                {tab === "Currency" 
                  ? ["USD", "EUR", "GBP", "JPY", "CNY", "BTC"].map(c => <option key={c} value={c}>{c}</option>)
                  : Object.keys(UNITS[unitCategory]).map(u => <option key={u} value={u}>{u}</option>)
                }
              </select>
            </div>
          </div>

          <div style={S.result} data-testid="converter-result">
            {tab === "Currency" ? convertCurrency() : convertUnits()} {to}
          </div>
        </div>
      </div>
    </div>
  );
}
