interface BadgeProps {
  label: string;
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'gray' | 'cyan';
  size?: 'sm' | 'xs';
}

const variants: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
};

export default function Badge({ label, variant = 'blue', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center border rounded-full font-medium ${
        size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'
      } ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
