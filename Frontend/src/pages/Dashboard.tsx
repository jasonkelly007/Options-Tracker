import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { optionsApi } from '../api/client';
import type { DashboardSummary } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import PositionCard from '../components/PositionCard';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await optionsApi.getDashboard();
      setDashboard(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-800 font-medium">{error || 'Failed to load dashboard'}</p>
        <button onClick={loadDashboard} className="mt-4 text-indigo-600 font-bold">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portfolio</h1>
          <p className="text-slate-500 font-medium">Welcome back, Neodius</p>
        </div>
        <Link to="/options/new" className="bg-indigo-600 text-white p-3 rounded-full shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </header>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <h3 className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Portfolio Value</h3>
          <p className="text-3xl font-black">{formatCurrency(dashboard.totalPortfolioValue)}</p>
          <div className="mt-4 flex items-center space-x-2 text-indigo-100">
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
              {dashboard.positionsCount} Assets
            </span>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total P&L</h3>
          <p className={`text-3xl font-black ${dashboard.totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(dashboard.totalUnrealizedPnL)}
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Lifetime unrealized gain/loss</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Options Health</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-xl font-bold text-slate-800">{dashboard.activeCoveredCalls + dashboard.activeCashSecuredPuts}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Short Positions</p>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{dashboard.activeLongCalls + dashboard.activeLongPuts}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Long Positions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Positions Section */}
      <section>
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-xl font-bold text-slate-800">Top Holdings</h2>
          <Link to="/positions" className="text-indigo-600 text-sm font-bold">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboard.topPositions.map((position) => (
            <PositionCard
              key={position.id}
              symbol={position.symbol}
              type="Stock"
              details={{
                quantity: position.quantity,
                avgCost: position.averageCost,
                currentPrice: position.currentPrice
              }}
              pnl={position.unrealizedPnL}
              pnlPercent={position.unrealizedPnLPercent}
            />
          ))}
        </div>
      </section>

      {/* Expiring Soon Section */}
      {dashboard.expiringOptions.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-xl font-bold text-slate-800">Expiring Soon</h2>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Next 7 Days</span>
          </div>
          <div className="space-y-4">
            {dashboard.expiringOptions.map((option) => (
              <PositionCard
                key={option.id}
                symbol={option.underlyingSymbol}
                type={option.strategy}
                status={option.status}
                details={{
                  contracts: option.contracts,
                  strike: option.strikePrice,
                  expiration: option.expirationDate,
                  currentPrice: option.currentPrice,
                  daysToExpiration: option.daysToExpiration
                }}
                pnl={option.unrealizedPnL}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
