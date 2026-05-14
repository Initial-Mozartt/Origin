import { useState, useEffect } from "react";

interface RssFeedItem {
  title: string;
  link: string;
}

interface RssFeedProps {
  url: string;
  label: string;
  maxItems: number;
  columnBgColor: string;
  hoverColor: string;
  foregroundColor: string;
}

export function RssFeed({
  url,
  label,
  maxItems,
  columnBgColor,
  hoverColor,
  foregroundColor,
}: RssFeedProps) {
  const [items, setItems] = useState<RssFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      setError(false);
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const entryElements = Array.from(xmlDoc.querySelectorAll("item, entry")).slice(0, maxItems);

        const parsedItems = entryElements.map((entry) => {
          const title = entry.querySelector("title")?.textContent || "No title";
          let link = entry.querySelector("link")?.getAttribute("href") || entry.querySelector("link")?.textContent || "#";
          return { title, link };
        });

        setItems(parsedItems);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (url) {
      fetchFeed();
    }
  }, [url, maxItems]);

  return (
    <div
      style={{
        backgroundColor: columnBgColor,
        padding: "20px",
        width: "140px",
        borderRadius: "2px",
        display: "flex",
        flexDirection: "column",
      }}
      data-testid={`rss-column-${label}`}
    >
      <h3
        style={{
          marginTop: 0,
          fontSize: "1rem",
          marginBottom: "15px",
          color: foregroundColor,
          textAlign: "left",
          fontWeight: "bold",
        }}
      >
        {label}
      </h3>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {loading && <li style={{ color: foregroundColor, opacity: 0.4, fontSize: "0.85rem" }}>loading...</li>}
        {error && <li style={{ color: foregroundColor, opacity: 0.4, fontSize: "0.85rem" }}>unavailable</li>}
        {!loading && !error && items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "6px" }}>
            <a
              href={item.link}
              style={{
                color: "#999",
                textDecoration: "none",
                fontSize: "0.85rem",
                transition: "color 0.1s",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
              data-testid={`rss-link-${idx}`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
