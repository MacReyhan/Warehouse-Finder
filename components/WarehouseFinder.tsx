import React, { useEffect, useState, useMemo } from 'react';
import { RefreshCw, MessageCircle, MapPin, User, Phone, Mail, Database } from 'lucide-react';
import { getAllData } from '../services/warehouseService';
import { Warehouse } from '../types';
import { SearchInput } from './SearchInput';
import { ResultRow } from './ResultRow';

export const WarehouseFinder: React.FC = () => {
  const [data, setData] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchId, setSearchId] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllData();
        setData(result);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const activeResult = useMemo(() => {
    const trimmedSearch = searchId.trim().toLowerCase();
    if (!trimmedSearch) return null;
    return data.find((item) => item.id.toLowerCase() === trimmedSearch) || null;
  }, [searchId, data]);

  return (
    <div className="w-full max-w-[420px]">
      {/* Header Area */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
          Warehouse Finder
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm">
          {(loading || error) ? (
            <span className={`flex items-center gap-1.5 font-medium ${error ? 'text-red-500' : 'text-indigo-500'}`}>
               {error ? 'Connection Failed' : 'Syncing Database'}
               {!error && <RefreshCw className="w-3 h-3 animate-spin" />}
            </span>
          ) : (
             <span className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {data.length} Locations Active
             </span>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white p-6 rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
        
        <SearchInput 
          value={searchId} 
          onChange={setSearchId} 
          disabled={loading || error} 
        />

        {/* Results Container - Smooth height transition */}
        <div className={`
           transition-all duration-500 ease-in-out overflow-hidden
           ${activeResult ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}
        `}>
          <div className="space-y-1">
            <ResultRow 
              label="City / Location" 
              value={activeResult?.city || '-'} 
              icon={MapPin}
              colorClass="bg-blue-500"
            />
            <ResultRow 
              label="Manager" 
              value={activeResult?.manager || '-'} 
              icon={User}
              colorClass="bg-purple-500"
            />
            <ResultRow 
              label="Direct Contact" 
              value={activeResult?.contact || '-'} 
              icon={Phone}
              colorClass="bg-emerald-500"
            />
            <ResultRow 
              label="Email Address" 
              value={activeResult?.email || '-'} 
              icon={Mail}
              colorClass="bg-pink-500"
            />
          </div>

          {activeResult?.chatLink && (
            <a
              href={activeResult.chatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group flex items-center justify-center gap-2 w-full mt-6 
                bg-gradient-to-r from-amber-500 to-orange-600 
                hover:from-amber-600 hover:to-orange-700
                text-white p-4 rounded-xl font-bold text-sm uppercase tracking-wide
                shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40
                transition-all duration-200 transform active:scale-[0.98]
              "
            >
              Start Conversation
              <MessageCircle className="w-5 h-5 fill-white/20 group-hover:fill-white/40 transition-colors" />
            </a>
          )}
        </div>

        {/* Empty State Hint */}
        {!loading && !activeResult && searchId.trim().length > 0 && (
          <div className="mt-8 text-center pb-2">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
               <Database className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No warehouse found</p>
            <p className="text-gray-400 text-xs mt-1">Check the ID and try again</p>
          </div>
        )}
      </div>
      
      {/* Footer Branding */}
      <div className="mt-8 text-center">
         <p className="text-slate-400 text-xs font-medium">Internal Logistics Tool v2.0</p>
      </div>
    </div>
  );
};