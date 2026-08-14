import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Trash2, Pencil, Eye } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import Loader from "../components/Loader";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
const resolveImage = (src) => (!src ? null : src.startsWith("http") ? src : `${API_ORIGIN}${src}`);

const PostDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/posts/${slug}`)
      .then(({ data }) => setPost(data.data))
      .catch(() => setError("This post doesn't exist or has been removed."))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't delete post.");
    }
  };

  if (loading) return <Loader label="Opening the page" />;
  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Page not found</h1>
        <p className="text-ink-soft dark:text-paper/60 mb-6">{error}</p>
        <Link to="/" className="text-moss dark:text-moss-dark underline">
          Back to all posts
        </Link>
      </div>
    );
  }

  const cover = resolveImage(post.coverImage);
  const isOwner = user && (user.id === post.author?._id || user.role === "admin");
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {post.status === "draft" && (
        <div className="mb-6 bg-mustard/10 border border-mustard/30 text-mustard text-sm px-4 py-2 rounded-lg">
          This is an unpublished draft — only you can see it.
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-mustard font-semibold mb-4">
          <span>{post.category}</span>
          <span className="text-ink/30 dark:text-paper/30">•</span>
          <span className="text-ink-soft dark:text-paper/50 normal-case tracking-normal font-normal">{date}</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight mb-6">{post.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-paper"
              style={{ backgroundColor: post.author?.avatarColor || "#2F6F5E" }}
            >
              {post.author?.name?.charAt(0).toUpperCase() || "?"}
            </span>
            <div>
              <p className="font-medium text-sm">{post.author?.name}</p>
              <p className="text-xs text-ink-soft dark:text-paper/50">{post.author?.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-ink-soft dark:text-paper/50">
              <Eye size={15} /> {post.views} views
            </span>
            {isOwner && (
              <>
                <Link
                  to={`/write/${post._id}`}
                  className="p-2 rounded-full border border-line dark:border-line-dark hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
                  aria-label="Edit post"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full border border-line dark:border-line-dark hover:bg-clay/10 hover:text-clay transition-colors"
                  aria-label="Delete post"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {cover && <img src={cover} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-xl mb-10" />}

      <div className="prose-inkwell">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-line dark:border-line-dark">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-ink/5 dark:bg-paper/10 text-ink-soft dark:text-paper/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <CommentSection postId={post._id} />
    </article>
  );
};

export default PostDetail;
