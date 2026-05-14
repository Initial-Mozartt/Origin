import { forwardRef } from "react";

interface SearchBarProps {
  engine: "google" | "duckduckgo" | "brave" | "bing";
  foregroundColor: string;
}

const ENGINES = {
  google: { name: "Google", url: "https://google.com/search?q=" },
  duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  brave: { name: "Brave", url: "https://search.brave.com/search?q=" },
  bing: { name: "Bing", url: "https://bing.com/search?q=" },
};

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ engine, foregroundColor }, ref) => {
    const currentEngine = ENGINES[engine] || ENGINES.google;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
      if (query.trim()) {
        window.location.href = `${currentEngine.url}${encodeURIComponent(query)}`;
      }
    };

    return (
      <div
        style={{
          marginBottom: "20px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            ref={ref}
            name="q"
            type="text"
            data-testid="input-search"
            autoComplete="off"
            style={{
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              color: foregroundColor,
              padding: "10px 15px",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder={`Search ${currentEngine.name}...`}
          />
        </form>
        <div
          style={{
            fontSize: "0.7rem",
            color: foregroundColor,
            opacity: 0.5,
            marginTop: "4px",
            textTransform: "lowercase",
          }}
          data-testid="text-search-engine"
        >
          {currentEngine.name}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
