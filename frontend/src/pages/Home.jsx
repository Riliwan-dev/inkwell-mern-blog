import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ categories: [], tags: [] });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/posts", {
        params: { search, category, page, limit: 6 },
      });
      setPosts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError("Couldn't load posts. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    api
      .get("/posts/meta/filters")
      .then(({ data }) => setMeta(data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <p className="text-mustard text-xs font-semibold uppercase tracking-widest mb-3">Volume I, est. 2026</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
          Ideas worth <span className="italic text-moss dark:text-moss-dark">the ink</span>.
        </h1>
        <p className="text-ink-soft dark:text-paper/60 text-lg">
          Long-form writing on engineering, design, and the craft of building things well.
        </p>
      </div>

      <div className="mb-8 max-w-xl mx-auto">
        <SearchBar value={search} onChange={(v) => updateParam("search", v)} />
      </div>

      {meta.categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => updateParam("category", "")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              !category
                ? "bg-ink text-paper dark:bg-paper dark:text-ink border-transparent"
                : "border-line dark:border-line-dark hover:bg-ink/5 dark:hover:bg-paper/10"
            }`}
          >
            All
          </button>
          {meta.categories.map((c) => (
            <button
              key={c}
              onClick={() => updateParam("category", c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === c
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink border-transparent"
                  : "border-line dark:border-line-dark hover:bg-ink/5 dark:hover:bg-paper/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader label="Fetching posts" />
      ) : error ? (
        <p className="text-center text-clay py-16">{error}</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-xl mb-2">Nothing here yet.</p>
          <p className="text-ink-soft dark:text-paper/50 text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(p) => updateParam("page", p)} />
        </>
      )}
    </div>
  );
};

export default Home;
