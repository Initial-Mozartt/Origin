import { useState, useEffect } from "react";
import { Search, Moon, Sun, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useTheme } from "next-themes";

const LINKS = [
  { name: "GitHub", url: "https://github.com" },
  { name: "Gmail", url: "https://mail.google.com" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "Reddit", url: "https://reddit.com" },
  { name: "X", url: "https://x.com" },
  { name: "Hacker News", url: "https://news.ycombinator.com" },
  { name: "ChatGPT", url: "https://chatgpt.com" },
  { name: "Linear", url: "https://linear.app" },
];

export function Startpage() {
  const [time, setTime] = useState(new Date());
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning.";
    if (hour < 18) return "Good afternoon.";
    return "Good evening.";
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    if (query) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ease-in-out">
      
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-accent/5 blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjwvc3ZnPg==')] opacity-50 mix-blend-overlay"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-3 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-300 backdrop-blur-sm border border-white/5"
          data-testid="button-theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </button>
      </div>

      <div className="w-full max-w-2xl px-6 z-10 flex flex-col items-center space-y-12">
        {/* Clock & Greeting */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-foreground font-[var(--font-display)]">
            {format(time, "HH:mm")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            {getGreeting()}
          </p>
        </div>

        {/* Search */}
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Search..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-secondary/30 hover:bg-secondary/50 focus:bg-secondary/80 border border-white/5 focus:border-primary/30 rounded-2xl outline-none text-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 backdrop-blur-md shadow-lg shadow-black/5"
              data-testid="input-search"
            />
            <button
              type="submit"
              className="absolute inset-y-2 right-2 px-3 rounded-xl bg-primary text-primary-foreground opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
              data-testid="button-search-submit"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          {LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="group flex flex-col items-center p-4 rounded-2xl hover:bg-secondary/40 transition-all duration-300 border border-transparent hover:border-white/5"
              data-testid={`link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 group-hover:bg-primary/10">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`}
                  alt={`${link.name} icon`}
                  className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
