import { Search, X } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Suchen',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex h-11 items-center gap-2 rounded-[16px] bg-sand-200/70 px-3.5 text-ink-500">
      <Search size={17} strokeWidth={2} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} className="tap-highlight-none text-ink-400">
          <X size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
