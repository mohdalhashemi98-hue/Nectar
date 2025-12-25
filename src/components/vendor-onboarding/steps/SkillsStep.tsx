import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/stack-data';
import { useVendorOnboardingStore } from '@/stores/vendor-onboarding-store';
import { ScrollArea } from '@/components/ui/scroll-area';

// Generate skills from categories and their sub-services
const generateSkillsFromCategories = () => {
  const skills: { name: string; category: string }[] = [];
  
  categories.forEach(cat => {
    // Add category-level skills
    skills.push({ name: `${cat.name} Expert`, category: cat.name });
    
    // Add sub-service skills
    cat.subServices?.forEach(sub => {
      skills.push({ name: sub.name, category: cat.name });
    });
  });
  
  // Add some general skills
  const generalSkills = [
    'Emergency Response',
    'Weekend Availability',
    'Same-Day Service',
    'Eco-Friendly Solutions',
    'Smart Home Integration',
    'Commercial Projects',
    'Residential Specialist',
    'Senior Technician',
    'Project Management',
    'Customer Relations',
    'Quality Assurance',
    'Safety Certified',
  ];
  
  generalSkills.forEach(skill => {
    skills.push({ name: skill, category: 'General' });
  });
  
  return skills;
};

const allSkills = generateSkillsFromCategories();

interface SkillsStepProps {
  onValidChange: (isValid: boolean) => void;
}

const SkillsStep = ({ onValidChange }: SkillsStepProps) => {
  const { data, addSkill, removeSkill } = useVendorOnboardingStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter skills based on search and selected category
  const filteredSkills = useMemo(() => {
    let skills = allSkills;
    
    // If a category is selected, prioritize those skills
    if (data.serviceCategory) {
      skills = skills.filter(
        s => s.category === data.serviceCategory || s.category === 'General'
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      skills = skills.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return skills;
  }, [searchQuery, data.serviceCategory]);

  // Validate - at least 3 skills required
  useEffect(() => {
    onValidChange(data.skills.length >= 3);
  }, [data.skills.length, onValidChange]);

  const isSelected = (skillName: string) => data.skills.includes(skillName);

  const toggleSkill = (skillName: string) => {
    if (isSelected(skillName)) {
      removeSkill(skillName);
    } else {
      addSkill(skillName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Skills */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">Selected Skills</span>
          <Badge variant="secondary" className="ml-auto">
            {data.skills.length} selected
          </Badge>
        </div>
        
        <div className="min-h-[60px] p-3 bg-secondary/50 rounded-2xl border border-border">
          <AnimatePresence mode="popLayout">
            {data.skills.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center py-2"
              >
                Select at least 3 skills from below
              </motion.p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                  >
                    <Badge 
                      variant="default"
                      className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-primary/90"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill}
                      <X className="w-3 h-3" />
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {data.skills.length < 3 && data.skills.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Add {3 - data.skills.length} more skill{3 - data.skills.length > 1 ? 's' : ''} to continue
          </p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills..."
          className="input-modern pl-12"
        />
      </div>

      {/* Skills Grid */}
      <ScrollArea className="h-[280px] pr-4">
        <div className="space-y-4">
          {/* Group by category */}
          {data.serviceCategory && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {data.serviceCategory} Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {filteredSkills
                  .filter(s => s.category === data.serviceCategory)
                  .map((skill) => (
                    <motion.button
                      key={skill.name}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSkill(skill.name)}
                      className={`
                        px-3 py-2 rounded-xl text-sm font-medium transition-all
                        flex items-center gap-1.5
                        ${isSelected(skill.name)
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-secondary text-foreground border border-border hover:border-primary/30'
                        }
                      `}
                    >
                      {isSelected(skill.name) && <Check className="w-3.5 h-3.5" />}
                      {skill.name}
                    </motion.button>
                  ))}
              </div>
            </div>
          )}
          
          {/* General Skills */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              General Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {filteredSkills
                .filter(s => s.category === 'General')
                .map((skill) => (
                  <motion.button
                    key={skill.name}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill.name)}
                    className={`
                      px-3 py-2 rounded-xl text-sm font-medium transition-all
                      flex items-center gap-1.5
                      ${isSelected(skill.name)
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-secondary text-foreground border border-border hover:border-primary/30'
                      }
                    `}
                  >
                    {isSelected(skill.name) && <Check className="w-3.5 h-3.5" />}
                    {skill.name}
                  </motion.button>
                ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SkillsStep;
