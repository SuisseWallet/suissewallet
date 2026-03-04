import React, { useState } from 'react';
import { Users, Search, Star, ArrowUpDown } from 'lucide-react';

interface TradeOffer {
  id: string;
  trader: string;
  rating: number;
  completionRate: string;
  price: string;
  currency: string;
  fiat: string;
  minAmount: string;
  maxAmount: string;
  paymentMethods: string[];
}

const mockOffers: TradeOffer[] = [
  {
    id: '1',
    trader: 'SwissTrader_CH',
    rating: 4.9,
    completionRate: '98.7%',
    price: '84,250',
    currency: 'BTC',
    fiat: 'CHF',
    minAmount: '100',
    maxAmount: '50,000',
    paymentMethods: ['Bank Transfer', 'TWINT'],
  },
  {
    id: '2',
    trader: 'CryptoZurich',
    rating: 5.0,
    completionRate: '99.2%',
    price: '84,180',
    currency: 'BTC',
    fiat: 'CHF',
    minAmount: '500',
    maxAmount: '100,000',
    paymentMethods: ['Bank Transfer'],
  },
  {
    id: '3',
    trader: 'AlpineBTC',
    rating: 4.7,
    completionRate: '97.5%',
    price: '84,320',
    currency: 'BTC',
    fiat: 'CHF',
    minAmount: '50',
    maxAmount: '10,000',
    paymentMethods: ['Bank Transfer', 'TWINT', 'Revolut'],
  },
];

const Trade: React.FC = () => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [selectedFiat, setSelectedFiat] = useState('CHF');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-neutral-800 rounded-xl">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">P2P Trade</h1>
          <p className="text-neutral-400">Trade directly with verified users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Buy/Sell toggle */}
        <div className="flex bg-neutral-900 rounded-lg p-1">
          <button
            onClick={() => setTradeType('buy')}
            className={`px-6 py-2 rounded-md transition-all ${
              tradeType === 'buy'
                ? 'bg-green-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`px-6 py-2 rounded-md transition-all ${
              tradeType === 'sell'
                ? 'bg-red-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Currency selector */}
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-lg"
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
          <option value="XMR">XMR</option>
        </select>

        {/* Fiat selector */}
        <select
          value={selectedFiat}
          onChange={(e) => setSelectedFiat(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-lg"
        >
          <option value="CHF">CHF</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search traders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* Offers list */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-neutral-800 text-neutral-400 text-sm">
          <div>Trader</div>
          <div className="flex items-center gap-1">
            Price <ArrowUpDown className="w-4 h-4" />
          </div>
          <div>Limit</div>
          <div>Payment</div>
          <div></div>
        </div>

        {/* Offers */}
        {mockOffers.map((offer) => (
          <div
            key={offer.id}
            className="grid grid-cols-5 gap-4 p-4 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
          >
            {/* Trader */}
            <div>
              <p className="text-white font-medium">{offer.trader}</p>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-neutral-400">{offer.rating}</span>
                <span className="text-neutral-500">• {offer.completionRate}</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-white font-semibold">
                {offer.fiat} {offer.price}
              </p>
              <p className="text-neutral-500 text-sm">per {offer.currency}</p>
            </div>

            {/* Limit */}
            <div>
              <p className="text-white">
                {offer.fiat} {offer.minAmount} - {offer.maxAmount}
              </p>
            </div>

            {/* Payment methods */}
            <div className="flex flex-wrap gap-1">
              {offer.paymentMethods.map((method) => (
                <span
                  key={method}
                  className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded"
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Action */}
            <div className="flex justify-end">
              <button
                className={`px-6 py-2 rounded-lg font-semibold ${
                  tradeType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create offer button */}
      <div className="mt-6 text-center">
        <button className="btn-secondary">
          + Create Your Own Offer
        </button>
      </div>
    </div>
  );
};

export default Trade;
