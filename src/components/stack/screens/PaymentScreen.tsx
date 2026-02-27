import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle2, Clock, Truck, Package, Star, Phone, MessageCircle, Wallet, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScreenType, Job } from '@/types/stack';
import BottomNav from '../BottomNav';
import { ScreenHeader } from '@/components/shared';

interface PaymentScreenProps {
  job: Job;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onPaymentComplete?: () => void;
}

const PaymentScreen = ({ job, onBack, onNavigate, onPaymentComplete }: PaymentScreenProps) => {
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'wallet' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const progressStages = [
    { id: 1, label: 'Request Sent', icon: Package, completed: true, current: false },
    { id: 2, label: 'Offer Accepted', icon: CheckCircle2, completed: true, current: false },
    { id: 3, label: 'In Progress', icon: Truck, completed: job.status === 'In Progress' || job.status === 'Completed', current: job.status === 'In Progress' },
    { id: 4, label: 'Completed', icon: Star, completed: job.status === 'Completed', current: job.status === 'Awaiting Completion' },
  ];

  const currentStageIndex = progressStages.findIndex(s => s.current) !== -1 ? progressStages.findIndex(s => s.current) : progressStages.filter(s => s.completed).length;
  const progressPercentage = ((currentStageIndex + 1) / progressStages.length) * 100;

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, subtitle: '**** 4242' },
    { id: 'wallet', label: 'Stack Wallet', icon: Wallet, subtitle: 'Balance: 500 AED' },
    { id: 'cash', label: 'Cash on Completion', icon: Wallet, subtitle: 'Pay when job is done' },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPaymentComplete(true);
    onPaymentComplete?.();
  };

  const serviceFee = Math.round(job.amount * 0.05);
  const totalAmount = job.amount + serviceFee;

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">Your payment of {totalAmount} AED has been processed</p>
            <div className="bg-primary/10 rounded-xl p-4 mb-6">
              <p className="text-sm text-primary font-medium">+{job.pointsEarned || 50} Stack Points Earned!</p>
            </div>
            <Button onClick={() => onNavigate('consumer-home')} className="w-full bg-primary">Back to Home</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <ScreenHeader title="Payment & Progress" subtitle="Track your job status" onBack={onBack} />

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Job Summary */}
        <div className="card-elevated p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.category}</p>
            </div>
            <div className={`px-3 py-1 rounded-xl text-xs font-medium ${
              job.status === 'Completed' ? 'bg-success/10 text-success' : job.status === 'In Progress' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>{job.status}</div>
          </div>
          {job.vendor && (
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">{job.vendor.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1"><span className="font-medium text-sm">{job.vendor}</span><BadgeCheck className="w-4 h-4 text-primary" /></div>
                <p className="text-xs text-muted-foreground">Your service provider</p>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center"><Phone className="w-4 h-4 text-foreground" /></button>
                <button onClick={() => onNavigate('messages-list')} className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center"><MessageCircle className="w-4 h-4 text-foreground" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="card-elevated p-4">
          <h3 className="font-semibold text-foreground mb-4">Job Progress</h3>
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2"><span>Progress</span><span>{Math.round(progressPercentage)}%</span></div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="space-y-4">
            {progressStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage.completed ? 'bg-success/10' : stage.current ? 'bg-primary/10' : 'bg-muted'}`}>
                    {stage.completed ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Icon className={`w-5 h-5 ${stage.current ? 'text-primary' : 'text-muted-foreground'}`} />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${stage.completed || stage.current ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</p>
                    {stage.current && <p className="text-xs text-primary">Currently in this stage</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card-elevated p-4">
          <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedPayment === method.id;
              return (
                <button key={method.id} onClick={() => setSelectedPayment(method.id as any)} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 text-left"><p className="font-medium text-sm text-foreground">{method.label}</p><p className="text-xs text-muted-foreground">{method.subtitle}</p></div>
                  <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                    {isSelected && <CheckCircle2 className="w-full h-full text-primary-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="card-elevated p-4">
          <h3 className="font-semibold text-foreground mb-4">Price Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service Amount</span><span className="text-foreground">{job.amount} AED</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Platform Fee (5%)</span><span className="text-foreground">{serviceFee} AED</span></div>
            <div className="border-t border-border pt-3 flex justify-between"><span className="font-semibold text-foreground">Total</span><span className="font-bold text-lg text-primary">{totalAmount} AED</span></div>
          </div>
          <div className="flex items-center gap-2 mt-4 p-3 bg-success/5 rounded-xl">
            <Shield className="w-5 h-5 text-success" />
            <p className="text-xs text-muted-foreground">Your payment is secure and protected</p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        <Button onClick={handlePayment} disabled={isProcessing} className="w-full h-14 bg-primary text-primary-foreground font-semibold text-lg rounded-xl">
          {isProcessing ? <div className="flex items-center gap-2"><Clock className="w-5 h-5 animate-spin" />Processing...</div> : `Pay ${totalAmount} AED`}
        </Button>
      </div>

      <BottomNav userType="consumer" active="transactions" onNavigate={onNavigate} />
    </div>
  );
};

export default PaymentScreen;
