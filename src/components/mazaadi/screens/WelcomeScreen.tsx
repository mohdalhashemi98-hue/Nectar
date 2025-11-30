import { ChevronRight, Home, Briefcase, Shield, Award, Gift } from 'lucide-react';
import { UserType, ScreenType } from '@/types/mazaadi';

interface WelcomeScreenProps {
  onSelectUserType: (type: UserType) => void;
  onNavigate: (screen: ScreenType) => void;
}

const WelcomeScreen = ({ onSelectUserType, onNavigate }: WelcomeScreenProps) => (
  <div className="flex flex-col h-screen bg-gradient-to-br from-background via-card to-primary/5 relative overflow-hidden">
    {/* Decorative blobs */}
    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse-scale" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-scale" style={{ animationDelay: '1s' }} />
    
    <div className="relative flex-1 flex flex-col justify-center items-center px-6 z-10">
      <div className="mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-3xl shadow-glow mb-6 animate-bounce-subtle">
          <span className="text-5xl">🤝</span>
        </div>
        <h1 className="text-5xl font-extrabold text-foreground mb-3 tracking-tight">Mazaadi</h1>
        <p className="text-lg text-muted-foreground font-medium">Find. Connect. Complete.</p>
      </div>

      <div className="flex gap-8 mb-10 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {[
          { value: '24K+', label: 'Active Pros' },
          { value: '4.9★', label: 'Avg Rating' },
          { value: '12%', label: 'Cashback' }
        ].map((stat, idx) => (
          <div key={idx} className="group">
            <div className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">{stat.value}</div>
            <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="w-full max-w-sm space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <button
          onClick={() => { onSelectUserType('consumer'); onNavigate('consumer-home'); }}
          className="group w-full bg-card border-2 border-border hover:border-primary py-5 px-5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Home className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-foreground">I need help</div>
                <div className="text-sm text-muted-foreground">Post a job & get offers</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </button>

        <button
          onClick={() => { onSelectUserType('vendor'); onNavigate('vendor-home'); }}
          className="group w-full bg-gradient-primary text-primary-foreground py-5 px-5 rounded-3xl shadow-lg hover:shadow-glow transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">I'm a Pro</div>
                <div className="text-sm text-primary-foreground/80">Find jobs & earn money</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-primary-foreground/80 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </button>
      </div>

      <div className="mt-10 flex items-center gap-6 text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
        {[
          { icon: Shield, label: 'Verified', color: 'text-success' },
          { icon: Award, label: 'Licensed', color: 'text-primary' },
          { icon: Gift, label: 'Rewards', color: 'text-warning' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-default">
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WelcomeScreen;
