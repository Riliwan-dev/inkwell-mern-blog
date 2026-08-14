import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Feather, Moon, Sun, Menu, X, PenLine, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/90 dark:bg-paper-dark/90 backdrop-blur border-b border-line dark:border-line-dark">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <Feather size={20} className="text-moss dark:text-moss-dark" strokeWidth={2} />
          Inkwell
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-moss dark:hover:text-moss-dark transition-colors">
            Home
          </Link>
          {user && (user.role === "author" || user.role === "admin") && (
            <Link to="/dashboard" className="hover:text-moss dark:hover:text-moss-dark transition-colors">
              Dashboard
            </Link>
          )}
          {user && (user.role === "author" || user.role === "admin") && (
            <Link
              to="/write"
              className="flex items-center gap-1.5 bg-moss text-paper px-3 py-1.5 rounded-full hover:bg-moss-dark transition-colors"
            >
              <PenLine size={14} />
              Write
            </Link>
          )}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-paper"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="border border-ink/20 dark:border-paper/20 px-4 py-1.5 rounded-full hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line dark:border-line-dark px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          {user && (user.role === "author" || user.role === "admin") && (
            <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
          {user && (user.role === "author" || user.role === "admin") && (
            <Link to="/write" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <PenLine size={16} /> Write
            </Link>
          )}
          <button onClick={toggleTheme} className="flex items-center gap-2 text-left">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} Toggle theme
          </button>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>
                Profile ({user.name})
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-left text-clay">
                <LogOut size={16} /> Log out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
