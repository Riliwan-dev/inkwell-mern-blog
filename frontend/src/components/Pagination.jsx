import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 rounded-full border border-line dark:border-line-dark disabled:opacity-30 hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) => (
        <span key={p} className="flex items-center">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-ink-soft dark:text-paper/40">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
              p === page
                ? "bg-moss text-paper"
                : "border border-line dark:border-line-dark hover:bg-ink/5 dark:hover:bg-paper/10"
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-2 rounded-full border border-line dark:border-line-dark disabled:opacity-30 hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
