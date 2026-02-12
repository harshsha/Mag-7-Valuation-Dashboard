
import React from 'react';
import { StockData, ValuationMetric } from '../types';

interface StockTableProps {
  stocks: StockData[];
  cheapestByPE: string;
  cheapestByPS: string;
  cheapestByPB: string;
  bestDcfUpside: string;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, cheapestByPE, cheapestByPS, cheapestByPB, bestDcfUpside }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead className="bg-gray-900 text-xs uppercase tracking-wider">
          <tr>
            <th className="p-4 font-semibold text-gray-400 border-b border-gray-700">Company</th>
            <th className="p-4 font-semibold text-gray-400 border-b border-gray-700">Price</th>
            <th className="p-4 font-semibold text-gray-400 border-b border-gray-700">P/E (T)</th>
            <th className="p-4 font-semibold text-gray-400 border-b border-gray-700">P/S</th>
            <th className="p-4 font-semibold text-gray-400 border-b border-gray-700">EBITDA Margin</th>
            <th className="p-4 font-semibold text-gray-400 border-b border-gray-700">Est. DCF</th>
            <th className="p-4 font-semibold text-gray-400 border-b border-gray-700">Upside</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="hover:bg-gray-700/50 transition-colors">
              <td className="p-4">
                <div className="font-bold text-white flex items-center gap-2">
                  {stock.symbol}
                  {stock.symbol === bestDcfUpside && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/30 font-normal">
                      Top DCF
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{stock.name}</div>
              </td>
              <td className="p-4 text-gray-300 font-mono">${stock.price.toFixed(2)}</td>
              <td className={`p-4 font-mono ${stock.symbol === cheapestByPE ? 'text-emerald-400 font-bold bg-emerald-900/20' : 'text-gray-300'}`}>
                {stock.peRatio.toFixed(1)}
              </td>
              <td className={`p-4 font-mono ${stock.symbol === cheapestByPS ? 'text-emerald-400 font-bold bg-emerald-900/20' : 'text-gray-300'}`}>
                {stock.psRatio.toFixed(1)}
              </td>
              <td className="p-4 text-gray-300 font-mono">
                {stock.ebitdaMargin.toFixed(1)}%
              </td>
              <td className="p-4 text-indigo-300 font-mono font-semibold">
                ${stock.dcfValue.toFixed(2)}
              </td>
              <td className={`p-4 font-mono font-bold ${stock.upsidePercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.upsidePercent > 0 ? '+' : ''}{stock.upsidePercent.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
