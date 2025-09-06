import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlochSphere3D } from "@/components/ui/BlochSphere";
import { Zap } from 'lucide-react';

interface StateVectorSectionProps {
  results: {
    statevector?: { real: number; imag: number }[];
  };
}

export const StateVectorSection: React.FC<StateVectorSectionProps> = ({ results }) => {
  const statevector = results.statevector || [];

  if (statevector.length === 0) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>No Statevector Data Available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quantum State Vector Components */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Quantum State Vector Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statevector.map((amp, idx) => {
              const magnitude = Math.sqrt(amp.real ** 2 + amp.imag ** 2);
              const phase = Math.atan2(amp.imag, amp.real);
              return (
                <div key={idx} className="text-center">
                  <div className="h-32 bg-muted rounded-lg mb-2 flex items-end justify-center p-2">
                    <div
                      className="w-6 bg-primary rounded-t"
                      style={{ height: `${magnitude * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    |{idx.toString(2).padStart(Math.log2(statevector.length), '0')}⟩
                  </p>
                  <p className="text-xs">Mag: {magnitude.toFixed(3)}</p>
                  <p className="text-xs">Phase: {phase.toFixed(2)} rad</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bloch Sphere Representation */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Bloch Sphere Representation</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Real interactive 3D Bloch sphere */}
          <BlochSphere3D
            alphaBeta={{
              alpha: { real: 1, imag: 0 },
              beta: { real: 0, imag: 0 },
            }}
            showGrid
            showAxes
            height={256} // matches your old h-64 = 16rem
          />
        </CardContent>
      </Card>

      {/* State Amplitude & Phase Details */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>State Amplitude & Phase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {statevector.map((amp, idx) => {
              const magnitude = Math.sqrt(amp.real ** 2 + amp.imag ** 2);
              const phase = Math.atan2(amp.imag, amp.real);
              return (
                <div key={idx} className="grid grid-cols-4 gap-4 text-sm">
                  <div className="font-mono">
                    |{idx.toString(2).padStart(Math.log2(statevector.length), '0')}⟩
                  </div>
                  <div>Amp: {magnitude.toFixed(3)}</div>
                  <div>Phase: {phase.toFixed(2)} rad</div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${magnitude * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
