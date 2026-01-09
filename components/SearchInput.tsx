import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-indigo-400 group-focus-within:text-indigo-600'}`} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "Loading database..." : "Enter Warehouse ID..."}
        className={`
          w-full pl-12 pr-4 py-4 rounded-xl text-lg font-medium outline-none transition-all duration-300
          border
          ${
            disabled
              ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-slate-800 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:shadow-md placeholder:text-gray-400'
          }
        `}
        autoComplete="off"
      />

      {value && !disabled && (
        <button 
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};