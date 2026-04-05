type SummaryItem = { key: string; count: number };

type CategorySummaryProps = {
  items: SummaryItem[];
  selected?: string;
  onSelect: (key: string) => void;
};

export const CategorySummary = ({ items, selected, onSelect }: CategorySummaryProps) => (
  <div className="card-surface p-4">
    <h3 className="section-title">Categorie più presenti</h3>
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onSelect(item.key)}
          className={`rounded-full border px-3 py-1 text-sm transition ${
            selected === item.key
              ? 'border-brand-500 bg-brand-600/30 text-brand-50'
              : 'border-slate-600 bg-slate-800/70 text-slate-200 hover:border-brand-500/60'
          }`}
        >
          {item.key} · {item.count}
        </button>
      ))}
    </div>
  </div>
);
