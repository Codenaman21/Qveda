import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface MeasurementsSectionProps {
  results: {
    counts?: Record<string, number>;
    probabilities?: Record<string, number>;
  };
}

export const MeasurementsSection: React.FC<MeasurementsSectionProps> = ({ results }) => {
  const data = Object.entries(results.probabilities || {}).map(([state, prob]) => ({
    state,
    probability: prob,
    count: results.counts?.[state] ?? 0,
  }));

  return (
    <div className="space-y-8">
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Measurement Probabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((d, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-mono">{d.state}</div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${d.probability * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
                      {(d.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="w-16 text-sm font-mono text-muted-foreground">{d.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proper Histogram with Axes */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Measurement Histogram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" label={{ value: 'States', position: 'insideBottom', offset: -5 }} />
                <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip
                  formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
                  labelFormatter={(label) => `State: ${label}`}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
