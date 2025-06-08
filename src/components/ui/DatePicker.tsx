type Props = {
  from: string | null;
  to: string | null;
  onChange: (range: { from: string | null; to: string | null }) => void;
};

export function DatePicker({ from, to, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from ?? ""}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--electric-blue)] rounded-xl px-3 py-2 text-sm shadow-md"
      />
      <span className="text-[var(--foreground)] text-sm">a</span>
      <input
        type="date"
        value={to ?? ""}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--electric-blue)] rounded-xl px-3 py-2 text-sm shadow-md"
      />
    </div>
  );
}
