import React, { useState } from 'react';
import { Receipt, Plus, Copy, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENCIES = ['BTC', 'ETH', 'USDT', 'XMR'];
const FIAT_CURRENCIES = ['CHF', 'USD', 'EUR', 'GBP'];

interface InvoiceData {
  id: string;
  amount: number;
  fiat: string;
  description: string;
  client: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
  acceptedCurrencies: string[];
  receiveCurrency: string;
}

const Invoice: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [amount, setAmount] = useState('');
  const [fiat, setFiat] = useState('CHF');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [acceptedCurrencies, setAcceptedCurrencies] = useState<string[]>(CURRENCIES);
  const [receiveCurrency, setReceiveCurrency] = useState('USDT');
  const [copied, setCopied] = useState(false);

  // Mock invoices
  const [invoices] = useState<InvoiceData[]>([
    {
      id: 'INV-2024-0892',
      amount: 12500,
      fiat: 'CHF',
      description: 'Q1 Consulting',
      client: 'Acme Corp.',
      status: 'pending',
      createdAt: new Date(),
      acceptedCurrencies: CURRENCIES,
      receiveCurrency: 'USDT',
    },
  ]);

  const toggleCurrency = (currency: string) => {
    setAcceptedCurrencies((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency]
    );
  };

  const handleCreateInvoice = async () => {
    if (!amount || !client) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await window.electronAPI.invoice.create({
        amount: parseFloat(amount),
        fiatCurrency: fiat,
        acceptedCurrencies,
        description,
        recipient: client,
      });
      toast.success('Invoice created!');
      setShowCreate(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create invoice');
    }
  };

  const copyInvoiceLink = (id: string) => {
    navigator.clipboard.writeText(`https://pay.suissewallet.io/inv/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock conversion rates
  const getConversion = (amountFiat: number, currency: string): string => {
    const rates: Record<string, number> = {
      BTC: 0.000012,
      ETH: 0.00024,
      USDT: 1,
      XMR: 0.006,
    };
    return (amountFiat * (rates[currency] || 1)).toFixed(currency === 'USDT' ? 2 : 6);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-neutral-800 rounded-xl">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
            <p className="text-neutral-400">Multi-currency crypto invoices</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Invoice
        </button>
      </div>

      {/* v2.4 feature highlight */}
      <div className="bg-gradient-to-r from-red-950/30 to-neutral-900 border border-red-900/30 rounded-xl p-4 mb-6">
        <p className="text-red-400 text-sm font-semibold mb-1">✨ New in v2.4</p>
        <p className="text-neutral-300">
          Clients can now pay with BTC, ETH, USDT, or XMR — you receive your preferred currency automatically via atomic swap.
        </p>
      </div>

      {/* Invoices list */}
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white font-semibold">{invoice.id}</p>
                <p className="text-neutral-400 text-sm">{invoice.client}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {invoice.fiat} {invoice.amount.toLocaleString()}
                </p>
                <span className={`text-xs px-2 py-1 rounded ${
                  invoice.status === 'paid' ? 'bg-green-900 text-green-400' :
                  invoice.status === 'pending' ? 'bg-yellow-900 text-yellow-400' :
                  'bg-neutral-800 text-neutral-400'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Payment options */}
            <div className="bg-neutral-800/50 rounded-lg p-3 mb-4">
              <p className="text-neutral-400 text-sm mb-2">Payment Options:</p>
              <div className="grid grid-cols-4 gap-2">
                {invoice.acceptedCurrencies.map((currency) => (
                  <div key={currency} className="text-center p-2 bg-neutral-800 rounded">
                    <p className="text-white font-mono text-sm">
                      {getConversion(invoice.amount, currency)}
                    </p>
                    <p className="text-neutral-500 text-xs">{currency}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyInvoiceLink(invoice.id)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        ))}

        {invoices.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-400">No invoices yet</p>
            <button
              onClick={() => setShowCreate(true)}
              className="text-red-500 hover:underline mt-2"
            >
              Create your first invoice
            </button>
          </div>
        )}
      </div>

      {/* Create invoice modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">Create Invoice</h2>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">Amount *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input flex-1"
                  />
                  <select
                    value={fiat}
                    onChange={(e) => setFiat(e.target.value)}
                    className="bg-neutral-800 text-white px-4 rounded-lg"
                  >
                    {FIAT_CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client */}
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">Client *</label>
                <input
                  type="text"
                  placeholder="Acme Corp."
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">Description</label>
                <input
                  type="text"
                  placeholder="Q1 Consulting Services"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                />
              </div>

              {/* Accepted currencies */}
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">Accept Payment In</label>
                <div className="flex gap-2">
                  {CURRENCIES.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => toggleCurrency(currency)}
                      className={`px-4 py-2 rounded-lg ${
                        acceptedCurrencies.includes(currency)
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              {/* Receive currency */}
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">I Want to Receive</label>
                <select
                  value={receiveCurrency}
                  onChange={(e) => setReceiveCurrency(e.target.value)}
                  className="input"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="text-neutral-500 text-xs mt-1">
                  Client's payment will be auto-converted to {receiveCurrency}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                className="btn-primary flex-1"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
