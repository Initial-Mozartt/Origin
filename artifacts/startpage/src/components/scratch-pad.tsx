import { useState, useEffect, useRef } from "react";

interface ScratchPadProps {
  isOpen: boolean;
  onClose: () => void;
  foregroundColor: string;
  historyEnabled?: boolean;
  onSaveToHistory?: (text: string) => void;
}

export function ScratchPad({ isOpen, onClose, foregroundColor, historyEnabled, onSaveToHistory }: ScratchPadProps) {
  const [text, setText] = useState(() => localStorage.getItem("origin_scratch") || "");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSavedText = useRef(text);

  useEffect(() => {
    localStorage.setItem("origin_scratch", text);
  }, [text]);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
      if (historyEnabled) {
        const stored = localStorage.getItem("origin_scratch_history");
        if (stored) setHistory(JSON.parse(stored));
      }
    } else {
      if (historyEnabled && text !== lastSavedText.current && text.trim() !== "") {
        onSaveToHistory?.(text);
        lastSavedText.current = text;
      }
    }
  }, [isOpen, historyEnabled, text, onSaveToHistory]);

  if (!isOpen) return null;

  const restoreFromHistory = (hText: string) => {
    if (confirm("Restore this version? Current scratch pad will be overwritten.")) {
      setText(hText);
      setShowHistory(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="overlay-scratch-pad"
    >
      <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClose();
            }
          }}
          style={{
            width: "100%",
            height: showHistory ? "50vh" : "80vh",
            backgroundColor: "#111111",
            border: "1px solid #333",
            borderRadius: "4px",
            color: foregroundColor,
            padding: "20px",
            fontSize: "1.1rem",
            fontFamily: "inherit",
            resize: "none",
            outline: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            transition: "height 0.2s",
          }}
          data-testid="textarea-scratch-pad"
        />
        
        {historyEnabled && history.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                background: "none",
                border: "none",
                color: foregroundColor,
                opacity: 0.5,
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
              data-testid="button-toggle-history"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
            
            {showHistory && (
              <div
                style={{
                  width: "100%",
                  maxHeight: "30vh",
                  overflowY: "auto",
                  backgroundColor: "#111111",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  marginTop: "10px",
                  padding: "10px",
                }}
              >
                {history.map((h, i) => (
                  <div
                    key={i}
                    onClick={() => restoreFromHistory(h)}
                    style={{
                      padding: "10px",
                      borderBottom: i === history.length - 1 ? "none" : "1px solid #222",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      color: foregroundColor,
                      opacity: 0.7,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                    data-testid={`history-item-${i}`}
                  >
                    {h.substring(0, 100)}...
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: "10px",
            color: foregroundColor,
            opacity: 0.4,
            fontSize: "0.8rem",
            textAlign: "center"
          }}
        >
          esc to close
        </div>
      </div>
    </div>
  );
}
