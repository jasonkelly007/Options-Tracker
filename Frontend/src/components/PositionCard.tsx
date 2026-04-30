import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface PositionCardProps {
  symbol: string;
  type: string; // 'Stock' | 'Option'
  details: {
    quantity?: number;
    contracts?: number;
    strike?: number;
    expiration?: string;
    avgCost?: number;
    currentPrice?: number;
    daysToExpiration?: number;
  };
  pnl: number;
  pnlPercent?: number;
  status?: string;
  actions?: React.ReactNode;
}

const PositionCard: React.FC<PositionCardProps> = ({ 
  symbol, 
  type, 
  details, 
  pnl, 
  pnlPercent, 
  status, 
  actions 
}) => {
  const isPositive = pnl >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{symbol}</h3>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{type}</span>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(pnl)}
          </div>
          {pnlPercent !== undefined && (
            <div className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-slate-50 mb-3">
        <div>
          <p className="text-xs text-slate-400 mb-1">
            {type === 'Stock' ? 'Shares' : 'Contracts'}
          </p>
          <p className="text-sm font-semibold text-slate-700">
            {type === 'Stock' ? details.quantity : details.contracts}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">
            {type === 'Stock' ? 'Avg Cost' : 'Strike'}
          </p>
          <p className="text-sm font-semibold text-slate-700">
            {formatCurrency(type === 'Stock' ? details.avgCost! : details.strike!)}
          </p>
        </div>
        {details.expiration && (
          <div>
            <p className="text-xs text-slate-400 mb-1">Expiration</p>
            <p className="text-sm font-semibold text-slate-700">
              {formatDate(details.expiration)}
              {details.daysToExpiration !== undefined && (
                <span className="text-xs text-slate-400 ml-1">({details.daysToExpiration}d)</span>
              )}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-slate-400 mb-1">Current Price</p>
          <p className="text-sm font-semibold text-slate-700">
            {formatCurrency(details.currentPrice!)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {status && (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            status === 'Open' ? 'bg-green-100 text-green-700' :
            status === 'Closed' ? 'bg-slate-100 text-slate-600' :
            'bg-blue-100 text-blue-700'
          }`}>
            {status}
          </span>
        )}
        <div className="flex space-x-2">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default PositionCard;
