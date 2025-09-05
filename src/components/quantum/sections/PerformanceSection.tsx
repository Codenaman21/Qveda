import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceSectionProps {
  circuitJSON: any;
  results: {
    performance?: {
      depth?: number;
      width?: number;
      gate_count?: Record<string, number>;
      simulation_time?: number;
      memory_usage?: number;
      efficiency?: number;
      parallelization?: number;
      suggestions?: string[];
    };
  };
}

const COLORS = [
  '#3b82f6',
  '#22c55e',
  '#ef4444',
  '#f59e0b',
  '#6366f1',
  '#ec4899',
  '#14b8a6',
  '#a855f7',
];

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  circuitJSON,
  results,
}) => {
  const perf = results.performance || {};

  // Map backend "gate_count" → frontend "gate_distribution"
  const gateDistribution = perf.gate_count || {};

  // Convert to chart data
  const pieData = Object.entries(gateDistribution).map(([gate, count]) => ({
    name: gate,
    value: count,
  }));

  return (
    <div className="space-y-8">
      {/* Execution Statistics */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Circuit Execution Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Total Gates:</span>
              <span className="font-medium">{circuitJSON.gates.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Circuit Depth:</span>
              <span className="font-medium">{perf.depth ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Simulation Time:</span>
              <span className="font-medium">
                {perf.simulation_time
                  ? `${perf.simulation_time.toFixed(2)} ms`
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Memory Usage:</span>
              <span className="font-medium">
                {perf.memory_usage
                  ? `${perf.memory_usage.toFixed(1)} MB`
                  : '—'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gate Distribution */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Gate Distribution Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    labelLine={false}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No gate distribution available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Resource Optimization */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Resource Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Circuit Efficiency</p>
              <div className="text-2xl font-bold text-primary">
                {perf.efficiency
                  ? `${(perf.efficiency * 100).toFixed(1)}%`
                  : '—'}
              </div>
              <p className="text-xs text-muted-foreground">Optimal gate usage</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Parallelization</p>
              <div className="text-2xl font-bold text-primary">
                {perf.parallelization
                  ? `${perf.parallelization.toFixed(1)}x`
                  : '—'}
              </div>
              <p className="text-xs text-muted-foreground">Speedup potential</p>
            </div>
          </div>

          {perf.suggestions && perf.suggestions.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium">Optimization Suggestions</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                {perf.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
