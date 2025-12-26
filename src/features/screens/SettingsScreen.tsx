import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Vibrate, Volume2, Bell, Moon, Lock, Smartphone, Eye, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore } from '@/stores/settings-store';
import StackPattern from '@/components/stack/StackPattern';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { 
    hapticEnabled, 
    soundEnabled,
    setHapticEnabled, 
    setSoundEnabled 
  } = useSettingsStore();

  const settingsCategories = [
    {
      title: 'Feedback',
      description: 'Control how the app responds to your interactions',
      items: [
        {
          icon: Vibrate,
          label: 'Haptic Feedback',
          description: 'Vibration on interactions',
          value: hapticEnabled,
          onChange: setHapticEnabled,
        },
        {
          icon: Volume2,
          label: 'Sound Effects',
          description: 'Audio feedback for actions',
          value: soundEnabled,
          onChange: setSoundEnabled,
        },
      ],
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Receive alerts on your device',
          value: true,
          onChange: () => {},
          disabled: true,
        },
        {
          icon: Smartphone,
          label: 'In-App Notifications',
          description: 'Show notifications within the app',
          value: true,
          onChange: () => {},
          disabled: true,
        },
      ],
    },
    {
      title: 'Appearance',
      description: 'Customize how the app looks',
      items: [
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Use dark theme',
          value: false,
          onChange: () => {},
          disabled: true,
        },
      ],
    },
    {
      title: 'Privacy',
      description: 'Control your data and privacy settings',
      items: [
        {
          icon: Eye,
          label: 'Profile Visibility',
          description: 'Allow others to see your profile',
          value: true,
          onChange: () => {},
          disabled: true,
        },
        {
          icon: Lock,
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          value: false,
          onChange: () => {},
          disabled: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground px-4 py-6 relative overflow-hidden">
        <StackPattern opacity="0.08" color="ffffff" className="absolute inset-0" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-2xl font-bold">Settings</h1>
          </motion.div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="p-4 space-y-6">
        {settingsCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <div className="mb-3">
              <h2 className="font-display text-lg font-bold text-foreground">{category.title}</h2>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: categoryIndex * 0.1 + itemIndex * 0.05 }}
                  className={`p-4 flex items-center justify-between ${item.disabled ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={item.value} 
                    onCheckedChange={item.onChange}
                    disabled={item.disabled}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-3">
            <h2 className="font-display text-lg font-bold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">Irreversible actions</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-destructive/20 overflow-hidden">
            <button 
              className="w-full p-4 flex items-center gap-4 text-left hover:bg-destructive/5 transition-all opacity-60 cursor-not-allowed"
              disabled
            >
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <span className="font-semibold text-destructive">Delete Account</span>
                <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-muted-foreground">Stack App v1.0.0</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsScreen;
