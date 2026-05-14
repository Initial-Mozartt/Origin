import { useState, useEffect, useRef } from "react";

interface ScratchPadProps {
  isOpen: boolean;
  onClose: () => void;
  foregroundColor: string;
}

export function ScratchPad({ isOpen, onClose, foregroundColor }: ScratchPadProps) {
  const [text, setText] = useState(() => localStorage.getItem("origin_scratch") || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem("origin_scratch", text);
  }, [text]);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
          maxWidth: "800px",
          height: "80vh",
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
        }}
        data-testid="textarea-scratch-pad"
      />
      <div
        style={{
          marginTop: "20px",
          color: foregroundColor,
          opacity: 0.4,
          fontSize: "0.8rem",
        }}
      >
        esc to close
      </div>
    </div>
  );
}
