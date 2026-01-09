import React, { useState } from 'react';
import { Check, Copy, LucideIcon } from 'lucide-react';

interface ResultRowProps {
  label: string;
  value: string;
  icon: LucideIcon;
  colorClass: string;
}

export const ResultRow: React.FC<ResultRowProps> = ({ label, value, icon: Icon, colorClass }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value || value === '-') return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isPlaceholder = !value || value === '-';

  return (
    <div 
      onClick={handleCopy}
      className={`
        group relative flex items-center gap-4 p-4 mb-3 rounded-2xl border border-transparent
        transition-all duration-200 select-none
        ${isPlaceholder 
          ? 'bg-gray-50 opacity-60 cursor-default' 
          : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 cursor-pointer active:scale-[0.99] hover:bg-indigo-50/30'
        }
      `}
    >
      {/* Icon Bubble */}
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 transition-colors duration-200
        ${isPlaceholder ? 'bg-gray-200 text-gray-400' : `${colorClass} bg-opacity-10`}
      `}>
        <Icon className={`w-5 h-5 ${isPlaceholder ? 'text-gray-400' : colorClass.replace('bg-', 'text-')}`} />
      </div>

      {/* Text Content */}
      <div className="flex-grow min-w-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className={`text-sm font-semibold truncate ${isPlaceholder ? 'text-gray-400' : 'text-slate-700'}`}>
          {value}
        </p>
      </div>

      {/* Action Status */}
      {!isPlaceholder && (
        <div className="flex-shrink-0">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
            ${copied ? 'bg-green-100 text-green-600 scale-110' : 'bg-transparent text-gray-300 group-hover:text-indigo-400'}
          `}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </div>
        </div>
      )}
    </div>
  );
};