import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ChevronRight, Star, Users, Clock, Filter } from 'lucide-react';
import { ScreenType, Category, SubService } from '@/types/mazaadi';
import { categories } from '@/data/mazaadi-data';
import { getCategoryIcon } from '../utils/categoryIcons';
import BottomNav from '../BottomNav';

interface ServicesScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectCategory: (category: string) => void;
  onSelectSubService: (category: string, subService: string) => void;
  onResetRequestForm: () => void;
}

type GroupType = 'all' | 'core' | 'lifestyle' | 'specialized';

const groupLabels: Record<GroupType, string> = {
  all: 'All Services',
  core: 'Core Home Services',
  lifestyle: 'Lifestyle & Cleaning',
  specialized: 'Specialized Services'
};

const ServicesScreen = ({
  onNavigate,
  onSelectCategory,
  onSelectSubService,
  onResetRequestForm
}: ServicesScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<GroupType>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update sliding indicator position
  useEffect(() => {
    const groups: GroupType[] = ['all', 'core', 'lifestyle', 'specialized'];
    const activeIndex = groups.indexOf(activeGroup);
    const activeTab = tabsRef.current[activeIndex];
    
    if (activeTab && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      
      setIndicatorStyle({
        left: tabRect.left - containerRect.left + containerRef.current.scrollLeft,
        width: tabRect.width
      });
    }
  }, [activeGroup]);

  // Filter categories based on search and group
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
    // Navigate to the job configuration screen with pre-populated data
    onNavigate('job-configuration');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground p-6 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-5">
            <button
              onClick={() => onNavigate('consumer-home')}
              className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold">All Services</h1>
              <p className="text-sm opacity-80">{categories.length} categories available</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-primary-foreground/20 border border-primary-foreground/20 rounded-2xl text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
            />
          </div>
        </motion.div>
      </div>

      {/* Sliding Filter Tabs */}
      <div className="px-4 py-3 -mt-4 relative z-10">
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex gap-2 pb-2 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.1}
        >
          {/* Sliding Indicator */}
          <motion.div
            className="absolute bottom-2 h-[calc(100%-8px)] bg-primary rounded-full z-0 pointer-events-none"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
          />
          
          {(['all', 'core', 'lifestyle', 'specialized'] as GroupType[]).map((group, index) => (
            <motion.button
              key={group}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => {
                setActiveGroup(group);
                // Scroll the selected tab into view
                tabsRef.current[index]?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'nearest', 
                  inline: 'center' 
                });
              }}
              whileTap={{ scale: 0.95 }}
              className={`relative z-10 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 snap-center flex-shrink-0 ${
                activeGroup === group
                  ? 'text-primary-foreground'
                  : 'bg-card text-muted-foreground border border-border hover:border-primary/30 active:bg-secondary'
              }`}
            >
              {groupLabels[group]}
            </motion.button>
          ))}
          
          {/* Extra padding for scroll */}
          <div className="w-4 flex-shrink-0" />
        </motion.div>
        
        {/* Scroll hint gradient */}
        <div className="absolute right-4 top-3 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
        {filteredCategories.map((category, index) => {
          const IconComponent = getCategoryIcon(category.name);
          const isExpanded = expandedCategory === category.name;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.name)}
                className="w-full p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-primary">{category.avgPrice}</span>
                  <span className="text-xs text-muted-foreground">{category.jobs.toLocaleString()} jobs</span>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {/* Sub-Services */}
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
                        <motion.button
                          key={subService.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIdx * 0.05 }}
                          onClick={() => handleSelectService(category, subService)}
                          className="w-full px-4 py-3 pl-16 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border/50 last:border-0"
                        >
                          <span className="text-sm text-foreground">{subService.name}</span>
                          <div className="flex items-center gap-2">
                            {subService.avgPrice && (
                              <span className="text-sm font-medium text-primary">{subService.avgPrice}</span>
                            )}
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </motion.button>
                      ))}
                      
                      {/* Book Any Service Button */}
                      <button
                        onClick={() => handleSelectService(category)}
                        className="w-full px-4 py-3 pl-16 flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 transition-colors text-primary font-medium text-sm"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">No Services Found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav active="home" userType="consumer" onNavigate={onNavigate} pendingQuotes={1} unreadMessages={2} />
    </div>
  );
};

export default ServicesScreen;
