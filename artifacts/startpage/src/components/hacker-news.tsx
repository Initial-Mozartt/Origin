import { useState, useEffect } from "react";

interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  descendants: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  count: number;
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
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  panel: {
    width: "100%",
    maxWidth: "600px",
    maxHeight: "80vh",
    backgroundColor: "#1e1f29",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid #333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    margin: 0,
  },
  content: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "10px 0",
  },
  story: {
    padding: "12px 20px",
    display: "flex",
    gap: "12px",
    borderBottom: "1px solid #2a2a3a",
  },
  rank: {
    fontSize: "0.9rem",
    opacity: 0.5,
    minWidth: "24px",
    textAlign: "right" as const,
  },
  storyBody: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  storyTitle: {
    fontSize: "1rem",
    color: "inherit",
    textDecoration: "none",
    fontWeight: 500,
  },
  storyMeta: {
    fontSize: "0.8rem",
    opacity: 0.6,
  },
  loading: {
    padding: "40px",
    textAlign: "center" as const,
    opacity: 0.6,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "1.2rem",
    padding: "4px",
  }
};

export function HackerNews({ isOpen, onClose, count, hoverColor, foregroundColor, bgColor, openInNewTab }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStories();
    }
  }, [isOpen, count]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const ids = await res.json();
      const topIds = ids.slice(0, count);
      
      const storyPromises = topIds.map(async (id: number) => {
        const sRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return sRes.json();
      });
      
      const results = await Promise.all(storyPromises);
      setStories(results);
    } catch (err) {
      console.error("Failed to fetch HN stories", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={S.overlay} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={0}
      data-testid="hn-overlay"
    >
      <div style={{ ...S.panel, backgroundColor: bgColor || "#1e1f29", color: foregroundColor }}>
        <div style={S.header}>
          <h3 style={S.title}>Hacker News</h3>
          <button onClick={onClose} style={S.closeBtn} data-testid="hn-close">✕</button>
        </div>
        
        <div style={S.content}>
          {loading ? (
            <div style={S.loading}>Loading stories...</div>
          ) : (
            stories.map((story, i) => {
              const domain = story.url ? new URL(story.url).hostname.replace("www.", "") : "";
              return (
                <div key={story.id} style={S.story} data-testid={`hn-story-${story.id}`}>
                  <span style={S.rank}>{i + 1}.</span>
                  <div style={S.storyBody}>
                    <a 
                      href={story.url} 
                      target={openInNewTab ? "_blank" : "_self"} 
                      rel="noopener noreferrer"
                      style={{ ...S.storyTitle, color: foregroundColor }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = foregroundColor)}
                    >
                      {story.title}
                    </a>
                    <div style={S.storyMeta}>
                      {story.score} points by {story.by} | {story.descendants} comments {domain && `| ${domain}`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
