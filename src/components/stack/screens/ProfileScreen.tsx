import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ChevronRight, User, CreditCard, Bell, Shield, HelpCircle, LogOut, Trophy, Sparkles, Receipt, Download, Calendar, CheckCircle2, XCircle, Clock, Wallet as WalletIcon, TrendingUp, Briefcase, FileText } from 'lucide-react';
import { UserProfile, Rewards, ScreenType, UserType, Job } from '@/types/stack';
import { initialTransactions, initialJobs } from '@/data/stack-data';
import { Transaction } from '@/types/stack';
import { Button } from '@/components/ui/button';
import BottomNav from '../BottomNav';
import StackPattern from '../StackPattern';

interface ProfileScreenProps {
  userProfile: UserProfile;
  rewards: Rewards;
  userType: UserType;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
  onSelectJob?: (job: Job) => void;
}

const ProfileScreen = ({
  userProfile,
  rewards,
  userType,
  onNavigate,
  onLogout,
  onSelectJob
}: ProfileScreenProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [jobs] = useState<Job[]>(initialJobs);

  const menuItems = [
    { icon: User, label: 'Personal Info', screen: null },
    { icon: CreditCard, label: 'Payment Methods', screen: null },
    { icon: Bell, label: 'Notifications', screen: 'notifications' as ScreenType },
    { icon: Shield, label: 'Privacy & Security', screen: null },
    { icon: Settings, label: 'Settings', screen: 'settings' as ScreenType },
    { icon: HelpCircle, label: 'Help & Support', screen: 'help' as ScreenType }
  ];

  const totalSpent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount + t.serviceFee, 0);

  const totalPointsEarned = transactions
    .reduce((sum, t) => sum + t.pointsEarned, 0);

  const handleDownloadReceipt = (transaction: Transaction) => {
    console.log('Downloading receipt for:', transaction.receiptId);
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
    if (method.includes('Wallet')) return <WalletIcon className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground px-4 py-6 pb-20 relative overflow-hidden">
        <StackPattern opacity="0.08" color="ffffff" className="absolute inset-0" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h1 className="font-display text-2xl font-bold">Profile</h1>
            <button 
              onClick={() => onNavigate('settings')}
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary-foreground/20 backdrop-blur-sm rounded-3xl p-4 border border-primary-foreground/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-foreground/30 rounded-3xl flex items-center justify-center text-2xl font-bold">
                {userProfile.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{userProfile.name}</h3>
                <p className="opacity-70 text-sm">{userProfile.phone}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-primary-foreground/20 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold text-sm">{rewards.points.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="flex gap-2 bg-card rounded-2xl p-1 shadow-sm border border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <User className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'activity'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Activity
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 relative z-10 space-y-3">
        {activeTab === 'overview' && (
          <>
            {/* Rewards Quick Access */}
            {userType === 'consumer' && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ y: -2 }}
                onClick={() => onNavigate('rewards')} 
                className="w-full card-interactive p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{rewards.tier} Member</div>
                    <div className="text-sm text-muted-foreground">{rewards.cashbackRate}% cashback</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            )}


            {/* Menu Items */}
            {menuItems.map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                whileHover={{ y: -2 }}
                onClick={() => item.screen && onNavigate(item.screen)}
                className="w-full card-interactive p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-semibold text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            ))}

            {/* Logout */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -2 }}
              onClick={onLogout}
              className="w-full bg-card rounded-2xl border border-destructive/20 p-4 flex items-center gap-4 hover:bg-destructive/5 transition-all"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span className="font-semibold text-destructive">Log Out</span>
            </motion.button>
          </>
        )}

        {activeTab === 'activity' && (
          <>
            {/* Active Jobs Section */}
            {userType === 'consumer' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Active Jobs
                </h3>
                <div className="space-y-3">
                  {jobs.filter(j => j.status === 'Pending' || j.status === 'In Progress' || j.status === 'Awaiting Completion').map((job, index) => (
                    <motion.button
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      onClick={() => {
                        if (onSelectJob) onSelectJob(job);
                        if (job.status === 'Pending' && job.offersCount && job.offersCount > 0) {
                          onNavigate('quote-management');
                        } else {
                          onNavigate('job-detail');
                        }
                      }}
                      className="w-full bg-card rounded-2xl p-4 border border-border text-left hover:border-primary/30 transition-all"
                      style={{ boxShadow: 'var(--shadow-sm)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{job.title}</h4>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          job.status === 'Pending' ? 'bg-warning/10 text-warning' :
                          job.status === 'In Progress' ? 'bg-primary/10 text-primary' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {job.status === 'Pending' && job.offersCount 
                            ? `${job.offersCount} quotes received`
                            : job.vendor || 'Awaiting quotes'
                          }
                        </span>
                        <div className="flex items-center gap-2">
                          {job.status === 'Pending' && job.offersCount && job.offersCount > 0 && (
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                              Compare Quotes
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                  {jobs.filter(j => j.status === 'Pending' || j.status === 'In Progress' || j.status === 'Awaiting Completion').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No active jobs</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Payment History Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Payment History
              </h3>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalSpent}</p>
                  <p className="text-xs text-muted-foreground">AED</p>
                </div>

                <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Points Earned</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{totalPointsEarned}</p>
                  <p className="text-xs text-muted-foreground">Stack Points</p>
                </div>
              </div>

              {/* Transactions List */}
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-3"
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
              ))}
            </motion.div>
          </>
        )}
      </div>

      <BottomNav 
        active="profile"
        onNavigate={onNavigate}
        userType={userType}
        pendingQuotes={userType === 'consumer' ? jobs.filter(j => j.status === 'Pending' && j.offersCount && j.offersCount > 0).length : 0}
        unreadMessages={2}
      />
    </div>
  );
};

export default ProfileScreen;
