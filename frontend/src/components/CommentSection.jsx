import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val} ${name}${val > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadComments = async () => {
    try {
      const { data } = await api.get(`/posts/${postId}/comments`);
      setComments(data.data);
    } catch (err) {
      setError("Couldn't load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content: text.trim() });
      setComments((prev) => [data.data, ...prev]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't post your comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete comment.");
    }
  };

  return (
    <section className="mt-16 border-t border-line dark:border-line-dark pt-10">
      <h2 className="font-display text-2xl font-semibold mb-6">Comments ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts…"
            rows={3}
            maxLength={1000}
            className="w-full p-4 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors text-sm resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="bg-moss text-paper px-5 py-2 rounded-full text-sm font-medium hover:bg-moss-dark disabled:opacity-40 transition-colors"
            >
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-8 text-sm text-ink-soft dark:text-paper/60">
          <Link to="/login" className="text-moss dark:text-moss-dark underline">
            Sign in
          </Link>{" "}
          to join the discussion.
        </p>
      )}

      {error && <p className="text-clay text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-soft dark:text-paper/50">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-soft dark:text-paper/50">No comments yet. Be the first to say something.</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li key={c._id} className="flex gap-3">
              <span
                className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold text-paper"
                style={{ backgroundColor: c.author?.avatarColor || "#2F6F5E" }}
              >
                {c.author?.name?.charAt(0).toUpperCase() || "?"}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{c.author?.name || "Deleted user"}</span>
                  <span className="text-xs text-ink-soft dark:text-paper/40">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-soft dark:text-paper/80 leading-relaxed">{c.content}</p>
              </div>
              {user && (user.id === c.author?._id || user.role === "admin") && (
                <button
                  onClick={() => handleDelete(c._id)}
                  aria-label="Delete comment"
                  className="text-ink-soft dark:text-paper/30 hover:text-clay transition-colors h-fit"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CommentSection;
