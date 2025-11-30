import { motion } from 'framer-motion';
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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-background/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-background/5 rounded-full blur-2xl" />
        
        <div className="px-6 py-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-5"
          >
            <button onClick={onBack} className="p-2 bg-background/10 rounded-xl hover:bg-background/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-xl font-bold">Company Profile</h1>
          </motion.div>

          {/* Company Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background/10 rounded-3xl p-5"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-background text-foreground rounded-2xl flex items-center justify-center text-2xl font-bold">
                  AM
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-background/20 rounded-full flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Al-Mansouri Services</h2>
                <p className="opacity-60 text-sm mb-2">Professional Home Services</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-background/10 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-background" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                  <span className="opacity-60 text-xs">• 156 reviews</span>
                  <span className="text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
              <button className="p-2 bg-background/10 rounded-xl hover:bg-background/20 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Company Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { value: '3+', label: 'Years' },
                { value: '500+', label: 'Jobs' },
                { value: '98%', label: 'Success' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-background/10 rounded-xl p-3 text-center">
                  <div className="font-display text-lg font-bold">{stat.value}</div>
                  <div className="text-xs opacity-60">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-6">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              About Us
            </h3>
            <button className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">Edit</button>
          </div>
          <div className="card-elevated p-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional home services company with over 3 years of experience in Dubai. 
              We specialize in AC maintenance, electrical work, and plumbing services. 
              Our team of certified technicians ensures quality work with 100% satisfaction guarantee.
            </p>
          </div>
        </motion.div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-foreground">Our Services</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="card-elevated p-4 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{service.name}</h4>
                      <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-lg text-xs font-medium">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-secondary rounded-lg flex items-center justify-center">
                      <DollarSign className="w-3.5 h-3.5 text-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-secondary rounded-lg flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{service.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-foreground">Work Portfolio</h3>
            <button className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'AC' },
              { label: 'Electrical' },
              { label: 'Plumbing' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="aspect-square bg-foreground rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
              >
                <span className="text-background font-semibold text-sm">{item.label}</span>
                <button className="absolute bottom-2 right-2 w-7 h-7 bg-background/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-background" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav active="company" userType={userType} onNavigate={onNavigate} />
    </div>
  );
};

export default CompanyProfileScreen;