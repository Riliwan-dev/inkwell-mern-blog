import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await updateProfile(form);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="flex flex-col items-center mb-8">
        <span
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold text-paper mb-3"
          style={{ backgroundColor: user.avatarColor }}
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <h1 className="font-display text-2xl font-semibold">{user.name}</h1>
        <p className="text-sm text-ink-soft dark:text-paper/50 capitalize">{user.role} · {user.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            maxLength={300}
            placeholder="A short bio shown on your posts"
            className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors resize-none"
          />
        </div>

        {message && <p className="text-moss dark:text-moss-dark text-sm">{message}</p>}
        {error && <p className="text-clay text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-moss text-paper py-2.5 rounded-lg font-medium hover:bg-moss-dark disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
