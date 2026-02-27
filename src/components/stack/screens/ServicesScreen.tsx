import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Filter } from 'lucide-react';
import { ScreenType, Category, SubService } from '@/types/stack';
import { categories } from '@/data/stack-data';
import { getCategoryIcon } from '../utils/categoryIcons';
import BottomNav from '../BottomNav';
import { ScreenHeader } from '@/components/shared';

interface ServicesScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onBack: () => void;
  onSelectCategory: (category: string) => void;
  onSelectSubService: (category: string, subService: string) => void;
  onResetRequestForm: () => void;
}

type GroupType = 'all' | 'core' | 'lifestyle' | 'specialized';

const groupLabels: Record<GroupType, string> = {
  all: 'All Services',
  core: 'Core Home',
  lifestyle: 'Lifestyle',
  specialized: 'Specialized'
};

const ServicesScreen = ({
  onNavigate,
  onBack,
  onSelectCategory,
  onSelectSubService,
  onResetRequestForm
}: ServicesScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<GroupType>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = searchQuery.length === 0 || 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subServices?.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = activeGroup === 'all' || cat.group === activeGroup;
    return matchesSearch && matchesGroup;
  });

  const handleSelectService = (category: Category, subService?: SubService) => {
    onSelectCategory(category.name);
    if (subService) {
      onSelectSubService(category.name, subService.name);
    }
    onResetRequestForm();
    onNavigate('job-configuration');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader
        title="All Services"
        subtitle={`${categories.length} categories available`}
        onBack={onBack}
      />

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern pl-12"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {(['all', 'core', 'lifestyle', 'specialized'] as GroupType[]).map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeGroup === group
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {groupLabels[group]}
          </button>
        ))}
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
        {filteredCategories.map((category, index) => {
          const IconComponent = getCategoryIcon(category.name);
          const isExpanded = expandedCategory === category.name;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.name)}
                className="w-full p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-primary">{category.avgPrice}</span>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {isExpanded && category.subServices && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border bg-secondary/30">
                      {category.subServices.map((subService, subIdx) => (
                        <button
                          key={subService.name}
                          onClick={() => handleSelectService(category, subService)}
                          className="w-full px-4 py-3 pl-14 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border/50 last:border-0"
                        >
                          <span className="text-sm text-foreground">{subService.name}</span>
                          <div className="flex items-center gap-2">
                            {subService.avgPrice && (
                              <span className="text-sm font-medium text-primary">{subService.avgPrice}</span>
                            )}
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handleSelectService(category)}
                        className="w-full px-4 py-3 pl-14 flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 transition-colors text-primary font-medium text-sm"
                      >
                        Book Any {category.name} Service
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filteredCategories.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">No Services Found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
          </motion.div>
        )}
      </div>

      <BottomNav active="home" userType="consumer" onNavigate={onNavigate} pendingQuotes={1} unreadMessages={2} />
    </div>
  );
};

export default ServicesScreen;
