import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Sphere, Text } from "@react-three/drei";

/** ---------- Math helpers ---------- **/
type Complex = { real: number; imag: number };

function cMul(a: Complex, b: Complex): Complex {
  return { real: a.real * b.real - a.imag * b.imag, imag: a.real * b.imag + a.imag * b.real };
}
function cConj(a: Complex): Complex {
  return { real: a.real, imag: -a.imag };
}
function cAbs2(a: Complex): number {
  return a.real * a.real + a.imag * a.imag;
}
function normalizeState([a, b]: [Complex, Complex]): [Complex, Complex] {
  const n = Math.sqrt(cAbs2(a) + cAbs2(b)) || 1;
  return [{ real: a.real / n, imag: a.imag / n }, { real: b.real / n, imag: b.imag / n }];
}

/** Bloch from pure state |ψ⟩ = α|0⟩ + β|1⟩  */
function blochFromAlphaBeta(alpha: Complex, beta: Complex) {
  const [a, b] = normalizeState([alpha, beta]);
  const aConj = cConj(a);
  const bConj = cConj(b);
  const aStarB = cMul(aConj, b);
  const bStarA = cMul(bConj, a);

  const x = aStarB.real + bStarA.real; // 2 Re(a* b)
  const y = aStarB.imag - bStarA.imag; // 2 Im(a* b)
  const z = cAbs2(a) - cAbs2(b);       // |a|^2 - |b|^2
  return { x, y, z };
}

/** Bloch from 2x2 density matrix ρ */
function blochFromDensity(rho: number[][]) {
  const rho00 = rho[0][0];
  const rho11 = rho[1][1];
  const rho01 = rho[0][1];
  const rx = 2 * rho01;
  const ry = 0; // no imaginary part for now
  const rz = rho00 - rho11;
  return { x: rx, y: ry, z: rz };
}

/** Reduced density matrix for one qubit */
function reduceSingleQubitDensity(statevector: Complex[], qubitIndex: 0 | 1): number[][] {
  const [a00, a01, a10, a11] = statevector;
  const cabs2 = (z: Complex) => z.real * z.real + z.imag * z.imag;

  if (qubitIndex === 0) {
    const rho00 = cAbs2(a00) + cAbs2(a01);
    const rho11 = cAbs2(a10) + cAbs2(a11);
    const rho01 = a00.real * a10.real + a00.imag * a10.imag +
                  a01.real * a11.real + a01.imag * a11.imag;
    return [[rho00, rho01], [rho01, rho11]];
  }

  const rho00 = cAbs2(a00) + cAbs2(a10);
  const rho11 = cAbs2(a01) + cAbs2(a11);
  const rho01 = a00.real * a01.real + a00.imag * a01.imag +
                a10.real * a11.real + a10.imag * a11.imag;
  return [[rho00, rho01], [rho01, rho11]];
}

/** ---------- 3D Scene bits ---------- **/
function TipArrow({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[0.05, 0.15, 16]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
}

function MeridiansAndParallels() {
  const rings = Array.from({ length: 8 }, (_, i) => (i + 1) / 9);
  const meridians = 12;

  const ringPoints = (r: number) =>
    Array.from({ length: 64 }, (_, j) => {
      const t = (j / 63) * Math.PI * 2;
      return [Math.cos(t) * r, Math.sin(t) * r, 0] as [number, number, number];
    });

  const meridianPoints = (phi: number) =>
    Array.from({ length: 64 }, (_, j) => {
      const t = -Math.PI / 2 + (j / 63) * Math.PI;
      const x = Math.cos(t) * Math.cos(phi);
      const y = Math.sin(t);
      const z = Math.cos(t) * Math.sin(phi);
      return [x, y, z] as [number, number, number];
    });

  return (
    <>
      {rings.map((r, i) => (
        <Line
          key={`ring-${i}`}
          points={ringPoints(Math.sqrt(1 - (1 - 2 * r) ** 2))}
          position={[0, 1 - 2 * r, 0]}
          lineWidth={1}
          transparent
          opacity={0.25}
        />
      ))}
      {Array.from({ length: meridians }, (_, k) => (k / meridians) * Math.PI * 2).map((phi, i) => (
        <Line key={`mer-${i}`} points={meridianPoints(phi)} lineWidth={1} transparent opacity={0.25} />
      ))}
    </>
  );
}

function Axes() {
  return (
    <>
      {/* X axis (red) */}
      <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} lineWidth={1.5} color="red" />
      {/* Y axis (green) */}
      <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} lineWidth={1.5} color="green" />
      {/* Z axis (blue) */}
      <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} lineWidth={1.5} color="blue" />

      {/* Labels as 3D text */}
      <Text position={[0, 1.35, 0]} fontSize={0.12} color="blue">+Z (|0⟩)</Text>
      <Text position={[0, -1.35, 0]} fontSize={0.12} color="blue">-Z (|1⟩)</Text>
      <Text position={[1.35, 0, 0]} fontSize={0.12} color="red">+X</Text>
      <Text position={[0, 0, 1.35]} fontSize={0.12} color="green">+Y</Text>
    </>
  );
}

export type BlochSphere3DProps = {
  alphaBeta?: { alpha: Complex; beta: Complex };
  density?: number[][];
  statevector2Q?: Complex[];
  qubitIndex?: 0 | 1;
  showGrid?: boolean;
  showAxes?: boolean;
  height?: number;
};

export const BlochSphere3D: React.FC<BlochSphere3DProps> = ({
  alphaBeta,
  density,
  statevector2Q,
  qubitIndex = 0,
  showGrid = true,
  showAxes = true,
  height = 320,
}) => {
  const r = useMemo(() => {
    if (alphaBeta) return blochFromAlphaBeta(alphaBeta.alpha, alphaBeta.beta);
    if (density) return blochFromDensity(density);
    if (statevector2Q && statevector2Q.length === 4) {
      const rho = reduceSingleQubitDensity(statevector2Q, qubitIndex);
      return blochFromDensity(rho);
    }
    return { x: 0, y: 0, z: 1 };
  }, [alphaBeta, density, statevector2Q, qubitIndex]);

  const len = Math.min(1, Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z) || 0);
  const tip: [number, number, number] = [
    r.x * (len ? 1 / Math.max(1, len) : 1),
    r.y * (len ? 1 / Math.max(1, len) : 1),
    r.z * (len ? 1 / Math.max(1, len) : 1),
  ];

  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <Canvas camera={{ position: [2.4, 2.2, 2.4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={0.8} />
        <directionalLight position={[-3, -4, -2]} intensity={0.4} />

        {/* Sphere */}
        <Sphere args={[1, 64, 64]}>
          <meshStandardMaterial
            color="#cccccc"
            metalness={0.1}
            roughness={0.6}
            transparent
            opacity={0.25}
          />
        </Sphere>

        {showGrid && <MeridiansAndParallels />}
        {showAxes && <Axes />}

        {/* State vector with arrowhead */}
        <Line points={[[0, 0, 0], tip]} lineWidth={3} color="black" />
        <TipArrow position={tip} />

        <OrbitControls enablePan={false} minDistance={1.8} maxDistance={6} />
      </Canvas>
    </div>
  );
};
