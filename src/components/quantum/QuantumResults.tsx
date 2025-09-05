import React, { useState } from 'react';
import { QuantumResultsNavigation } from './QuantumResultsNavigation';
import { MeasurementsSection } from './sections/MeasurementsSection';
import { StateVectorSection } from './sections/StateVectorSection';
import { EntanglementSection } from './sections/EntanglementSection';
import { PerformanceSection } from './sections/PerformanceSection';
import { AnalysisSection } from './sections/AnalysisSection';
import { ExportSection } from './sections/ExportSection';

interface QuantumResultsProps {
  circuitJSON: any;
  results: any;
  onExportCode: () => void;
}

export const QuantumResults: React.FC<QuantumResultsProps> = ({
  circuitJSON,
  results,
  onExportCode
}) => {
  const [activeSection, setActiveSection] = useState('measurements');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'measurements':
        return <MeasurementsSection results={results} />;
      case 'statevector':
        return <StateVectorSection results={results} />;
      case 'entanglement':
        return <EntanglementSection results={results} />;
      case 'performance':
        return <PerformanceSection circuitJSON={circuitJSON} results={results} />;
      case 'analysis':
        return <AnalysisSection circuitJSON={circuitJSON } results={results} />;
      case 'export':
        return <ExportSection circuitJSON={circuitJSON} onExportCode={onExportCode} />;
      default:
        return <MeasurementsSection results={results} />;
    }
  };

  return (
    <div className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Simulation Results</h2>
          <p className="text-muted-foreground">Analysis of your quantum circuit</p>
        </div>

        <QuantumResultsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {renderActiveSection()}
      </div>
    </div>
  );
};
