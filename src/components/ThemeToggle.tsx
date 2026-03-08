import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { memo } from "react";

const ThemeToggle = memo(() => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-full hover:bg-secondary transition-colors duration-300 group"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      ) : (
        <Sun className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";
export default ThemeToggle;
