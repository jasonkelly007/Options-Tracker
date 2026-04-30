import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { optionsApi } from '../api/client';
import type { OptionsPosition } from '../types';
import PositionCard from '../components/PositionCard';

export default function Options() {
  const [options, setOptions] = useState<OptionsPosition[]>([]);
  const [filter, setFilter] = useState<string>('Open');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptions();
  }, [filter]);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const response = await optionsApi.getAll(undefined, filter);
      setOptions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id: number) => {
    const price = prompt('Enter closing price per contract:');
    if (price && !isNaN(parseFloat(price))) {
      try {
        await optionsApi.close(id, parseFloat(price));
        loadOptions();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const coveredCalls = options.filter(o => o.strategy === 'CoveredCall');
  const cashSecuredPuts = options.filter(o => o.strategy === 'CashSecuredPut');
  const otherOptions = options.filter(o => o.strategy !== 'CoveredCall' && o.strategy !== 'CashSecuredPut');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Options</h1>
        <Link
          to="/options/new"
          className="p-3 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>

      <div className="flex px-2 overflow-x-auto no-scrollbar space-x-2 py-2">
        {['Open', 'Closed', 'Rolled', 'Expired', 'Assigned'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              filter === f 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {coveredCalls.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 px-2 flex justify-between">
                <span>Covered Calls</span>
                <span className="text-slate-400 font-medium">{coveredCalls.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coveredCalls.map(o => (
                  <PositionCard
                    key={o.id}
                    symbol={o.underlyingSymbol}
                    type="Covered Call"
                    status={o.status}
                    details={{
                      contracts: o.contracts,
                      strike: o.strikePrice,
                      expiration: o.expirationDate,
                      currentPrice: o.currentPrice,
                      daysToExpiration: o.daysToExpiration
                    }}
                    pnl={o.unrealizedPnL}
                    actions={
                      o.status === 'Open' && (
                        <button onClick={() => handleClose(o.id)} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Close</button>
                      )
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {cashSecuredPuts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 px-2 flex justify-between">
                <span>Cash Secured Puts</span>
                <span className="text-slate-400 font-medium">{cashSecuredPuts.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cashSecuredPuts.map(o => (
                  <PositionCard
                    key={o.id}
                    symbol={o.underlyingSymbol}
                    type="CSP"
                    status={o.status}
                    details={{
                      contracts: o.contracts,
                      strike: o.strikePrice,
                      expiration: o.expirationDate,
                      currentPrice: o.currentPrice,
                      daysToExpiration: o.daysToExpiration
                    }}
                    pnl={o.unrealizedPnL}
                    actions={
                      o.status === 'Open' && (
                        <button onClick={() => handleClose(o.id)} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Close</button>
                      )
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {otherOptions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 px-2 flex justify-between">
                <span>Other Strategies</span>
                <span className="text-slate-400 font-medium">{otherOptions.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherOptions.map(o => (
                  <PositionCard
                    key={o.id}
                    symbol={o.underlyingSymbol}
                    type={`${o.strategy} ${o.optionType}`}
                    status={o.status}
                    details={{
                      contracts: o.contracts,
                      strike: o.strikePrice,
                      expiration: o.expirationDate,
                      currentPrice: o.currentPrice,
                      daysToExpiration: o.daysToExpiration
                    }}
                    pnl={o.unrealizedPnL}
                    actions={
                      o.status === 'Open' && (
                        <button onClick={() => handleClose(o.id)} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Close</button>
                      )
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {options.length === 0 && (
            <div className="text-center py-20 glass-card">
              <p className="text-slate-400 font-medium">No options found for this filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
