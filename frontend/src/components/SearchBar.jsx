import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search posts by title, content, or tag…" }) => (
  <div className="relative">
    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft dark:text-paper/40" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-11 pr-10 py-3 rounded-full border border-line dark:border-line-dark bg-paper dark:bg-paper-dark focus:border-moss dark:focus:border-moss-dark outline-none transition-colors text-sm"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft dark:text-paper/40 hover:text-ink dark:hover:text-paper"
      >
        <X size={16} />
      </button>
    )}
  </div>
);

export default SearchBar;
