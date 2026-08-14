import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "reader" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold mb-2 text-center">Create an account</h1>
      <p className="text-center text-ink-soft dark:text-paper/60 mb-8 text-sm">
        Join Inkwell as a reader, or as an author to start publishing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors"
            placeholder="Ada Lovelace"
          />
        </div>
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
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Account type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "reader", label: "Reader", desc: "Read & comment" },
              { value: "author", label: "Author", desc: "Publish posts" },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setForm({ ...form, role: opt.value })}
                className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                  form.role === opt.value
                    ? "border-moss bg-moss/5"
                    : "border-line dark:border-line-dark hover:bg-ink/5 dark:hover:bg-paper/10"
                }`}
              >
                <p className="font-medium text-sm">{opt.label}</p>
                <p className="text-xs text-ink-soft dark:text-paper/50">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-moss text-paper py-2.5 rounded-lg font-medium hover:bg-moss-dark disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-soft dark:text-paper/60 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-moss dark:text-moss-dark underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
