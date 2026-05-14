import { useState, useEffect, useRef } from "react";
import type { Page } from "@/hooks/use-settings";

interface QuickOpenProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Page[];
  fallbackColumns: any[];
  onOpenLink: (url: string) => void;
  foregroundColor: string;
}

export function QuickOpen({ isOpen, onClose, pages, fallbackColumns, onOpenLink, foregroundColor }: QuickOpenProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allLinks: { pageName: string; colName: string; name: string; url: string }[] = [];
  
  const processColumns = (columns: any[], pageName: string) => {
    columns.forEach(col => {
      col.links.forEach((link: any) => {
        allLinks.push({
          pageName,
          colName: col.heading,
          name: link.name,
          url: link.url
        });
      });
    });
  };

  if (pages.length > 0) {
    pages.forEach(p => processColumns(p.columns, p.name));
  } else {
    processColumns(fallbackColumns, "Home");
  }

  const filteredLinks = allLinks.filter(l => 
    l.name.toLowerCase().includes(query.toLowerCase()) || 
    l.colName.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % filteredLinks.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + filteredLinks.length) % filteredLinks.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (filteredLinks[selectedIndex]) {
        onOpenLink(filteredLinks[selectedIndex].url);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10vh 20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="overlay-quick-open"
    >
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search links..."
          style={{
            width: "100%",
            backgroundColor: "#111111",
            border: "1px solid #333",
            borderRadius: "4px",
            color: foregroundColor,
            padding: "15px 20px",
            fontSize: "1.2rem",
            outline: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
          data-testid="input-quick-open"
        />
        <div
          style={{
            marginTop: "20px",
            maxHeight: "60vh",
            overflowY: "auto",
            backgroundColor: "#111111",
            borderRadius: "4px",
            border: filteredLinks.length > 0 ? "1px solid #333" : "none",
          }}
        >
          {filteredLinks.map((link, idx) => (
            <div
              key={idx}
              onClick={() => {
                onOpenLink(link.url);
                onClose();
              }}
              style={{
                padding: "12px 20px",
                cursor: "pointer",
                backgroundColor: idx === selectedIndex ? "rgba(255,255,255,0.05)" : "transparent",
                borderLeft: idx === selectedIndex ? "3px solid #ff79c6" : "3px solid transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              data-testid={`quick-open-item-${idx}`}
            >
              <span style={{ color: foregroundColor }}>{link.name}</span>
              <span style={{ color: "#666", fontSize: "0.8rem" }}>
                {link.pageName} &gt; {link.colName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
