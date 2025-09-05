import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface EntanglementSectionProps {
  results: {
    entanglement?: {
      entropy?: number;
      fidelity?: number;
      coherence_time?: number;
      matrix?: number[][];
      schmidt?: number[];
    };
  };
}

export const EntanglementSection: React.FC<EntanglementSectionProps> = ({ results }) => {
  const ent = results.entanglement || {};
  const matrix = ent.matrix || [];
  const schmidt = ent.schmidt || [];

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Entanglement & Coherence Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Entanglement Entropy</p>
              <div className="text-2xl font-bold text-primary">
                {ent.entropy?.toFixed(3) ?? '—'}
              </div>
              <p className="text-xs text-muted-foreground">von Neumann entropy</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Coherence Time</p>
              <div className="text-2xl font-bold text-primary">
                {ent.coherence_time ? `${ent.coherence_time.toFixed(1)}μs` : '—'}
              </div>
              <p className="text-xs text-muted-foreground">T2 decoherence</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Gate Fidelity</p>
              <div className="text-2xl font-bold text-primary">
                {ent.fidelity ? `${(ent.fidelity * 100).toFixed(1)}%` : '—'}
              </div>
              <p className="text-xs text-muted-foreground">Average gate accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrix */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Qubit Entanglement Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          {matrix.length > 0 ? (
            <div className="space-y-4">
              <div
                className="gap-2 text-center text-sm"
                style={{ display: 'grid', gridTemplateColumns: `repeat(${matrix.length + 1}, minmax(0, 1fr))` }}
              >
                <div></div>
                {matrix.map((_, j) => (
                  <div key={`h-${j}`} className="font-medium">q{j}</div>
                ))}
                {matrix.map((row, i) => (
                  <React.Fragment key={i}>
                    <div className="font-medium">q{i}</div>
                    {row.map((val, j) => (
                      <div
                        key={j}
                        className="h-8 rounded flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: i === j ? 'hsl(var(--muted))' : 'hsl(var(--primary)/0.2)',
                          color: 'hsl(var(--foreground))'
                        }}
                      >
                        {val.toFixed(2)}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No entanglement matrix available</p>
          )}
        </CardContent>
      </Card>

      {/* Schmidt */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Schmidt Decomposition</CardTitle>
        </CardHeader>
        <CardContent>
          {schmidt.length > 0 ? (
            <div className="space-y-3">
              {schmidt.map((coeff, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="w-8 text-sm font-mono">λ{index}</span>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-4 relative overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${coeff * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
                        {coeff.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No Schmidt coefficients available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
