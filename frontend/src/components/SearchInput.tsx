export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="search-field">
      <span>Buscar por título</span>
      <input
        aria-label="Buscar notas por título"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ex.: estudar go"
        type="search"
        value={value}
      />
    </label>
  );
}
