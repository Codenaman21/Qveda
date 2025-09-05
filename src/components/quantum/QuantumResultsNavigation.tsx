import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, Zap, Settings, Activity, Download } from 'lucide-react';

interface QuantumResultsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const QuantumResultsNavigation: React.FC<QuantumResultsNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const sections = [
    { id: 'measurements', label: 'Measurements', icon: BarChart3 },
    { id: 'statevector', label: 'State Vector', icon: Zap },
    { id: 'entanglement', label: 'Entanglement', icon: Activity },
    { id: 'performance', label: 'Performance', icon: Settings },
    { id: 'analysis', label: 'AI Analysis', icon: Brain },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
      {sections.map((section) => {
        const IconComponent = section.icon;
        return (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            onClick={() => onSectionChange(section.id)}
            className="flex-shrink-0 rounded-lg"
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {section.label}
          </Button>
        );
      })}
    </div>
  );
};