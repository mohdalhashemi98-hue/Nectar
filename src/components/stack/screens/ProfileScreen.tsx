import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ChevronRight, User, CreditCard, Bell, Shield, HelpCircle, LogOut, Trophy, Sparkles, Receipt, Download, Calendar, CheckCircle2, XCircle, Clock, Wallet as WalletIcon, TrendingUp, Briefcase, FileText } from 'lucide-react';
import { UserProfile, Rewards, ScreenType, UserType, Job } from '@/types/stack';
import { initialTransactions, initialJobs } from '@/data/stack-data';
import { Transaction } from '@/types/stack';
import { Button } from '@/components/ui/button';
import BottomNav from '../BottomNav';

interface ProfileScreenProps {
  userProfile: UserProfile;
  rewards: Rewards;
  userType: UserType;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
  onSelectJob?: (job: Job) => void;
}

const ProfileScreen = ({ userProfile, rewards, userType, onNavigate, onLogout, onSelectJob }: ProfileScreenProps) => {
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

  const totalSpent = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount + t.serviceFee, 0);
  const totalPointsEarned = transactions.reduce((sum, t) => sum + t.pointsEarned, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'refunded': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'processing': return <Clock className="w-4 h-4 text-primary" />;
      default: return null;
    }
  };

  const getPaymentIcon = (method: string) => {
    if (method.includes('Card')) return <CreditCard className="w-4 h-4" />;
    if (method.includes('Wallet')) return <WalletIcon className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  return (
    <div className="w-full bg-background pb-32">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-xl font-bold text-foreground">Profile</h1>
          <button onClick={() => onNavigate('settings')} className="p-2.5 rounded-xl hover:bg-secondary transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-xl font-bold text-primary">
              {userProfile.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">{userProfile.name}</h3>
              <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
            </div>
            <div className="points-badge">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{rewards?.points?.toLocaleString() ?? '0'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'activity' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {activeTab === 'overview' && (
          <>
            {userType === 'consumer' && (
              <button onClick={() => onNavigate('rewards')} className="w-full card-interactive p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground text-sm">{rewards.tier} Member</div>
                    <div className="text-xs text-muted-foreground">{rewards.cashbackRate}% cashback</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => item.screen && onNavigate(item.screen)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground text-sm">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}

            <div className="pt-2">
              <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/5 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Log Out</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'activity' && (
          <>
            {userType === 'consumer' && (
              <div className="mb-4">
                <h3 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Active Jobs
                </h3>
                <div className="space-y-2">
                  {jobs.filter(j => j.status === 'Pending' || j.status === 'In Progress' || j.status === 'Awaiting Completion').map((job) => (
                    <button
                      key={job.id}
                      onClick={() => {
                        if (onSelectJob) onSelectJob(job);
                        if (job.status === 'Pending' && job.offersCount && job.offersCount > 0) onNavigate('quote-management');
                        else onNavigate('job-detail');
                      }}
                      className="w-full bg-card rounded-xl p-3 border border-border text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground text-sm">{job.title}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          job.status === 'Pending' ? 'bg-warning/10 text-warning' :
                          job.status === 'In Progress' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>{job.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {job.status === 'Pending' && job.offersCount ? `${job.offersCount} quotes` : job.vendor || 'Awaiting quotes'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                  {jobs.filter(j => j.status === 'Pending' || j.status === 'In Progress' || j.status === 'Awaiting Completion').length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No active jobs</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Payment History
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-card rounded-xl p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">Total Spent</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{totalSpent}</p>
                  <p className="text-xs text-muted-foreground">AED</p>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">Points</span>
                  </div>
                  <p className="text-xl font-bold text-primary">{totalPointsEarned}</p>
                  <p className="text-xs text-muted-foreground">Stack Points</p>
                </div>
              </div>

              {transactions.map((transaction) => (
                <div key={transaction.id} className="bg-card rounded-xl p-3 border border-border mb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-medium text-foreground text-sm">{transaction.jobTitle}</h3>
                        {getStatusIcon(transaction.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{transaction.vendor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        {transaction.status === 'refunded' ? '-' : ''}{transaction.amount + transaction.serviceFee}
                      </p>
                      <p className="text-xs text-muted-foreground">AED</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2 p-2 bg-secondary/30 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getPaymentIcon(transaction.paymentMethod)}
                      <span className="text-muted-foreground">{transaction.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => console.log('Receipt:', transaction.receiptId)} variant="outline" className="flex-1 h-8 text-xs" disabled={transaction.status === 'refunded'}>
                      <Download className="w-3 h-3 mr-1" /> Receipt
                    </Button>
                    <div className="px-2 py-1 bg-secondary rounded-lg text-[10px] text-muted-foreground flex items-center">
                      #{transaction.receiptId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} userType={userType}
        pendingQuotes={userType === 'consumer' ? jobs.filter(j => j.status === 'Pending' && j.offersCount && j.offersCount > 0).length : 0}
        unreadMessages={2} />
    </div>
  );
};

export default ProfileScreen;
