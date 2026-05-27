import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: React.ReactNode;
  gradient?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  action,
  gradient = false,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`${
        gradient
          ? 'bg-gradient-to-br from-blue-600 to-cyan-500'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
              gradient
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1
            className={`text-xl md:text-2xl font-bold leading-tight truncate ${
              gradient ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-sm mt-0.5 truncate ${
                gradient ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
