import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImagePlus, Eye, Pencil } from "lucide-react";
import api from "../api/axios";
import Loader from "../components/Loader";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
const resolveImage = (src) => (!src ? null : src.startsWith("http") || src.startsWith("data:") ? src : `${API_ORIGIN}${src}`);

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "General",
  tags: "",
  status: "published",
};

const CreateEditPost = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [tab, setTab] = useState("write");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing post for editing — backend looks up by slug, so we fetch all "mine" posts and find by id.
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    api
      .get("/posts", { params: { mine: true, limit: 100 } })
      .then(({ data }) => {
        const post = data.data.find((p) => p._id === id);
        if (!post) {
          setError("Post not found or you don't have permission to edit it.");
          return;
        }
        setForm({
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content,
          category: post.category,
          tags: (post.tags || []).join(", "),
          status: post.status,
        });
        setCoverPreview(resolveImage(post.coverImage));
      })
      .catch(() => setError("Couldn't load this post."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e, statusOverride) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("category", form.category || "General");
      fd.append("tags", form.tags);
      fd.append("status", statusOverride || form.status);
      if (coverFile) fd.append("coverImage", coverFile);

      let res;
      if (isEdit) {
        res = await api.put(`/posts/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        res = await api.post("/posts", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      navigate(`/posts/${res.data.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save your post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading editor" />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold mb-8">{isEdit ? "Edit post" : "Write a new post"}</h1>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="A compelling headline"
            className="w-full px-4 py-3 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors text-lg font-display"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Cover image</label>
          <div className="flex items-center gap-4">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="w-32 h-20 object-cover rounded-lg border border-line dark:border-line-dark" />
            ) : (
              <div className="w-32 h-20 rounded-lg border border-dashed border-line dark:border-line-dark flex items-center justify-center text-ink-soft dark:text-paper/30">
                <ImagePlus size={20} />
              </div>
            )}
            <label className="cursor-pointer text-sm text-moss dark:text-moss-dark underline">
              {coverPreview ? "Change image" : "Upload image"}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Engineering, Design, Writing…"
              className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="nodejs, mongodb, tutorial"
              className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Excerpt (optional)</label>
          <input
            type="text"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="A one-line summary shown on the homepage"
            maxLength={300}
            className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium">Content (Markdown supported)</label>
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${tab === "write" ? "bg-ink/10 dark:bg-paper/10" : ""}`}
              >
                <Pencil size={12} /> Write
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${tab === "preview" ? "bg-ink/10 dark:bg-paper/10" : ""}`}
              >
                <Eye size={12} /> Preview
              </button>
            </div>
          </div>

          {tab === "write" ? (
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="# Start writing...\n\nMarkdown is fully supported: **bold**, *italic*, `code`, lists, and more."
              rows={16}
              className="w-full px-4 py-3 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors font-mono text-sm resize-y"
            />
          ) : (
            <div className="prose-inkwell border border-line dark:border-line-dark rounded-lg p-4 min-h-[300px]">
              {form.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
              ) : (
                <p className="text-ink-soft dark:text-paper/40 text-sm">Nothing to preview yet.</p>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-moss text-paper px-5 py-2.5 rounded-full font-medium hover:bg-moss-dark disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={(e) => handleSubmit(e, "draft")}
            className="border border-line dark:border-line-dark px-5 py-2.5 rounded-full font-medium hover:bg-ink/5 dark:hover:bg-paper/10 disabled:opacity-50 transition-colors"
          >
            Save as draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPost;
