import { useState } from "react";

export interface ReadingItem {
  id: string;
  title: string;
  url: string;
  addedAt: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  readingList: ReadingItem[];
  onUpdate: (items: ReadingItem[]) => void;
  hoverColor: string;
  foregroundColor: string;
  bgColor: string;
  openInNewTab: boolean;
}

const S = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "flex-end",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  panel: {
    width: "400px",
    maxWidth: "100vw",
    backgroundColor: "#1e1f29",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginBottom: "24px",
    padding: "16px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "4px",
  },
  input: {
    backgroundColor: "#111",
    border: "1px solid #333",
    borderRadius: "4px",
    color: "inherit",
    padding: "8px",
    fontSize: "0.9rem",
    outline: "none",
  },
  btn: {
    backgroundColor: "#ff79c6",
    border: "none",
    borderRadius: "4px",
    color: "#282a36",
    padding: "8px",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  list: {
    flex: 1,
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "8px 0",
    borderBottom: "1px solid #2a2a3a",
  },
  itemTitle: {
    fontSize: "1rem",
    color: "inherit",
    textDecoration: "none",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ff5555",
    cursor: "pointer",
    fontSize: "1rem",
    opacity: 0.6,
  },
  empty: {
    textAlign: "center" as const,
    opacity: 0.5,
    marginTop: "40px",
  }
};

export function ReadingList({ isOpen, onClose, readingList, onUpdate, hoverColor, foregroundColor, bgColor, openInNewTab }: Props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    const newItem: ReadingItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: url.startsWith("http") ? url : `https://${url}`,
      title: title || url,
      addedAt: Date.now(),
    };
    onUpdate([...readingList, newItem]);
    setUrl("");
    setTitle("");
  };

  const handleDelete = (id: string) => {
    onUpdate(readingList.filter(item => item.id !== id));
  };

  return (
    <div 
      style={S.overlay} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={0}
      data-testid="reading-list-overlay"
    >
      <div style={{ ...S.panel, backgroundColor: bgColor || "#1e1f29", color: foregroundColor }}>
        <div style={S.header}>
          <h3 style={S.title}>Reading List</h3>
          <button onClick={onClose} style={{ ...S.deleteBtn, color: foregroundColor, fontSize: "1.5rem" }} data-testid="reading-list-close">✕</button>
        </div>

        <form style={S.form} onSubmit={handleAdd}>
          <input 
            placeholder="URL" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            style={S.input}
            data-testid="reading-list-input-url"
          />
          <input 
            placeholder="Title (optional)" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            style={S.input}
            data-testid="reading-list-input-title"
          />
          <button type="submit" style={{ ...S.btn, backgroundColor: hoverColor }} data-testid="reading-list-add">Save</button>
        </form>

        <div style={S.list}>
          {readingList.length === 0 ? (
            <div style={S.empty}>No saved articles</div>
          ) : (
            readingList.map(item => (
              <div key={item.id} style={S.item} data-testid={`reading-item-${item.id}`}>
                <a 
                  href={item.url} 
                  target={openInNewTab ? "_blank" : "_self"} 
                  rel="noopener noreferrer"
                  style={S.itemTitle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = foregroundColor)}
                >
                  {item.title}
                </a>
                <button onClick={() => handleDelete(item.id)} style={S.deleteBtn} data-testid={`reading-delete-${item.id}`}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
