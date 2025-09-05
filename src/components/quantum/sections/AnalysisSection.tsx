import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface AnalysisSectionProps {
  circuitJSON: any;
  results?: {
    analysis?: {
      summary?: string;
      details?: string[];
      detected_pattern?: string;
      confidence?: number;
      complexity_class?: string;
      applications?: string[];
      insights?: { title: string; text: string }[];
    };
  };
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ circuitJSON, results }) => {
  const [expandedSummary, setExpandedSummary] = useState(true);
  const analysis = results?.analysis ?? {};

  // ✅ Stronger logging for debugging
  console.log("🧠 Full results prop:", results);
  console.log("🧠 Analysis extracted:", analysis);

  const qubitsCount = circuitJSON?.qubits?.length ?? 0;
  const gatesCount = circuitJSON?.gates?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* AI Summary */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Circuit Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm leading-relaxed text-foreground">
            <p className="mb-3">
              {analysis.summary ||
                `Your quantum circuit has ${qubitsCount} qubit${qubitsCount !== 1 ? 's' : ''} and ${gatesCount} gate${gatesCount !== 1 ? 's' : ''}.`}
            </p>

            {analysis.details?.length ? (
              analysis.details.map((d, i) => (
                <p key={i} className="mb-3">
                  {d}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">
                No extended analysis provided by backend
              </p>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setExpandedSummary(!expandedSummary)}
            className="rounded-lg"
          >
            <Brain className="w-4 h-4 mr-2" />
            {expandedSummary ? 'Show Less Analysis' : 'Get More AI Analysis'}
          </Button>
        </CardContent>
      </Card>

      {/* Algorithm Detection */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Quantum Algorithm Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-2">Detected Pattern</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {analysis.detected_pattern || 'No pattern detected'}
              </p>
              {analysis.confidence !== undefined && (
                <div className="text-xs text-primary">
                  {(analysis.confidence * 100).toFixed(1)}% confidence
                </div>
              )}
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-2">Complexity Class</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {analysis.complexity_class || '—'}
              </p>
            </div>
          </div>

          {analysis.applications?.length ? (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Potential Applications</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {analysis.applications.map((app, i) => (
                  <div key={i} className="text-xs p-2 bg-muted rounded text-center">
                    {app}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Advanced Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.insights?.length ? (
              analysis.insights.map((ins, i) => (
                <div key={i} className="border-l-4 border-primary pl-4">
                  <p className="font-medium text-sm">{ins.title}</p>
                  <p className="text-xs text-muted-foreground">{ins.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional insights available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
