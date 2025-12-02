import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Receipt, 
  Download, 
  Search,
  CreditCard,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Transaction } from '@/types/mazaadi';
import { initialTransactions } from '@/data/mazaadi-data';
import BottomNav from '../BottomNav';
import { ScreenType } from '@/types/mazaadi';

interface TransactionsScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const TransactionsScreen = ({ onBack, onNavigate }: TransactionsScreenProps) => {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'refunded'>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalSpent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount + t.serviceFee, 0);

  const totalPointsEarned = transactions
    .reduce((sum, t) => sum + t.pointsEarned, 0);

  const handleDownloadReceipt = (transaction: Transaction) => {
    console.log('Downloading receipt for:', transaction.receiptId);
    // In a real app, this would generate and download a PDF receipt
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'refunded': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing': return <Clock className="w-5 h-5 text-primary" />;
      default: return null;
    }
  };

  const getPaymentIcon = (method: string) => {
    if (method.includes('Card')) return <CreditCard className="w-4 h-4" />;
    if (method.includes('Wallet')) return <Wallet className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background pt-12 pb-6 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Payment History</h1>
            <p className="text-sm text-muted-foreground">All your transactions</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalSpent}</p>
            <p className="text-xs text-muted-foreground">AED</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Points Earned</span>
            </div>
            <p className="text-2xl font-bold text-primary">{totalPointsEarned}</p>
            <p className="text-xs text-muted-foreground">Nectar Points</p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="pl-12 h-12 bg-background/80 backdrop-blur-sm border-border rounded-xl"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'completed', label: 'Completed' },
            { id: 'refunded', label: 'Refunded' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id as typeof filterStatus)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground border border-border'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {filteredTransactions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No transactions found</p>
          </motion.div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border"
            >
              {/* Transaction Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{transaction.jobTitle}</h3>
                    {getStatusIcon(transaction.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{transaction.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-foreground">
                    {transaction.status === 'refunded' ? '-' : ''}{transaction.amount + transaction.serviceFee}
                  </p>
                  <p className="text-xs text-muted-foreground">AED</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(transaction.date).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPaymentIcon(transaction.paymentMethod)}
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="text-sm font-medium text-foreground">{transaction.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 mb-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Amount</span>
                  <span className="text-foreground">{transaction.amount} AED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">{transaction.serviceFee} AED</span>
                </div>
                {transaction.pointsEarned > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Points Earned</span>
                    <span className="font-medium">+{transaction.pointsEarned}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownloadReceipt(transaction)}
                  variant="outline"
                  className="flex-1 h-10"
                  disabled={transaction.status === 'refunded'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
                <div className="px-3 py-2 bg-muted rounded-xl text-xs text-muted-foreground">
                  #{transaction.receiptId}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BottomNav 
        userType="consumer" 
        active="transactions" 
        onNavigate={onNavigate} 
      />
    </div>
  );
};

export default TransactionsScreen;
