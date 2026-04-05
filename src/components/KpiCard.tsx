import clsx from 'clsx';

type KpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  onClick?: () => void;
  active?: boolean;
};

export const KpiCard = ({ title, value, subtitle, onClick, active }: KpiCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'card-surface w-full p-4 text-left transition hover:border-brand-500/60 hover:bg-slate-800/70',
      active && 'border-brand-500/70 shadow-glow',
      !onClick && 'cursor-default',
    )}
  >
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    {subtitle ? <p className="mt-2 text-sm text-slate-300">{subtitle}</p> : null}
  </button>
);
