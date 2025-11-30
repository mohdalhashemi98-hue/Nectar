import { ArrowLeft, Plus, Edit2, Star, Camera, Trash2, DollarSign, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { ScreenType, UserType } from '@/types/mazaadi';
import BottomNav from '../BottomNav';
import { useState } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
}

interface CompanyProfileScreenProps {
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const CompanyProfileScreen = ({ userType, onBack, onNavigate }: CompanyProfileScreenProps) => {
  const [services] = useState<Service[]>([
    { id: '1', name: 'AC Repair & Maintenance', description: 'Complete AC servicing, repair, and installation', price: '150-500 AED', duration: '1-3 hours', category: 'HVAC' },
    { id: '2', name: 'Electrical Work', description: 'Wiring, switches, and electrical repairs', price: '100-300 AED', duration: '1-2 hours', category: 'Electrical' },
    { id: '3', name: 'Plumbing Services', description: 'Leak repairs, pipe installation, bathroom fitting', price: '120-400 AED', duration: '1-4 hours', category: 'Plumbing' },
  ]);

  const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
    'HVAC': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', gradient: 'from-cyan-500 to-blue-600' },
    'Electrical': { bg: 'bg-amber-500/20', text: 'text-amber-400', gradient: 'from-amber-500 to-orange-600' },
    'Plumbing': { bg: 'bg-blue-500/20', text: 'text-blue-400', gradient: 'from-blue-500 to-indigo-600' },
    'default': { bg: 'bg-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-500 to-pink-600' },
  };

  const getColorScheme = (category: string) => categoryColors[category] || categoryColors['default'];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-400/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-violet-300/10 rounded-full blur-xl" />
        
        <div className="px-6 py-5 relative z-10">
          <div className="flex items-center gap-4 mb-5">
            <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-fuchsia-200 to-white bg-clip-text text-transparent">Company Profile</h1>
          </div>

          {/* Company Card */}
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-5 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  AM
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">Al-Mansouri Services</h2>
                <p className="text-white/70 text-sm mb-2">Professional Home Services</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-500/30 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-amber-300">4.9</span>
                  </div>
                  <span className="text-white/60 text-xs">• 156 reviews</span>
                  <span className="text-emerald-400 text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
              <button className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Company Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { value: '3+', label: 'Years', color: 'from-emerald-400 to-teal-500' },
                { value: '500+', label: 'Jobs', color: 'from-blue-400 to-cyan-500' },
                { value: '98%', label: 'Success', color: 'from-purple-400 to-pink-500' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className={`text-lg font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-6">
        {/* About Section */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              About Us
            </h3>
            <button className="text-primary text-sm font-semibold">Edit</button>
          </div>
          <div className="card-elevated p-4 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 border border-purple-500/10">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional home services company with over 3 years of experience in Dubai. 
              We specialize in AC maintenance, electrical work, and plumbing services. 
              Our team of certified technicians ensures quality work with 100% satisfaction guarantee.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Our Services</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {services.map((service, idx) => {
              const colors = getColorScheme(service.category);
              return (
                <div
                  key={service.id}
                  className="card-elevated p-4 animate-fade-in relative overflow-hidden group"
                  style={{ animationDelay: `${0.1 * idx}s` }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-foreground">{service.name}</h4>
                          <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} rounded-lg text-xs font-semibold`}>
                            {service.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-6 h-6 ${colors.bg} rounded-lg flex items-center justify-center`}>
                          <DollarSign className={`w-3.5 h-3.5 ${colors.text}`} />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{service.price}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-6 h-6 ${colors.bg} rounded-lg flex items-center justify-center`}>
                          <Clock className={`w-3.5 h-3.5 ${colors.text}`} />
                        </div>
                        <span className="text-sm text-muted-foreground">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Preview */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Work Portfolio</h3>
            <button className="text-primary text-sm font-semibold">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { gradient: 'from-cyan-500 to-blue-600', label: 'AC' },
              { gradient: 'from-amber-500 to-orange-600', label: 'Electrical' },
              { gradient: 'from-blue-500 to-indigo-600', label: 'Plumbing' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`aspect-square bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer`}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <span className="text-white font-bold text-sm relative z-10">{item.label}</span>
                <button className="absolute bottom-2 right-2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="company" userType={userType} onNavigate={onNavigate} />
    </div>
  );
};

export default CompanyProfileScreen;
