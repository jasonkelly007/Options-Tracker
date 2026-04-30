import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { optionsApi } from '../api/client';

const AddOption: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    underlyingSymbol: '',
    optionType: 'Call',
    strategy: 'Long',
    strikePrice: '',
    expirationDate: '',
    contracts: '1',
    premiumPerContract: '',
    account: 'Primary',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await optionsApi.create({
        ...formData,
        strikePrice: parseFloat(formData.strikePrice),
        contracts: parseInt(formData.contracts),
        premiumPerContract: parseFloat(formData.premiumPerContract)
      });
      navigate('/options');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create option position');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg mt-4 mb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Option Position</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Symbol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Underlying Symbol</label>
            <input
              type="text"
              name="underlyingSymbol"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
              placeholder="e.g. AAPL"
              value={formData.underlyingSymbol}
              onChange={handleChange}
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
            <input
              type="text"
              name="account"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
              value={formData.account}
              onChange={handleChange}
            />
          </div>

          {/* Option Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Option Type</label>
            <select
              name="optionType"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg bg-white"
              value={formData.optionType}
              onChange={handleChange}
            >
              <option value="Call">Call</option>
              <option value="Put">Put</option>
            </select>
          </div>

          {/* Strategy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
            <select
              name="strategy"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg bg-white"
              value={formData.strategy}
              onChange={handleChange}
            >
              <option value="Long">Long (Buy)</option>
              <option value="Short">Short (Sell)</option>
              <option value="CashSecuredPut">Cash Secured Put</option>
            </select>
          </div>

          {/* Strike Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strike Price</label>
            <input
              type="number"
              step="0.01"
              name="strikePrice"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
              placeholder="0.00"
              value={formData.strikePrice}
              onChange={handleChange}
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
            <input
              type="date"
              name="expirationDate"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
              value={formData.expirationDate}
              onChange={handleChange}
            />
          </div>

          {/* Contracts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contracts</label>
            <input
              type="number"
              name="contracts"
              required
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
              value={formData.contracts}
              onChange={handleChange}
            />
          </div>

          {/* Premium */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Premium per Contract</label>
            <input
              type="number"
              step="0.01"
              name="premiumPerContract"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
              placeholder="0.00"
              value={formData.premiumPerContract}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
            placeholder="Optional notes..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4 flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-4 px-6 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg text-lg"
          >
            {loading ? 'Creating...' : 'Create Position'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOption;
