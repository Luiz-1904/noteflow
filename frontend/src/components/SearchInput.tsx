export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="search-field">
      <span>Search by title</span>
      <input
        aria-label="Search notes by title"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search notes, ideas, or drafts"
        type="search"
        value={value}
      />
    </label>
  );
}
