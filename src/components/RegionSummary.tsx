type SummaryItem = { key: string; count: number };

type RegionSummaryProps = {
  items: SummaryItem[];
  selected?: string;
  onSelect: (key: string) => void;
};

export const RegionSummary = ({ items, selected, onSelect }: RegionSummaryProps) => (
  <div className="card-surface p-4">
    <h3 className="section-title">Regioni più attive</h3>
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item.key}>
          <button
            type="button"
            onClick={() => onSelect(item.key)}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
              selected === item.key
                ? 'border-brand-500 bg-brand-600/20 text-brand-50'
                : 'border-slate-700 bg-slate-800/70 text-slate-200 hover:border-brand-500/60'
            }`}
          >
            <span>{item.key}</span>
            <span className="font-semibold">{item.count}</span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);
