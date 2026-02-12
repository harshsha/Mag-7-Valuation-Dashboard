
import React, { useState, useEffect } from 'react';
import { fetchMag7Data } from './services/geminiService';
import { ValuationAnalysis, ValuationMetric } from './types';
import StockChart from './components/StockChart';
import StockTable from './components/StockTable';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ValuationAnalysis | null>(null);
  const [activeMetric, setActiveMetric] = useState<ValuationMetric>(ValuationMetric.PE);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMag7Data();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Mag 7 valuation data. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getChartTitle = (metric: ValuationMetric) => {
    switch (metric) {
      case ValuationMetric.UPSIDE: return 'Projected Upside (%)';
      case ValuationMetric.DCF: return 'DCF Est. Value ($)';
      case ValuationMetric.EBITDA_MARGIN: return 'EBITDA Margin (%)';
      case ValuationMetric.PE: return 'P/E Ratio (Trailing)';
      case ValuationMetric.PS: return 'P/S Ratio';
      case ValuationMetric.PB: return 'P/B Ratio';
      case ValuationMetric.FORWARD_PE: return 'Forward P/E';
      default: return metric;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="text-xl font-medium animate-pulse">Running Profitability & Valuation Models...</div>
        <p className="text-gray-500 text-sm">Validating real-time prices with Gemini 3 Search</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
        <div className="bg-red-900/30 border border-red-500 p-8 rounded-2xl text-center max-w-md">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Error Occurred</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={loadData}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors font-semibold"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Mag 7 Profitability & Valuation
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Real-time intrinsic value estimates and operational efficiency comparison.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-lg transition-all text-sm font-medium"
          >
            <i className="fas fa-sync-alt"></i> Refresh Data
          </button>
        </div>
      </header>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Lowest P/E Multiplier', value: data.cheapestByPE, icon: 'fa-percentage', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Highest DCF Upside', value: data.bestDcfUpside, icon: 'fa-chart-line', color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Overall Value Pick', value: data.overallValuePick, icon: 'fa-gem', color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Cheapest by P/S', value: data.cheapestByPS, icon: 'fa-tags', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} border border-white/5 rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{item.label}</span>
              <i className={`fas ${item.icon} ${item.color}`}></i>
            </div>
            <div className={`text-3xl font-black ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: AI Analysis & Description List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-robot text-purple-400"></i> Performance Insights
            </h2>
            <p className="text-gray-300 leading-relaxed italic border-l-4 border-purple-500 pl-4 py-1">
              {data.aiSummary}
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Stock Insights</h2>
            <div className="space-y-4">
              {data.stocks.map(stock => (
                <div key={stock.symbol} className="group border-b border-gray-700 pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-blue-400">{stock.symbol}</span>
                    <span className="text-xs text-gray-500 font-mono">Upside: {stock.upsidePercent.toFixed(1)}%</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-snug group-hover:text-gray-300 transition-colors">
                    {stock.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Charts & Data Table */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Controls */}
          <div className="bg-gray-800/30 p-2 rounded-xl border border-gray-700 flex flex-wrap gap-2">
            {[
              { id: ValuationMetric.PE, label: 'P/E Ratio' },
              { id: ValuationMetric.EBITDA_MARGIN, label: 'EBITDA Margin' },
              { id: ValuationMetric.UPSIDE, label: 'DCF Upside %' },
              { id: ValuationMetric.PS, label: 'P/S Ratio' },
            ].map(metric => (
              <button
                key={metric.id}
                onClick={() => setActiveMetric(metric.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeMetric === metric.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>

          <StockChart 
            data={data.stocks} 
            metric={activeMetric} 
            title={getChartTitle(activeMetric)} 
          />

          <StockTable 
            stocks={data.stocks}
            cheapestByPE={data.cheapestByPE}
            cheapestByPS={data.cheapestByPS}
            cheapestByPB={data.cheapestByPB}
            bestDcfUpside={data.bestDcfUpside}
          />
        </div>
      </div>

      {/* Sources Footer */}
      {data.sources.length > 0 && (
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-widest text-center">Data Sources & Grounding</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {data.sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/20 transition-all"
              >
                <i className="fas fa-external-link-alt text-[10px]"></i>
                {source.title}
              </a>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 mt-6 text-center max-w-3xl mx-auto leading-relaxed">
            Note: Stock prices and valuation metrics are synthesized using real-time search grounding. EBITDA Margins and DCF calculations represent a consensus of analyst figures and are subject to market volatility.
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
