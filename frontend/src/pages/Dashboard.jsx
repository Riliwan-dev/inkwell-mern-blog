import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Eye, PenLine } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/posts", { params: { mine: true, limit: 50 } });
      setPosts(data.data);
    } catch (err) {
      setError("Couldn't load your posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't delete post.");
    }
  };

  const published = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl font-semibold">Your dashboard</h1>
          <p className="text-ink-soft dark:text-paper/60 text-sm mt-1">
            {published.length} published · {drafts.length} draft{drafts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/write"
          className="flex items-center gap-2 bg-moss text-paper px-4 py-2 rounded-full text-sm font-medium hover:bg-moss-dark transition-colors"
        >
          <PenLine size={16} /> New post
        </Link>
      </div>

      {loading ? (
        <Loader label="Gathering your posts" />
      ) : error ? (
        <p className="text-clay text-center py-16">{error}</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-line dark:border-line-dark rounded-xl">
          <p className="font-display text-xl mb-2">Nothing published yet.</p>
          <p className="text-ink-soft dark:text-paper/50 text-sm mb-6">Start with your first post — it only takes a few minutes.</p>
          <Link to="/write" className="text-moss dark:text-moss-dark underline text-sm">
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="flex items-center justify-between gap-4 p-4 border border-line dark:border-line-dark rounded-xl hover:bg-ink/[0.02] dark:hover:bg-paper/[0.03] transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      post.status === "published" ? "bg-moss/10 text-moss dark:text-moss-dark" : "bg-mustard/10 text-mustard"
                    }`}
                  >
                    {post.status}
                  </span>
                  <span className="text-xs text-ink-soft dark:text-paper/40">{post.category}</span>
                </div>
                <Link to={`/posts/${post.slug}`} className="font-medium hover:text-moss dark:hover:text-moss-dark transition-colors truncate block">
                  {post.title}
                </Link>
                <p className="flex items-center gap-1 text-xs text-ink-soft dark:text-paper/40 mt-1">
                  <Eye size={12} /> {post.views} views · {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/write/${post._id}`}
                  className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-2 rounded-full hover:bg-clay/10 hover:text-clay transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
