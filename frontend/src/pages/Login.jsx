import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold mb-2 text-center">Welcome back</h1>
      <p className="text-center text-ink-soft dark:text-paper/60 mb-8 text-sm">Sign in to continue reading and writing.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-moss text-paper py-2.5 rounded-lg font-medium hover:bg-moss-dark disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-soft dark:text-paper/60 mt-6">
        New here?{" "}
        <Link to="/register" className="text-moss dark:text-moss-dark underline">
          Create an account
        </Link>
      </p>

      <div className="mt-10 pt-6 border-t border-line dark:border-line-dark text-xs text-ink-soft dark:text-paper/40 text-center space-y-1">
        <p>Demo accounts (after running the seed script):</p>
        <p>admin@inkwell.io / Admin123!</p>
        <p>author@inkwell.io / Author123!</p>
      </div>
    </div>
  );
};

export default Login;
