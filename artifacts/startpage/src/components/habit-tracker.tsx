export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // YYYY-MM-DD
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onUpdate: (habits: Habit[]) => void;
  hoverColor: string;
  foregroundColor: string;
  bgColor: string;
}

const S = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "60px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 300,
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    background: "none",
    border: "none",
    borderBottom: "2px solid #333",
    color: "inherit",
    fontSize: "1.5rem",
    padding: "8px 0",
    outline: "none",
    transition: "border-color 0.2s",
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
    width: "100%",
    maxHeight: "60vh",
    overflowY: "auto" as const,
    paddingRight: "10px",
  },
  item: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    padding: "16px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "4px",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitName: {
    fontSize: "1.2rem",
    fontWeight: 500,
  },
  streakContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "1px solid currentColor",
  },
  activeDot: {
    backgroundColor: "currentColor",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ff5555",
    cursor: "pointer",
    fontSize: "1rem",
    opacity: 0.6,
  },
  todayCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    opacity: 0.8,
  }
};

export function HabitTracker({ isOpen, onClose, habits, onUpdate, hoverColor, foregroundColor, bgColor }: Props) {
  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value.trim();
    if (e.key === "Enter" && name) {
      const newHabit: Habit = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        completedDates: [],
      };
      onUpdate([...habits, newHabit]);
      e.currentTarget.value = "";
    }
  };

  const toggleHabit = (id: string, date: string) => {
    onUpdate(habits.map(h => {
      if (h.id !== id) return h;
      const completed = h.completedDates.includes(date);
      return {
        ...h,
        completedDates: completed 
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date]
      };
    }));
  };

  const deleteHabit = (id: string) => {
    onUpdate(habits.filter(h => h.id !== id));
  };

  const getStreak = (completedDates: string[]) => {
    let streak = 0;
    const sorted = [...completedDates].sort().reverse();
    let current = new Date();
    
    // If not completed today, check if completed yesterday to continue streak
    if (!completedDates.includes(current.toISOString().split("T")[0])) {
      current.setDate(current.getDate() - 1);
    }

    while (completedDates.includes(current.toISOString().split("T")[0])) {
      streak++;
      current.setDate(current.getDate() - 1);
    }
    return streak;
  };

  return (
    <div 
      style={{ ...S.overlay, color: foregroundColor }}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={0}
      data-testid="habit-overlay"
    >
      <div style={S.container}>
        <div style={S.header}>
          <h2 style={S.title}>Habits</h2>
          <button onClick={onClose} style={{ ...S.deleteBtn, color: foregroundColor, fontSize: "1.5rem" }} data-testid="habit-close">✕</button>
        </div>

        <input
          autoFocus
          placeholder="New habit..."
          style={{ ...S.input, borderBottomColor: hoverColor }}
          onKeyDown={handleAdd}
          data-testid="habit-input"
        />

        <div style={S.list}>
          {habits.map(habit => (
            <div key={habit.id} style={S.item} data-testid={`habit-item-${habit.id}`}>
              <div style={S.itemHeader}>
                <span style={S.habitName}>{habit.name}</span>
                <div style={S.streakContainer}>
                  <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{getStreak(habit.completedDates)} day streak</span>
                  <button onClick={() => deleteHabit(habit.id)} style={S.deleteBtn} data-testid={`habit-delete-${habit.id}`}>✕</button>
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {last7Days.map(date => (
                    <div 
                      key={date}
                      title={date}
                      style={{ 
                        ...S.dot, 
                        ...(habit.completedDates.includes(date) ? { ...S.activeDot, backgroundColor: hoverColor, borderColor: hoverColor } : {}) 
                      }}
                    />
                  ))}
                </div>
                
                <label style={S.todayCheckbox}>
                  <input
                    type="checkbox"
                    checked={habit.completedDates.includes(today)}
                    onChange={() => toggleHabit(habit.id, today)}
                    style={{ accentColor: hoverColor }}
                    data-testid={`habit-checkbox-${habit.id}`}
                  />
                  Today
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
