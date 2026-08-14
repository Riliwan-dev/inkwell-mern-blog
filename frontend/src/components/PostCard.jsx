import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const resolveImage = (src) => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${API_ORIGIN}${src}`;
};

const PostCard = ({ post }) => {
  const cover = resolveImage(post.coverImage);
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group border border-line dark:border-line-dark rounded-xl overflow-hidden bg-paper dark:bg-paper-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <Link to={`/posts/${post.slug}`}>
        <div className="aspect-[16/9] bg-ink/5 dark:bg-paper/5 overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-3xl text-ink/20 dark:text-paper/20">
              {post.title.charAt(0)}
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-mustard font-semibold mb-2">
          <span>{post.category}</span>
          <span className="text-ink/30 dark:text-paper/30">•</span>
          <span className="text-ink-soft dark:text-paper/50 normal-case tracking-normal font-normal">{date}</span>
        </div>
        <Link to={`/posts/${post.slug}`}>
          <h2 className="font-display text-xl font-semibold leading-snug mb-2 group-hover:text-moss dark:group-hover:text-moss-dark transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed mb-4 line-clamp-2">
          {post.excerpt || post.content.replace(/[#*_`>-]/g, "").slice(0, 140) + "…"}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-paper"
              style={{ backgroundColor: post.author?.avatarColor || "#2F6F5E" }}
            >
              {post.author?.name?.charAt(0).toUpperCase() || "?"}
            </span>
            <span className="text-ink-soft dark:text-paper/60">{post.author?.name || "Unknown"}</span>
          </div>
          <span className="flex items-center gap-1 text-ink-soft dark:text-paper/50 text-xs">
            <Eye size={13} /> {post.views ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
