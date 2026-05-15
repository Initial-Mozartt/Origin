export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  todos: Todo[];
  onUpdate: (todos: Todo[]) => void;
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
    gap: "12px",
    width: "100%",
    maxHeight: "60vh",
    overflowY: "auto" as const,
    paddingRight: "10px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "1.1rem",
    padding: "8px 0",
    group: true,
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
    accentColor: "currentColor",
  },
  text: {
    flex: 1,
    cursor: "pointer",
  },
  completedText: {
    textDecoration: "line-through",
    opacity: 0.5,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ff5555",
    cursor: "pointer",
    fontSize: "1.2rem",
    padding: "4px 8px",
    opacity: 0.6,
  },
  footer: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.9rem",
    opacity: 0.6,
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
    fontSize: "inherit",
  }
};

export function TodoList({ isOpen, onClose, todos, onUpdate, hoverColor, foregroundColor, bgColor }: Props) {
  if (!isOpen) return null;

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value.trim();
    if (e.key === "Enter" && text) {
      const newTodo: Todo = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        completed: false,
        createdAt: Date.now(),
      };
      onUpdate([newTodo, ...todos]);
      e.currentTarget.value = "";
    }
  };

  const toggleTodo = (id: string) => {
    onUpdate(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    onUpdate(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    onUpdate(todos.filter(t => !t.completed));
  };

  return (
    <div 
      style={{ ...S.overlay, color: foregroundColor }} 
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={0}
      data-testid="todo-overlay"
    >
      <div style={S.container}>
        <div style={S.header}>
          <h2 style={S.title}>To-do</h2>
          <button 
            onClick={onClose} 
            style={{ ...S.deleteBtn, color: foregroundColor, fontSize: "1.5rem" }}
            data-testid="todo-close"
          >
            ✕
          </button>
        </div>

        <input
          autoFocus
          placeholder="Add a task..."
          style={{ ...S.input, borderBottomColor: hoverColor }}
          onKeyDown={handleAdd}
          data-testid="todo-input"
        />

        <div style={S.list}>
          {todos.map(todo => (
            <div key={todo.id} style={S.item} data-testid={`todo-item-${todo.id}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={S.checkbox}
                data-testid={`todo-checkbox-${todo.id}`}
              />
              <span 
                style={{ ...S.text, ...(todo.completed ? S.completedText : {}) }}
                onClick={() => toggleTodo(todo.id)}
                data-testid={`todo-text-${todo.id}`}
              >
                {todo.text}
              </span>
              <button 
                onClick={() => deleteTodo(todo.id)} 
                style={S.deleteBtn}
                data-testid={`todo-delete-${todo.id}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {todos.length > 0 && (
          <div style={S.footer}>
            <span>{todos.filter(t => !t.completed).length} items left</span>
            <button onClick={clearCompleted} style={S.clearBtn} data-testid="todo-clear-completed">
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
